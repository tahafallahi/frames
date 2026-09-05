import type { MediaType } from "./show";

export interface Post {
  id: string;
  title: string;
  content: string;
  picturePath: string;
  tags: { name: string }[];
  createdAt: string;
  author: {
    username: string;
    profilePath: string;
  };
  show: {
    id: string;
    tmdbId: number;
    title: string;
    releaseYear: number;
    mediaType: MediaType;
  };
  likesCount: number;
  commentsCount: number;
}

export interface ApiSearchPost {
  id: string;
  title: string;
  showMediaType: MediaType;
  showTitle: string;
  likes: number;
}
