import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({ variable: "--font-geist", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Trust None | A Chicago Street Drama",
  description:
    "In the city streets of Chicago, even your own family can't be trusted. Stream Season 1 now.",
  keywords: ["Trust None", "Chicago", "street drama", "micro drama", "streaming"],
  openGraph: {
    title: "Trust None | Season 1 Streaming Now",
    description: "In the city streets of Chicago, even your own family can't be trusted.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable} h-full antialiased`}>
      <head>
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='6' fill='%230a0a0a'/><text x='16' y='23' text-anchor='middle' font-size='18' font-weight='bold' fill='%23d4a520'>T</text></svg>"
        />
      </head>
      <body className="min-h-full bg-chicago text-white">{children}</body>
    </html>
  );
}
