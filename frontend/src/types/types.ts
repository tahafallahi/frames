export interface User {
  id: number;
  username: string;
  likes: number;
  notifications: string[];
  profilePath: string;
}

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
  items: { name: string; selected: boolean }[];
}

export interface Comment {
  text: string;
  user: User;
  replies: Comment[];
  likes: number;
}
