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
    title: string;
    releaseYear: number;
    mediaType: "MOVIE" | "TV_SHOW";
  };
  likesCount: number;
  commentsCount: number;
}
