import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { api } from "@/lib/api";

import QueryWrapper from "@/components/query-wrapper/query-wrapper";
import PostCard from "@/components/post-card/post-card";
import ShowCard from "@/components/show-card/show-card";
import CommentSection from "@/components/comment-section/comment-section";

import type { Post } from "@/types/post";
import { MediaType, type Show } from "@/types/show";
import type { Comment } from "@/types/comment";
import Skeleton from "@/components/skeleton/skeleton";

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
      return (
        await api.get<Show>(
          `/shows/${post?.show.mediaType === MediaType.MOVIE ? "movie" : "tv"}/${post?.show.tmdbId}`,
        )
      ).data;
    },
    enabled: postQuery.isSuccess,
  });

  const commentsQuery = useQuery({
    queryKey: ["comments", post?.id],
    queryFn: async () => {
      return await api.get<Comment[]>("/posts/" + post?.id + "/comments");
    },
    enabled: postQuery.isSuccess,
  });

  return (
    <>
      <div className="flex flex-col gap-10">
        <QueryWrapper
          query={postQuery}
          isEmpty={!!(postQuery.data && !Object.keys(postQuery.data).length)}
          loadingPlaceHolder={<Skeleton className="h-100" />}
        >
          {post && <PostCard variant={"full"} post={post}></PostCard>}
        </QueryWrapper>
        <QueryWrapper
          query={commentsQuery}
          isEmpty={
            !!(commentsQuery.data && !Object.keys(commentsQuery.data).length)
          }
          loadingPlaceHolder={
            <div className="flex flex-col gap-4">
              {Array(10)
                .fill(null)
                .map((s, i) => (
                  <Skeleton key={i} />
                ))}
            </div>
          }
        >
          {post && commentsQuery.isSuccess && (
            <CommentSection
              comments={commentsQuery.data.data}
              commentsCount={post.commentsCount}
              post={post}
            />
          )}
        </QueryWrapper>
      </div>
      <div>
        <QueryWrapper
          query={showQuery}
          isEmpty={!!(showQuery.data && !Object.keys(showQuery.data).length)}
          loadingPlaceHolder={
            <div className="flex flex-col gap-2">
              <Skeleton className="h-6 w-50" />
              <Skeleton className="h-100" />
              <Skeleton variant="line" />
              <Skeleton variant="line" />
              <Skeleton variant="line" />
              <Skeleton variant="line" />
            </div>
          }
        >
          {showQuery.isSuccess && (
            
              <ShowCard show={showQuery.data} title/>
          )}
        </QueryWrapper>
      </div>
    </>
  );
}
