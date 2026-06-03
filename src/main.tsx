import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import App from './App.tsx';
import './index.css';
import { APP_BUILD_ID } from './lib/cache-utils';

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

const clearAllCaches = async () => {
  const wasControlledByServiceWorker = Boolean(navigator.serviceWorker?.controller);

  if ("serviceWorker" in navigator) {
    const registrations = await navigator.serviceWorker.getRegistrations();
    await Promise.all(registrations.map((registration) => registration.unregister()));
  }

  if ("caches" in window) {
    const cacheNames = await caches.keys();
    await Promise.all(cacheNames.map((cacheName) => caches.delete(cacheName)));
  }

  return wasControlledByServiceWorker;
};

// Auto-clear when build ID changes (works on preview AND production)
const checkBuildIdAndMaybeReload = async (): Promise<boolean> => {
  try {
    const stored = localStorage.getItem(BUILD_ID_KEY);
    if (stored && stored !== APP_BUILD_ID) {
      const alreadyReloaded = sessionStorage.getItem(BUILD_RELOAD_KEY) === APP_BUILD_ID;
      if (!alreadyReloaded) {
        console.info(`[wharis] Build changed: ${stored} → ${APP_BUILD_ID}. Clearing cache.`);
        await clearAllCaches();
        localStorage.setItem(BUILD_ID_KEY, APP_BUILD_ID);
        sessionStorage.setItem(BUILD_RELOAD_KEY, APP_BUILD_ID);
        const url = new URL(window.location.href);
        url.searchParams.set("v", Date.now().toString());
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
    const wasControlled = await clearAllCaches();
    const alreadyReloaded = sessionStorage.getItem(PREVIEW_CACHE_REFRESH_KEY) === "1";
    if (wasControlled && !alreadyReloaded) {
      sessionStorage.setItem(PREVIEW_CACHE_REFRESH_KEY, "1");
      window.location.reload();
      return;
    }
    sessionStorage.removeItem(PREVIEW_CACHE_REFRESH_KEY);
  }

  renderApp();
};

bootstrap().catch(() => renderApp());
