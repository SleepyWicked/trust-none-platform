import type { Metadata } from "next";
import { Open_Sans, Six_Caps } from "next/font/google";
import AuthProvider from "@/components/site/AuthProvider";
import { FILM, HERO_STILL } from "@/lib/film";
import "./globals.css";

const sixCaps = Six_Caps({ variable: "--font-six-caps", weight: "400", subsets: ["latin"] });
const openSans = Open_Sans({ variable: "--font-open-sans", subsets: ["latin"] });

const description = `${FILM.tagline}. Chicago's debut street film — rent or buy and stream it now.`;

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://trustnonemovie.com"),
  title: { default: `${FILM.title} | ${FILM.tagline}`, template: `%s | ${FILM.title}` },
  description,
  openGraph: {
    title: `${FILM.title} — ${FILM.tagline}`,
    description,
    type: "video.movie",
    images: [{ url: HERO_STILL }],
  },
  twitter: { card: "summary_large_image", images: [HERO_STILL] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${sixCaps.variable} ${openSans.variable} h-full`}>
      <body className="min-h-full">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
