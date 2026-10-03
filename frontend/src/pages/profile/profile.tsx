import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";

import PostsColumn from "@/components/posts-column/posts-column";
import ProfileColumn from "@/components/profile-column/profile-column";

import type { Post } from "@/types/post";
import { useFeedSort } from "@/contexts/feed-sort-context";
import { FeedSortDict } from "@/types/contexts";

export default function Profile() {
  const { userId } = useParams();
  const [sort, setSort] = useFeedSort();

  const postsQuery = useQuery({
    queryKey: ["user-posts", userId, sort],
    queryFn: async () =>
      (
        await api.get<Post[]>(
          `/posts`,
          {
            params:{
              sort: FeedSortDict[sort].value,
              page: 1,
              userFilter: [userId]
            }
          },
        )
      ).data,
  });

  const posts = postsQuery.data;

  return (
    <>
      <div>
        <PostsColumn
          query={postsQuery}
          title={(posts?.length ?? "") + " Posts"}
          sort={sort}
          setSort={setSort}
        />
      </div>
      <div>
        <ProfileColumn userId={userId!} />
      </div>
    </>
  );
}
