import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useParams } from "react-router";

import PostsColumn from "@/components/posts-column/posts-column";
import ProfileColumn from "@/components/profile-column/profile-column";
import QueryWrapper from "@/components/query-wrapper/query-wrapper";

import type { Post } from "@/types/post";

export default function Profile() {
  const { userId } = useParams();
  const [sort, setSort] = useState<"TOP" | "HOT" | "NEW">("TOP");
  const qSort = { TOP: "likes", HOT: "comments", NEW: "time" }[sort];

  const postsQuery = useQuery({
    queryKey: ["posts", qSort],
    queryFn: async () =>
      (
        await api.get<Post[]>(
          `/posts?sort=${qSort}&page=1&userFilter=${userId}`,
        )
      ).data,
  });

  const posts = postsQuery.data;

  return (
    <>
      <div>
        <QueryWrapper
          query={postsQuery}
          emptyStateMessage={"There are no posts."}
        >
          {posts?.length !== 0? (
            <PostsColumn
              posts={posts}
              title={posts?.length + " Posts"}
              sort={sort}
              setSort={setSort}
            />
          ): <p>empty</p>}
        </QueryWrapper>
      </div>
      <div >
        <ProfileColumn userId={userId!} />
      </div>
    </>
  );
}
