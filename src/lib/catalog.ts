// Single source of truth for everything the site sells. Checkout prices are
// read from here on the server — never from the browser.

export const RENTAL_HOURS = 48;

export type FilmOffer = {
  id: "rent" | "buy";
  name: string;
  priceCents: number;
  description: string;
};

export const FILM_OFFERS: Record<FilmOffer["id"], FilmOffer> = {
  rent: {
    id: "rent",
    name: "Rent Trust None",
    priceCents: 499,
    description: `Stream the full movie for ${RENTAL_HOURS} hours.`,
  },
  buy: {
    id: "buy",
    name: "Buy Trust None",
    priceCents: 1499,
    description: "Stream the full movie anytime, forever.",
  },
};

export type Product = {
  id: string;
  name: string;
  /** Who the product belongs to, e.g. the artist for an album. */
  by?: string;
  kind: "dvd" | "music" | "poster" | "apparel" | "other";
  /** null = listed as "Coming soon" and can't be bought yet. */
  priceCents: number | null;
  image?: string;
  /** Physical goods collect a shipping address at checkout. */
  physical: boolean;
  description?: string;
};

// TODO: fill in from the current shop at trustnonemovie.com/shop — names,
// prices and images could not be read automatically. Items with a null price
// show as "Coming soon" and are not purchasable.
export const PRODUCTS: Product[] = [
  {
    id: "dvd",
    name: "Trust None — DVD",
    kind: "dvd",
    priceCents: null,
    physical: true,
    description: "The full movie on DVD.",
  },
  {
    id: "ec-illa-album",
    name: "Album",
    by: "E.C Illa aka White Folks",
    kind: "music",
    priceCents: null,
    physical: false,
  },
  {
    id: "traxster-album",
    name: "Album",
    by: "The Legendary Traxster",
    kind: "music",
    priceCents: null,
    physical: false,
  },
  {
    id: "poster",
    name: "Trust None — Poster",
    kind: "poster",
    priceCents: null,
    physical: true,
  },
];

export const formatPrice = (cents: number) =>
  `$${(cents / 100).toFixed(2).replace(/\.00$/, "")}`;

export function findProduct(id: string) {
  return PRODUCTS.find((p) => p.id === id);
}
