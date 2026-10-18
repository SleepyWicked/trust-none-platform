import Link from "next/link";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import Trailer from "@/components/site/Trailer";
import FilmOffers from "@/components/site/FilmOffers";
import ProductCard from "@/components/site/ProductCard";
import EmailSignup from "@/components/site/EmailSignup";
import { CAST_AND_CREW, CREDITS, FILM, HERO_STILL, STILLS } from "@/lib/film";
import { PRODUCTS } from "@/lib/catalog";

function SectionTitle({ children, aside }: { children: React.ReactNode; aside?: string }) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4">
      <h2 className="display text-7xl">{children}</h2>
      {aside && <p className="max-w-[32ch] text-right text-sm text-haze">{aside}</p>}
    </div>
  );
}

export default function Home() {
  return (
    <>
      <SiteHeader overlay />
      <main>
        {/* Hero */}
        <section className="relative flex min-h-svh flex-col justify-end overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={HERO_STILL} alt="" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,.6)_0%,rgba(0,0,0,.15)_35%,rgba(25,25,25,.88)_78%,#191919_100%)]" />
          <div className="relative mx-auto w-full max-w-6xl px-5 pb-10">
            <h1 className="display text-[clamp(7.5rem,30vw,14rem)]">
              Trust
              <br />
              None
            </h1>
            <p className="mt-2 text-[15px] font-light uppercase tracking-[0.08em] text-chalk">
              {FILM.tagline} — Now Streaming
            </p>
            <ul className="mt-4 flex flex-wrap gap-2" aria-label="Film details">
              <li className="eyebrow border-2 border-paper px-2.5 py-1.5 text-xs">Rated {FILM.rating}</li>
              <li className="eyebrow border border-line px-2.5 py-1.5 text-xs text-chalk">Chicago</li>
              <li className="eyebrow border border-line px-2.5 py-1.5 text-xs text-chalk">Feature Film</li>
            </ul>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <a href="#watch" className="btn btn-solid">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6 4l14 8-14 8z" /></svg>
                Watch the Trailer
              </a>
              <a href="#watch" className="btn btn-ghost">Rent or Buy</a>
            </div>
          </div>
        </section>

        {/* Trailer + rent/buy */}
        <section id="watch" className="scroll-mt-4 py-14">
          <div className="mx-auto grid max-w-6xl gap-8 px-5 lg:grid-cols-[3fr_2fr] lg:items-center">
            <Trailer />
            <div>
              <h2 className="display text-7xl">Watch Trust None</h2>
              <p className="mt-3 text-chalk">{FILM.synopsis}</p>
              <div className="mt-6">
                <FilmOffers />
              </div>
            </div>
          </div>
        </section>

        {/* Stills */}
        <section className="py-14" aria-labelledby="stills-title">
          <div className="mx-auto max-w-6xl px-5">
            <SectionTitle aside="Frames from the film. Shot on the streets of Chicago.">
              <span id="stills-title">Stills</span>
            </SectionTitle>
            <ul className="grid auto-cols-[78%] grid-flow-col gap-2.5 overflow-x-auto pb-2 sm:auto-cols-[32%]" style={{ scrollSnapType: "x mandatory" }}>
              {STILLS.slice(1).map((src) => (
                <li key={src} className="aspect-[16/10] bg-void" style={{ scrollSnapAlign: "start" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt="Still from Trust None" loading="lazy" className="h-full w-full object-cover" />
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Cast & crew */}
        <section id="cast" className="scroll-mt-4 py-14">
          <div className="mx-auto max-w-6xl px-5">
            <SectionTitle aside="Chicago artists, on screen and behind the camera.">Cast &amp; Crew</SectionTitle>
            <ul className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
              {CAST_AND_CREW.map((p) => (
                <li
                  key={p.name}
                  className={`flex min-h-32 flex-col justify-between gap-3 border border-line p-4 ${p.lead ? "col-span-2 bg-void sm:col-span-3" : ""}`}
                >
                  <p className="display text-4xl">{p.name}</p>
                  <p className="text-xs uppercase tracking-[0.08em] text-haze">{p.role}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Shop preview */}
        <section className="py-14">
          <div className="mx-auto max-w-6xl px-5">
            <SectionTitle aside="DVDs, music and merch from the film and its artists.">Shop</SectionTitle>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {PRODUCTS.slice(0, 4).map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
            <Link href="/shop" className="mt-6 inline-flex min-h-11 items-center border-b border-paper text-sm font-semibold uppercase tracking-[0.14em]">
              Visit the shop →
            </Link>
          </div>
        </section>

        {/* Credits */}
        <section className="border-y border-line py-10 text-center" aria-label="Credits">
          <div className="mx-auto max-w-3xl px-5">
            <p className="text-xs uppercase leading-loose tracking-[0.16em] text-chalk">
              {CREDITS.map((c, i) => (
                <span key={i}>
                  {c.label && <>{c.label} </>}
                  <b className="font-bold text-paper">{c.names}</b>
                  {i < CREDITS.length - 1 && " · "}
                </span>
              ))}
            </p>
            <div className="mt-6 inline-grid grid-cols-[auto_1fr] items-center gap-2.5 border-2 border-paper px-3 py-2 text-left">
              <span className="text-4xl font-bold leading-none">R</span>
              <span className="text-[11px] uppercase tracking-[0.12em]">
                <b>Restricted</b>
                <br />
                {FILM.ratingReason}
              </span>
            </div>
          </div>
        </section>

        {/* Email */}
        <section className="py-14">
          <div className="mx-auto max-w-2xl px-5">
            <h2 className="display text-7xl">Stay Close</h2>
            <p className="mt-1 text-haze">Screenings, releases and drops from Wicked Entertainment.</p>
            <EmailSignup />
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
