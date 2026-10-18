import Link from "next/link";
import { FILM, LOGO_URL, SOCIAL_LINKS } from "@/lib/film";

// TODO: Privacy Policy and Contact still live on the old WordPress site.
// Move them here before the domain is switched to this app.
const LEGAL = [
  { href: "https://www.trustnonemovie.com/privacy-policy/", label: "Privacy Policy" },
  { href: "https://www.trustnonemovie.com/contact-us/", label: "Contact Us" },
];

export default function SiteFooter() {
  return (
    <footer className="border-t border-line py-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Link href="/" aria-label="Trust None home">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={LOGO_URL} alt="Trust None" className="h-11 w-auto" />
          </Link>
          <nav aria-label="Footer" className="mt-4 flex flex-wrap gap-x-5">
            <Link href="/shop" className="flex min-h-11 items-center text-sm">Shop</Link>
            {LEGAL.map((l) => (
              <a key={l.label} href={l.href} className="flex min-h-11 items-center text-sm">{l.label}</a>
            ))}
          </nav>
          <p className="mt-3 text-xs text-haze">© {new Date().getFullYear()} {FILM.studio} All rights reserved.</p>
        </div>
        <ul className="flex flex-wrap gap-x-5" aria-label="Social media">
          {SOCIAL_LINKS.filter((s) => s.href !== "#").map((s) => (
            <li key={s.label}>
              <a href={s.href} className="flex min-h-11 items-center text-sm text-chalk" rel="noopener" target="_blank">{s.label}</a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
