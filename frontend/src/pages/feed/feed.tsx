import PostsColumn from "@/components/posts-column/posts-column";
import QueryWrapper from "@/components/query-wrapper/query-wrapper";
import { api } from "@/lib/api";
import type { Post } from "@/types/feed";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export default function Feed() {
  const [sort, setSort] = useState<"TOP"|"HOT"|"NEW">("TOP")
  const qSort = sort === "TOP" ? "likes": sort === "HOT"? "comments" : "time"
  console.log(qSort)

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["posts", qSort],
    queryFn: async () =>
      (await api.get<Post[]>(`/posts?sort=${qSort}&page=1`)).data,
  });
  return (
    <QueryWrapper queryData={{data, isLoading, isError, error}} emptyStateMessage={"There are no posts."}>
      <PostsColumn posts={data} title="All" sort={sort} setSort={setSort}/>;
    </QueryWrapper>
  );
}
