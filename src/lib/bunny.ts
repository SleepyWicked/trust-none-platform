import { createHash } from "crypto";

// Builds the Bunny Stream embed URL for the full movie. With
// BUNNY_TOKEN_AUTH_KEY set (Stream library → Security → Embed view token
// authentication), the URL is signed and expires, so a copied link stops
// working. Server-only: the movie's ids never reach the browser unpaid.
export function movieEmbedUrl(ttlSeconds = 6 * 60 * 60): string | null {
  const libraryId = process.env.BUNNY_STREAM_LIBRARY_ID;
  const videoId = process.env.BUNNY_MOVIE_VIDEO_ID;
  if (!libraryId || !videoId) return null;

  const url = new URL(`https://iframe.mediadelivery.net/embed/${libraryId}/${videoId}`);
  url.searchParams.set("autoplay", "true");
  url.searchParams.set("preload", "true");
  url.searchParams.set("responsive", "true");

  const tokenKey = process.env.BUNNY_TOKEN_AUTH_KEY;
  if (tokenKey) {
    const expires = Math.floor(Date.now() / 1000) + ttlSeconds;
    const token = createHash("sha256").update(tokenKey + videoId + expires).digest("hex");
    url.searchParams.set("token", token);
    url.searchParams.set("expires", String(expires));
  }
  return url.toString();
}
