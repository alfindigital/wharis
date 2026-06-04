function isAppCacheForThisRegistration(name) {
  const hasKnownAppBucket = /(^|-)precache-v\d+-|(^|-)runtime-|(^|-)googleAnalytics-|^wharis-/.test(name);
  return hasKnownAppBucket && (name.endsWith(self.registration.scope) || name.startsWith("wharis-"));
}

self.addEventListener("install", () => self.skipWaiting());

self.addEventListener("activate", (event) =>
  event.waitUntil(
    (async () => {
      try {
        const cacheNames = await caches.keys();
        const appCacheNames = cacheNames.filter(isAppCacheForThisRegistration);
        await Promise.allSettled(appCacheNames.map((name) => caches.delete(name)));
        await self.clients.claim();

        const windowClients = await self.clients.matchAll({ type: "window" });
        await Promise.allSettled(
          windowClients.map((client) => {
            const url = new URL(client.url);
            url.searchParams.set("sw-cleanup", Date.now().toString());
            return client.navigate(url.toString());
          }),
        );
      } finally {
        await self.registration.unregister();
      }
    })(),
  ),
);