import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { api } from "@/lib/api";

import QueryWrapper from "@/components/query-wrapper/query-wrapper";
import PostCard from "@/components/post-card/post-card";
import ShowCard from "@/components/show-card/show-card";
import CommentSection from "@/components/comment-section/comment-section";

import { MediaType, type Show } from "@/types/show";
import Skeleton from "@/components/skeleton/skeleton";
import {commentsQueryOpts, postQueryOpts } from "@/lib/queryOptions";
import { useUser } from "@/contexts/user-context";

export default function ViewPost() {
  const [user] = useUser();
  const { postId } = useParams();

  const query = useQuery(postQueryOpts(user?.id, postId));
  const post = query.data;

  const showQuery = useQuery({
    queryKey: ["show", post?.show.tmdbId],
    queryFn: async () => {
      return (
        await api.get<Show>(
          `/shows/${post?.show.mediaType === MediaType.MOVIE ? "movie" : "tv"}/${post?.show.tmdbId}`,
        )
      ).data;
    },
    enabled: query.isSuccess,
  });

  const commentsQuery = useQuery(commentsQueryOpts(user?.id, postId));

  return (
    <>
      <div className="flex flex-col gap-10">
        <QueryWrapper
          query={query}
          isEmpty={!!(query.data && !Object.keys(query.data).length)}
          loadingPlaceHolder={<Skeleton className="h-100" />}
        >
          {post && <PostCard variant={"full"} post={post}></PostCard>}
        </QueryWrapper>
        <QueryWrapper
          query={commentsQuery}
          isEmpty={
            !!(
              commentsQuery.data &&
              !Object.keys(commentsQuery.data).length
            )
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
              comments={commentsQuery.data}
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
          {showQuery.isSuccess && <ShowCard show={showQuery.data} title />}
        </QueryWrapper>
      </div>
    </>
  );
}
