
export interface Show {
  name: string;
  type: "movie" | "tvShow";
  genres: string[];
  year: number;
  score: number;
  realtedPosts: number;
  followers: number;
  img: string;
}


export interface Filter {
  title: string;
  items: string[];
}

export type SelectedFilters = Record<string, string[]>


export interface Comment {
  text: string;
  user: User;
  replies: Comment[];
  likes: number;
}
