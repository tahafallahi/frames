import type { FeedSortContextType } from "@/types/contexts";
import { createContext, useContext } from "react";


export const FeedSortContext = createContext<FeedSortContextType | null>(null)

export function useFeedSort() {
  const context = useContext(FeedSortContext);
  if (!context)
    throw new Error("useFeedSort must be within a FeedSortProvider");
  return context;
}
