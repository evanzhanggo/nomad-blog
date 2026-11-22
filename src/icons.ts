import {
  APPLE_TOUCH_PNG,
  decodeAsset,
  FAVICON_ICO,
  FAVICON_SVG,
  ICON_512_PNG,
  OG_PNG,
} from "./brand-assets";

const CACHE = "public, max-age=2592000";

const MANIFEST = JSON.stringify({
  name: "游牧手记",
  short_name: "游牧手记",
  icons: [{ src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" }],
  theme_color: "#0c5f57",
  background_color: "#f4efe4",
  display: "standalone",
  start_url: "/",
});

const FILES: Record<string, { type: string; body: string | Uint8Array }> = {
  "/favicon.svg": { type: "image/svg+xml; charset=utf-8", body: FAVICON_SVG },
  "/favicon.ico": { type: "image/x-icon", body: decodeAsset(FAVICON_ICO) },
  "/apple-touch-icon.png": { type: "image/png", body: decodeAsset(APPLE_TOUCH_PNG) },
  "/icon-512.png": { type: "image/png", body: decodeAsset(ICON_512_PNG) },
  "/og.png": { type: "image/png", body: decodeAsset(OG_PNG) },
  "/manifest.webmanifest": { type: "application/manifest+json; charset=utf-8", body: MANIFEST },
};

export function iconResponse(pathname: string): Response | null {
  const file = FILES[pathname];
  if (!file) return null;
  return new Response(file.body, {
    headers: {
      "content-type": file.type,
      "cache-control": CACHE,
      "x-content-type-options": "nosniff",
    },
  });
}
