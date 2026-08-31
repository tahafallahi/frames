import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { api } from "@/lib/api";
import QueryWrapper from "@/components/query-wrapper/query-wrapper";
import PostCard from "@/components/post-card/post-card";
import type { Post } from "@/types/post";
import ShowCard from "@/components/show-card/show-card";
import type { Show } from "@/types/show";

export default function ViewPost() {
  const { postId } = useParams();

  const postQuery = useQuery({
    queryKey: ["post", postId],
    queryFn: async () => {
      return await api.get<Post>("/posts/" + postId);
    },
  });

  const showQuery = useQuery({
    queryKey: ["show", postQuery.data?.data.show.id],
    queryFn: async () => {
      console.log(postQuery.data?.data.show.id)
      return await api.get<Show>("/shows/" + postQuery.data?.data.show.id);
    },
    enabled: () => postQuery.isSuccess,
  });

  return (
    <>
      <QueryWrapper query={postQuery}>
        {postQuery.isSuccess && (
          <PostCard variant={"full"} post={postQuery.data.data}></PostCard>
        )}
      </QueryWrapper>
      <QueryWrapper query={showQuery}>
        {showQuery.isSuccess && <ShowCard show={showQuery.data.data} variant="detailed" />}
      </QueryWrapper>
    </>
  );
}
