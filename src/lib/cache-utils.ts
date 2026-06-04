export const APP_BUILD_ID =
  typeof __APP_BUILD_ID__ !== "undefined" ? __APP_BUILD_ID__ : "dev";

export interface CacheClearEvent {
  id: string;
  clearedAt: string;
  reason: string;
  buildId: string;
  previousBuildId: string | null;
  controllerWasActive: boolean;
  registrationsUnregistered: string[];
  deletedCacheNames: string[];
  failedCacheNames: string[];
  url: string;
}

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
  lastClearEvent: CacheClearEvent | null;
  clearHistory: CacheClearEvent[];
}

const LAST_CLEARED_KEY = "wharis-cache-last-cleared";
const CACHE_CLEAR_HISTORY_KEY = "wharis-cache-clear-history";
const MAX_HISTORY_ITEMS = 12;

const safeLocalStorageGet = (key: string) => {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
};

const safeLocalStorageSet = (key: string, value: string) => {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Ignore storage errors so cache cleanup still runs.
  }
};

export function getCacheClearHistory(): CacheClearEvent[] {
  const raw = safeLocalStorageGet(CACHE_CLEAR_HISTORY_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.slice(0, MAX_HISTORY_ITEMS) : [];
  } catch {
    return [];
  }
}

export function recordCacheClearEvent(
  event: Omit<CacheClearEvent, "id" | "clearedAt" | "buildId" | "url"> &
    Partial<Pick<CacheClearEvent, "id" | "clearedAt" | "buildId" | "url">>,
) {
  const clearedAt = event.clearedAt ?? new Date().toISOString();
  const entry: CacheClearEvent = {
    id: event.id ?? `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    clearedAt,
    reason: event.reason,
    buildId: event.buildId ?? APP_BUILD_ID,
    previousBuildId: event.previousBuildId ?? null,
    controllerWasActive: event.controllerWasActive,
    registrationsUnregistered: event.registrationsUnregistered,
    deletedCacheNames: event.deletedCacheNames,
    failedCacheNames: event.failedCacheNames,
    url: event.url ?? window.location.href,
  };

  const history = [entry, ...getCacheClearHistory()].slice(0, MAX_HISTORY_ITEMS);
  safeLocalStorageSet(CACHE_CLEAR_HISTORY_KEY, JSON.stringify(history));
  safeLocalStorageSet(LAST_CLEARED_KEY, clearedAt);
  return entry;
}

export async function clearBrowserCaches({
  reason,
  previousBuildId = null,
}: {
  reason: string;
  previousBuildId?: string | null;
}) {
  const controllerWasActive = Boolean(navigator.serviceWorker?.controller);
  const registrationsUnregistered: string[] = [];
  const deletedCacheNames: string[] = [];
  const failedCacheNames: string[] = [];

  if ("serviceWorker" in navigator) {
    const registrations = await navigator.serviceWorker.getRegistrations();
    const labels = registrations.map((registration) => {
      const worker = registration.active || registration.waiting || registration.installing;
      return worker?.scriptURL ?? registration.scope;
    });
    const results = await Promise.allSettled(
      registrations.map((registration) => registration.unregister()),
    );

    results.forEach((result, index) => {
      if (result.status === "fulfilled" && result.value) {
        registrationsUnregistered.push(labels[index]);
      }
    });
  }

  if ("caches" in window) {
    const cacheNames = await caches.keys();
    const results = await Promise.allSettled(
      cacheNames.map((cacheName) => caches.delete(cacheName)),
    );

    results.forEach((result, index) => {
      const cacheName = cacheNames[index];
      if (result.status === "fulfilled" && result.value) {
        deletedCacheNames.push(cacheName);
      } else {
        failedCacheNames.push(cacheName);
      }
    });
  }

  return recordCacheClearEvent({
    reason,
    previousBuildId,
    controllerWasActive,
    registrationsUnregistered,
    deletedCacheNames,
    failedCacheNames,
  });
}

export async function getCacheStatus(): Promise<CacheStatus> {
  const swSupported = "serviceWorker" in navigator;
  const cachesSupported = "caches" in window;
  const clearHistory = getCacheClearHistory();

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
    lastClearedAt: safeLocalStorageGet(LAST_CLEARED_KEY),
    lastClearEvent: clearHistory[0] ?? null,
    clearHistory,
  };
}

export async function forceClearCacheAndReload() {
  try {
    await clearBrowserCaches({ reason: "Tombol manual: paksa refresh & bersihkan cache" });
  } catch (e) {
    console.error("[cache-utils] clear failed", e);
  }

  const url = new URL(window.location.href);
  url.searchParams.set("v", APP_BUILD_ID);
  url.searchParams.set("refresh", Date.now().toString());
  window.location.replace(url.toString());
}
