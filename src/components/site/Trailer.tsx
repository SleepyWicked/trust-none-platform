"use client";

import { useState } from "react";
import { STILLS, TRAILER_URL } from "@/lib/film";

const isBunny = (url: string) => url.includes("mediadelivery.net");
const embedFor = (url: string) =>
  isBunny(url) ? `${url.replace("/play/", "/embed/")}?autoplay=true&preload=true&responsive=true` : url;

export default function Trailer() {
  const [playing, setPlaying] = useState(false);
  const hasTrailer = TRAILER_URL.length > 0;

  return (
    <div className="relative aspect-video w-full overflow-hidden bg-void">
      {playing && hasTrailer ? (
        isBunny(TRAILER_URL) ? (
          <iframe
            src={embedFor(TRAILER_URL)}
            title="Trust None — official trailer"
            className="absolute inset-0 h-full w-full"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <video src={TRAILER_URL} className="absolute inset-0 h-full w-full" controls autoPlay playsInline />
        )
      ) : (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={STILLS[2]} alt="" className="absolute inset-0 h-full w-full object-cover opacity-70" />
          <div className="absolute inset-0 bg-black/30" />
          {hasTrailer ? (
            <button
              onClick={() => setPlaying(true)}
              className="group absolute inset-0 flex flex-col items-center justify-center gap-3"
              aria-label="Play the official trailer"
            >
              <span className="play-ring">
                <svg width="30" height="30" viewBox="0 0 24 24" fill="#fff" className="ml-1.5" aria-hidden="true">
                  <path d="M6 4l14 8-14 8z" />
                </svg>
              </span>
              <span className="eyebrow">Watch the trailer</span>
            </button>
          ) : (
            <p className="eyebrow absolute inset-0 flex items-center justify-center">Trailer coming soon</p>
          )}
        </>
      )}
    </div>
  );
}
