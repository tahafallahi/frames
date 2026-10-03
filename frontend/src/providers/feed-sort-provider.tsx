import { FeedSortContext } from "@/contexts/feed-sort-context";
import { FeedSortEnum } from "@/types/contexts";
import type React from "react";
import { useState } from "react";

interface Props {
  children: React.ReactNode;
}

export default function FeedSortProvider({ children }: Props) {
  const [feedSort, setFeedSort] = useState<FeedSortEnum>(FeedSortEnum.TOP);
  return <FeedSortContext value={[feedSort, setFeedSort]}>{children}</FeedSortContext>;
}
