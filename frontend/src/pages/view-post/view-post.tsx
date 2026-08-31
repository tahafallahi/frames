import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { api } from "@/lib/api";
import QueryWrapper from "@/components/query-wrapper/query-wrapper";
import PostCard from "@/components/post-card/post-card";
import type { Post } from "@/types/feed";

export default function ViewPost() {
  const { postId } = useParams();

  const query = useQuery({
    queryKey: ["post", postId],
    queryFn: async () => {
      return await api.get<Post>("/posts/" + postId);
    },
  });

  return (
    <QueryWrapper query={query}>
      {query.isSuccess && (
        <PostCard variant={"full"} post={query.data.data}></PostCard>
      )}
    </QueryWrapper>
  );
}
