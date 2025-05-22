import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import {
  NavigationRoute,
  NetworkOnly,
  PrecacheFallbackPlugin,
  Serwist,
  StaleWhileRevalidate,
} from "serwist";

// This declares the value of `injectionPoint` to TypeScript.
// `injectionPoint` is the string that will be replaced by the
// actual precache manifest. By default, this string is set to
// `"self.__SW_MANIFEST"`.
declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  fallbacks: {
    entries: [
      {
        url: "/offline",
        matcher({ request }) {
          return request.mode === "navigate";
        },
      },
    ],
  },
  runtimeCaching: [
    {
      matcher: ({ request }) =>
        request.destination === "script" || request.destination === "style",
      handler: new StaleWhileRevalidate(),
    },
    {
      matcher: ({ request }) => request.destination === "image",
      handler: new StaleWhileRevalidate(),
    },
    {
      matcher: ({ url }) => url.pathname.startsWith("/api/"),
      handler: new NetworkOnly(),
    },
  ],
});
serwist.registerRoute(
  new NavigationRoute(
    new NetworkOnly({
      plugins: [
        new PrecacheFallbackPlugin({
          fallbackUrls: ["/offline"],
          serwist,
        }),
      ],
    })
  )
);

serwist.addEventListeners();
