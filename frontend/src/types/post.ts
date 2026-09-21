import type { MediaType, ShowIdentifier } from "./show";

export interface Post {
  id: string;
  title: string;
  content: string;
  picturePath: string;
  tags: { name: string }[];
  createdAt: string;
  author: {
    id: string;
    username: string;
    profilePath: string;
  };
  show: {
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

export interface PostForm {
  title: string;
  content: string;
  showIdentifier: ShowIdentifier;
}
