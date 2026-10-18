// Everything on the site about the film itself. Content comes from the
// original trustnonemovie.com — keep it factual; don't invent plot or quotes.

// Media is still served from the original WordPress site. Before the
// trustnonemovie.com domain is pointed at this app, copy these files into
// /public and change MEDIA_BASE to "" (paths below stay the same).
const MEDIA_BASE = "https://www.trustnonemovie.com";
const media = (path: string) => `${MEDIA_BASE}${path}`;

export const LOGO_URL = media("/wp-content/uploads/2015/05/TRUSTNONE-logo-e1432057631607.png");

export const STILLS = [1, 5, 16, 17, 18, 20, 22, 23, 32].map((n) =>
  media(`/wp-content/uploads/2015/05/cropped-trustnonepic${n}.png`)
);

export const HERO_STILL = STILLS[0];

export const FILM = {
  title: "Trust None",
  tagline: "A Classic Chicago Movie",
  rating: "R",
  ratingReason: "Under 17 requires accompanying parent or adult guardian",
  studio: "Wicked Entertainment Network Inc.",
  // TODO: paste the synopsis from trustnonemovie.com/synopsis — it could not
  // be read automatically. Until then this short summary is shown.
  synopsis:
    "Chicago's debut street film. Music, mischief and mayhem, made in Chicago by Chicago artists, starring Eric \"Lil E\" Brown as LiL E.",
};

export type Person = { name: string; role: string; lead?: boolean };

export const CAST_AND_CREW: Person[] = [
  { name: 'Eric "Lil E" Brown', role: 'Starring as "LiL E"', lead: true },
  { name: "E.C Illa aka White Folks", role: "Writer · Director · Cast" },
  { name: "Konee Rok", role: "Co-Director · Cinematographer · Editor · Producer" },
  { name: "Buk of Psychodrama", role: "Cast" },
  { name: "Psyde of Psychodrama", role: "Cast" },
  { name: "The Legendary Traxster", role: "Cast & Crew" },
  { name: "Big Rap", role: "Cast & Crew" },
  { name: "Crucial Conflict", role: "Cast & Crew" },
  { name: "Cap 1", role: "Cast & Crew" },
];

// Billing block, verbatim from the original site.
export const CREDITS: { label?: string; names: string }[] = [
  { names: "Wicked Entertainment presents" },
  { names: "a World Won Entertainment / Konee Rok production" },
  { names: "a Whitefolks picture" },
  { names: '"Trust None"' },
  { label: "starring", names: 'Eric Brown as "LiL E"' },
  { names: "E.C Illa aka WhiteFolks · Yungbuk and Psyde of Psychodrama" },
  { label: "casting by", names: "Whitefolks" },
  { label: "director of photography", names: "Konee Rok" },
  { label: "music by", names: "Chicago's Finest" },
  { label: "edited by", names: "Konee Rok" },
  { label: "executive producer", names: "Sleepy Wicked for Wicked Entertainment" },
  { label: "executive producers", names: "M. Sam Morsy and Whitefolks for World Won" },
  { label: "produced by", names: "Konee Rok and Whitefolks" },
  { label: "story by", names: "Whitefolks" },
  { label: "screenplay by", names: "Whitefolks" },
  { label: "directed by", names: "Whitefolks" },
  { label: "co-directed by", names: "Konee Rok" },
];

// TODO: replace "#" with the real profile URLs.
export const SOCIAL_LINKS = [
  { label: "Instagram", href: "#" },
  { label: "YouTube", href: "#" },
  { label: "Facebook", href: "#" },
  { label: "Vimeo", href: "#" },
];

// Public trailer embed (Bunny.net play/embed URL or a direct video file).
export const TRAILER_URL = process.env.NEXT_PUBLIC_TRAILER_URL ?? "";
