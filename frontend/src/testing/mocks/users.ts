import type { User } from "@/types/types";

const mockUsers: User[] = [
  {
    id: 1,
    username: "James",
    likes: 412,
    notifications: [
      "James started following you.",
      "User 343 started following you",
      "AhmedKKK started following you",
    ],
    img: "https://placehold.co/50x50/lightblue/black/?text=James",
  },
  {
    id: 2,
    username: "Ahmed-The-bold-Man2312123213213233",
    likes: 412341,
    notifications: [
      "James started following you.",
      "User 343 started following you",
      "AhmedKKK started following you",
    ],
    img: "https://placehold.co/50x50/lightred/black/?text=Ahmed",
  },
  {
    id: 3,
    username: "Bryan-S.tracy",
    likes: 4,
    notifications: [
      "James started following you.",
      "User 343 started following you",
      "AhmedKKK started following you",
    ],
    img: "https://placehold.co/50x50/yellow/black/?text=Bryan",
  },
  {
    id: 4,
    username:
      "James_the_second_lord_of_the_lowrds_that_used_to_be_very_good_at_this_shit_and_fucked_it_up.",
    likes: 4,
    notifications: [
      "James started following you.",
      "User 343 started following you",
      "AhmedKKK started following you",
    ],
    img: "https://placehold.co/50x50/white/black/?text=lord",
  }
];




export { mockUsers }