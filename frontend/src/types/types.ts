
export interface Show {
  id: number;
  title: string;
  posterPath: string;
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
