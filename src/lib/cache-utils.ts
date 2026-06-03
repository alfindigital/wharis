export const APP_BUILD_ID =
  typeof __APP_BUILD_ID__ !== "undefined" ? __APP_BUILD_ID__ : "dev";

export interface CacheStatus {
  supported: boolean;
  controlled: boolean;
  registrations: Array<{
    scope: string;
    state: string;
    scriptURL: string;
  }>;
  cacheNames: string[];
  buildId: string;
  lastClearedAt: string | null;
}

const LAST_CLEARED_KEY = "wharis-cache-last-cleared";

export async function getCacheStatus(): Promise<CacheStatus> {
  const swSupported = "serviceWorker" in navigator;
  const cachesSupported = "caches" in window;

  const registrations =
    swSupported
      ? (await navigator.serviceWorker.getRegistrations()).map((r) => {
          const worker = r.active || r.waiting || r.installing;
          return {
            scope: r.scope,
            state: worker?.state ?? "none",
            scriptURL: worker?.scriptURL ?? "(none)",
          };
        })
      : [];

  const cacheNames = cachesSupported ? await caches.keys() : [];

  return {
    supported: swSupported && cachesSupported,
    controlled: Boolean(navigator.serviceWorker?.controller),
    registrations,
    cacheNames,
    buildId: APP_BUILD_ID,
    lastClearedAt: localStorage.getItem(LAST_CLEARED_KEY),
  };
}

export async function forceClearCacheAndReload() {
  try {
    if ("serviceWorker" in navigator) {
      const regs = await navigator.serviceWorker.getRegistrations();
      await Promise.all(regs.map((r) => r.unregister()));
    }
    if ("caches" in window) {
      const names = await caches.keys();
      await Promise.all(names.map((n) => caches.delete(n)));
    }
    localStorage.setItem(LAST_CLEARED_KEY, new Date().toISOString());
  } catch (e) {
    console.error("[cache-utils] clear failed", e);
  }
  // Cache-bust the URL so the browser refetches index.html
  const url = new URL(window.location.href);
  url.searchParams.set("v", Date.now().toString());
  window.location.replace(url.toString());
}
