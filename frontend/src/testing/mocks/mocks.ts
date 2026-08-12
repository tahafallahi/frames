import type { Filter, Post, Show, User } from "@/types/user";
import mockPosts from "./mock-posts";

const mockUser: User = {
  id: 100,
  username: "James",
  likes: 412,
  notifications: [
    "James started following you.",
    "User 343 started following you",
    "AhmedKKK started following you",
  ],
  img: "https://placehold.co/50x50/lightblue/black/?text=James",
};

const mockUser1: User = {
  id: 1,
  username: "Ahmed-The-bold-Man2312123213213233",
  likes: 412341,
  notifications: [
    "James started following you.",
    "User 343 started following you",
    "AhmedKKK started following you",
  ],
  img: "https://placehold.co/50x50/lightred/black/?text=Ahmed",
};

const mockUser2: User = {
  id: 2,
  username: "Bryan-S.tracy",
  likes: 4,
  notifications: [
    "James started following you.",
    "User 343 started following you",
    "AhmedKKK started following you",
  ],
  img: "https://placehold.co/50x50/yellow/black/?text=Bryan",
};

const mockUser3: User = {
  id: 3,
  username:
    "James_the_second_lord_of_the_lowrds_that_used_to_be_very_good_at_this_shit_and_fucked_it_up.",
  likes: 4,
  notifications: [
    "James started following you.",
    "User 343 started following you",
    "AhmedKKK started following you",
  ],
  img: "https://placehold.co/50x50/white/black/?text=lord",
};

const mockShow: Show = {
  name: "Odyssey",
  type: "movie",
  genres: ["Action", "Fantasy"],
  year: 2026,
  score: 8.5,
  realtedPosts: 220,
  followers: 2000,
  img: "https://placehold.co/640x480/white/black/?text=odyssey",
};

const mockShow1: Show = {
  name: "Avengers The Last Last Moview",
  type: "movie",
  genres: ["Action", "Fantasy"],
  year: 2020,
  score: 5,
  realtedPosts: 1034,
  followers: 20000,
  img: "https://placehold.co/640x480/purple/black/?text=avengers",
};

const mockShow2: Show = {
  name: "Madison",
  type: "movie",
  genres: ["Action", "Fantasy"],
  year: 2025,
  score: 9.2,
  realtedPosts: 22,
  followers: 20,
  img: "https://placehold.co/640x480/yellow/black/?text=madison",
};

const mockFilters: Filter[] = [
  {
    title: "Content",
    items: [
      { name: "Movie", selected: false },
      { name: "TV Show", selected: false },
      { name: "Documantry", selected: false },
    ],
  },
  {
    title: "Post Type",
    items: [
      { name: "News", selected: true },
      { name: "Discussion", selected: false },
      { name: "Spoiler", selected: false },
      { name: "Review", selected: false },
    ],
  },
];

const mockSearchResult = {
  users: [mockUser1, mockUser2, mockUser3],
  shows: [mockShow, mockShow1, mockShow2, mockShow1, mockShow, mockShow2],
  posts: mockPosts.slice(0, 4),
};

export {
  mockUser,
  mockUser1,
  mockUser2,
  mockSearchResult,
  mockShow,
  mockShow1,
  mockShow2,
  mockFilters,
};
