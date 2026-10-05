import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";

import PostsColumn from "@/components/posts-column/posts-column";
import ProfileColumn from "@/components/profile-column/profile-column";

import { useFeedSort } from "@/contexts/feed-sort-context";
import { postsQueryOpts } from "@/lib/queryOptions";

export default function Profile() {
  const { userId } = useParams();
  const [sort, setSort] = useFeedSort();

  const postsQuery = useQuery(postsQueryOpts(userId, 1, sort, undefined, [userId!]));

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
