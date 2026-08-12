import type { Filter } from "@/types/types";

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

export {mockFilters}