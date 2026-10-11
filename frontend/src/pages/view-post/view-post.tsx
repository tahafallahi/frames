import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";

import QueryWrapper from "@/components/query-wrapper/query-wrapper";
import PostCard from "@/components/post-card/post-card";
import ShowCard from "@/components/show-card/show-card";
import CommentSection from "@/components/comment-section/comment-section";

import Skeleton from "@/components/skeleton/skeleton";
import { commentsQueryOpts, postQueryOpts, showQueryOpts } from "@/lib/queryOptions";
import { useUser } from "@/contexts/user-context";

export default function ViewPost() {
  const [user] = useUser();
  const { postId } = useParams();

  const query = useQuery(postQueryOpts(user?.id, postId));
  const post = query.data;

  const showQuery = useQuery(showQueryOpts(post?.show.tmdbId, post?.show.mediaType));

  const commentsQuery = useQuery(commentsQueryOpts(user?.id, post?.id));

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

        <CommentSection
          query={commentsQuery}
          commentsCount={post?.commentsCount}
          post={post}
        />
      </div>
      <div>
        <QueryWrapper
          query={showQuery}
          isEmpty={!!(showQuery.data && !Object.keys(showQuery.data).length)}
          loadingPlaceHolder={
            <div className="mb-6">
              <div className="flex-col gap-2 hidden md:flex">
                <Skeleton className="h-6 w-50" />
                <Skeleton className="h-100" />
                <Skeleton variant="line" />
                <Skeleton variant="line" />
                <Skeleton variant="line" />
                <Skeleton variant="line" />
              </div>
              <div className="md:hidden">
                <Skeleton className="h-12" />
              </div>
            </div>
          }
        >
          {showQuery.isSuccess && <ShowCard show={showQuery.data} title />}
        </QueryWrapper>
      </div>
    </>
  );
}
