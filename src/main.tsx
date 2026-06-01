import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import App from './App.tsx';
import './index.css';

const PREVIEW_CACHE_REFRESH_KEY = "wharis-preview-cache-cleared-v1";

const renderApp = () => {
  createRoot(document.getElementById("root")!).render(
    <HelmetProvider>
      <App />
    </HelmetProvider>
  );
};

// PWA guard: don't let an old service worker/cache serve stale Lovable preview UI
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

const clearPreviewPwaCache = async () => {
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

if (isPreviewHost || isInIframe) {
  clearPreviewPwaCache()
    .then((wasControlledByServiceWorker) => {
      const alreadyReloaded = sessionStorage.getItem(PREVIEW_CACHE_REFRESH_KEY) === "1";

      if (wasControlledByServiceWorker && !alreadyReloaded) {
        sessionStorage.setItem(PREVIEW_CACHE_REFRESH_KEY, "1");
        window.location.reload();
        return;
      }

      sessionStorage.removeItem(PREVIEW_CACHE_REFRESH_KEY);
      renderApp();
    })
    .catch(() => renderApp());
} else {
  renderApp();
}
