import type { Show } from "@/types/user";

const mockShows: Show[] = [
  {
    name: "Odyssey",
    type: "movie",
    genres: ["Action", "Fantasy"],
    year: 2026,
    score: 8.5,
    realtedPosts: 220,
    followers: 2000,
    img: "https://placehold.co/640x480/white/black/?text=odyssey",
  },

  {
    name: "Avengers The Last Last Moview",
    type: "movie",
    genres: ["Action", "Fantasy"],
    year: 2020,
    score: 5,
    realtedPosts: 1034,
    followers: 20000,
    img: "https://placehold.co/640x480/purple/black/?text=avengers",
  },

  {
    name: "Madison",
    type: "movie",
    genres: ["Action", "Fantasy"],
    year: 2025,
    score: 9.2,
    realtedPosts: 22,
    followers: 20,
    img: "https://placehold.co/640x480/yellow/black/?text=madison",
  },
];

export default mockShows;
