export interface Filter {
  title: string;
  items: string[];
}

export type SelectedFilters = Record<string, string[]>;
