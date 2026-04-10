export interface Episode {
  id: number;
  number: number;
  title: string;
  description: string;
  runtime: string;
  runtimeSeconds: number;
  isFree: boolean;
  coinCost: number;
  thumbnailGradient: string;
  thumbnailIcon: string;
  season: number;
}

export const SHOW_INFO = {
  title: "Trust None",
  logline: "In the city streets of Chicago, even your own family can't be trusted.",
  genre: ["Street Life", "Drama", "Comedy", "Adventure"],
  season: 1,
  totalEpisodes: 10,
  freeEpisodes: 3,
  creator: "Trust None Productions",
  year: 2026,
  rating: "TV-MA",
  socialHandle: "@TrustNoneShow",
  website: "trustnonemovie.com",
};

export const episodes: Episode[] = [
  {
    id: 1,
    number: 1,
    title: "Blood on the Block",
    description:
      "Darius returns to Englewood after three years away, only to find his younger brother Marcus running the same corners their father died on. A tense family dinner reveals cracks nobody wants to talk about.",
    runtime: "2:47",
    runtimeSeconds: 167,
    isFree: true,
    coinCost: 0,
    thumbnailGradient: "from-amber-900 via-red-950 to-black",
    thumbnailIcon: "🏙️",
    season: 1,
  },
  {
    id: 2,
    number: 2,
    title: "The Package",
    description:
      "Marcus asks Darius for a 'small favor' that turns out to be anything but. Meanwhile, their mother Lorraine is hiding something in the basement that could change everything.",
    runtime: "2:31",
    runtimeSeconds: 151,
    isFree: true,
    coinCost: 0,
    thumbnailGradient: "from-slate-900 via-amber-950 to-black",
    thumbnailIcon: "📦",
    season: 1,
  },
  {
    id: 3,
    number: 3,
    title: "Corner Politics",
    description:
      "Darius meets Kesha, a community organizer who sees right through his tough act. But when a rival crew sends a message to Marcus, family loyalty pulls him back to the streets.",
    runtime: "2:58",
    runtimeSeconds: 178,
    isFree: true,
    coinCost: 0,
    thumbnailGradient: "from-red-900 via-orange-950 to-black",
    thumbnailIcon: "🤝",
    season: 1,
  },
  {
    id: 4,
    number: 4,
    title: "Family Business",
    description:
      "Lorraine's secret is out — she's been laundering money through her hair salon for years. Darius is furious. Marcus already knew. The family fractures along lines nobody expected.",
    runtime: "2:44",
    runtimeSeconds: 164,
    isFree: false,
    coinCost: 3,
    thumbnailGradient: "from-purple-950 via-red-950 to-black",
    thumbnailIcon: "💇",
    season: 1,
  },
  {
    id: 5,
    number: 5,
    title: "Double Cross",
    description:
      "Marcus cuts a deal behind Darius's back with Trevon, the same man who set up their father. When Darius finds out, a confrontation at a South Side gas station goes sideways.",
    runtime: "1:56",
    runtimeSeconds: 116,
    isFree: false,
    coinCost: 3,
    thumbnailGradient: "from-zinc-900 via-red-900 to-black",
    thumbnailIcon: "🗡️",
    season: 1,
  },
  {
    id: 6,
    number: 6,
    title: "No Witnesses",
    description:
      "A security camera catches something it shouldn't have. Darius races to get the footage before Trevon's crew does. Kesha gives him an ultimatum: the streets or her.",
    runtime: "2:38",
    runtimeSeconds: 158,
    isFree: false,
    coinCost: 3,
    thumbnailGradient: "from-gray-950 via-amber-900 to-black",
    thumbnailIcon: "📹",
    season: 1,
  },
  {
    id: 7,
    number: 7,
    title: "The Wire",
    description:
      "Darius discovers Marcus has been wearing a wire — but for who? The feds? Trevon? Or someone even closer to home? Trust dissolves faster than snow on a Chicago sidewalk.",
    runtime: "2:22",
    runtimeSeconds: 142,
    isFree: false,
    coinCost: 3,
    thumbnailGradient: "from-blue-950 via-slate-900 to-black",
    thumbnailIcon: "🎙️",
    season: 1,
  },
  {
    id: 8,
    number: 8,
    title: "Loyalty Tax",
    description:
      "Lorraine plays both sons against each other to protect her own operation. A flashback reveals what really happened to their father — and it wasn't what anyone was told.",
    runtime: "2:51",
    runtimeSeconds: 171,
    isFree: false,
    coinCost: 3,
    thumbnailGradient: "from-red-950 via-yellow-900 to-black",
    thumbnailIcon: "⚖️",
    season: 1,
  },
  {
    id: 9,
    number: 9,
    title: "Point of No Return",
    description:
      "All three family members converge at the salon with different agendas. Darius has evidence. Marcus has a gun. Lorraine has a plan. Only one of them is walking out clean.",
    runtime: "2:15",
    runtimeSeconds: 135,
    isFree: false,
    coinCost: 3,
    thumbnailGradient: "from-black via-red-900 to-amber-950",
    thumbnailIcon: "🔥",
    season: 1,
  },
  {
    id: 10,
    number: 10,
    title: "Trust None",
    description:
      "Season finale. The truth about their father's death changes everything. Darius makes a choice that will haunt him. Marcus disappears. And Lorraine gets a phone call that sets up Season 2.",
    runtime: "2:59",
    runtimeSeconds: 179,
    isFree: false,
    coinCost: 3,
    thumbnailGradient: "from-amber-800 via-red-950 to-black",
    thumbnailIcon: "👁️",
    season: 1,
  },
];
