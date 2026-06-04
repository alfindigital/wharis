import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import App from './App.tsx';
import './index.css';
import { APP_BUILD_ID, clearBrowserCaches } from './lib/cache-utils';

const PREVIEW_CACHE_REFRESH_KEY = "wharis-preview-cache-cleared-v1";
const BUILD_ID_KEY = "wharis-build-id";
const BUILD_RELOAD_KEY = "wharis-build-reload-done";

const renderApp = () => {
  createRoot(document.getElementById("root")!).render(
    <HelmetProvider>
      <App />
    </HelmetProvider>
  );
};

const isInIframe = (() => {
  try {
    return window.self !== window.top;
  } catch {
    return true;
  }
})();

const isPreviewHost =
  window.location.hostname.includes("id-preview--") ||
  window.location.hostname.includes("lovableproject.com");

const clearAllCaches = (reason: string, previousBuildId: string | null = null) =>
  clearBrowserCaches({ reason, previousBuildId });

// Auto-clear when build ID changes (works on preview AND production)
const checkBuildIdAndMaybeReload = async (): Promise<boolean> => {
  try {
    const stored = localStorage.getItem(BUILD_ID_KEY);
    if (stored && stored !== APP_BUILD_ID) {
      const alreadyReloaded = sessionStorage.getItem(BUILD_RELOAD_KEY) === APP_BUILD_ID;
      if (!alreadyReloaded) {
        console.info(`[wharis] Build changed: ${stored} → ${APP_BUILD_ID}. Clearing cache.`);
        await clearAllCaches(`Build berubah: ${stored} → ${APP_BUILD_ID}`, stored);
        localStorage.setItem(BUILD_ID_KEY, APP_BUILD_ID);
        sessionStorage.setItem(BUILD_RELOAD_KEY, APP_BUILD_ID);
        const url = new URL(window.location.href);
        url.searchParams.set("v", APP_BUILD_ID);
        url.searchParams.set("refresh", Date.now().toString());
        window.location.replace(url.toString());
        return true; // reloading
      }
    }
    localStorage.setItem(BUILD_ID_KEY, APP_BUILD_ID);
  } catch (e) {
    console.error("[wharis] build-id check failed", e);
  }
  return false;
};

const bootstrap = async () => {
  // 1) Build-ID auto-clear (all environments)
  const reloading = await checkBuildIdAndMaybeReload();
  if (reloading) return;

  // 2) Preview/iframe: always strip any leftover SW/cache
  if (isPreviewHost || isInIframe) {
    const clearEvent = await clearAllCaches("Preview dibuka: validasi versi terbaru", APP_BUILD_ID);
    const alreadyReloaded = sessionStorage.getItem(PREVIEW_CACHE_REFRESH_KEY) === "1";
    const hadStaleBrowserState =
      clearEvent.controllerWasActive ||
      clearEvent.registrationsUnregistered.length > 0 ||
      clearEvent.deletedCacheNames.length > 0;

    if (hadStaleBrowserState && !alreadyReloaded) {
      sessionStorage.setItem(PREVIEW_CACHE_REFRESH_KEY, "1");
      const url = new URL(window.location.href);
      url.searchParams.set("v", APP_BUILD_ID);
      url.searchParams.set("refresh", Date.now().toString());
      window.location.replace(url.toString());
      return;
    }
    sessionStorage.removeItem(PREVIEW_CACHE_REFRESH_KEY);
  }

  renderApp();
};

bootstrap().catch(() => renderApp());
