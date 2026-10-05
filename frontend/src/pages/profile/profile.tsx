import { useParams } from "react-router";

import PostsColumn from "@/components/posts-column/posts-column";
import ProfileColumn from "@/components/profile-column/profile-column";

import { useFeedSort } from "@/contexts/feed-sort-context";
import { postsQueryOpts } from "@/lib/queryOptions";

export default function Profile() {
  const { userId } = useParams();
  const [sort, setSort] = useFeedSort(); 

  return (
    <>
      <div>
        <PostsColumn
          queryOptions={postsQueryOpts(userId, 1, sort, undefined, [], [userId!])}
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
