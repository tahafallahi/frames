import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { api } from "@/lib/api";

import QueryWrapper from "@/components/query-wrapper/query-wrapper";
import PostCard from "@/components/post-card/post-card";
import ShowCard from "@/components/show-card/show-card";
import CommentSection from "@/components/comment-section/comment-section";

import type { Post } from "@/types/post";
import type { Show } from "@/types/show";
import type { Comment } from "@/types/comment";

export default function ViewPost() {
  const { postId } = useParams();

  const postQuery = useQuery({
    queryKey: ["post", postId],
    queryFn: async () => {
      return await api.get<Post>("/posts/" + postId);
    },
  });

  const post = postQuery.data?.data;

  const showQuery = useQuery({
    queryKey: ["show", post?.show.id],
    queryFn: async () => {
      return await api.get<Show>("/shows/" + post?.show.id);
    },
    enabled: () => postQuery.isSuccess,
  });

  const commentsQuery = useQuery({
    queryKey: ["comments", post?.id],
    queryFn: async () => {
      return await api.get<Comment[]>("/posts/" + post?.id + "/comments");
    },
    enabled: () => postQuery.isSuccess,
  });

  return (
    <>
      <div className="flex flex-col gap-10 pt-5">
        <QueryWrapper query={postQuery}>
          {post && <PostCard variant={"full"} post={post}></PostCard>}
        </QueryWrapper>
        <QueryWrapper query={commentsQuery}>
          {commentsQuery.isSuccess && (
            <CommentSection comments={commentsQuery.data.data} />
          )}
        </QueryWrapper>
      </div>
      <div className="pt-5">

      <QueryWrapper query={showQuery}>
        {showQuery.isSuccess && (
          <ShowCard show={showQuery.data.data} variant="detailed" />
        )}
      </QueryWrapper>
      </div>
    </>
  );
}
