import Filter from "@/components/filter/filter";
import FollowingColumn from "@/components/following-column/following-column";
import PostsColumn from "@/components/posts-column/posts-column";
import QueryWrapper from "@/components/query-wrapper/query-wrapper";
import { useUser } from "@/contexts/user-context";
import { api } from "@/lib/api";
import type { SelectedFilters } from "@/types/filter";
import type { Post } from "@/types/post";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "react-router";

export default function FollowingsFeed() {
  const [user, setUser] = useUser();
  const [selectedFilters, setSelectedFilters] = useState<SelectedFilters>({
    Content: [],
    Tags: [],
  });
  const [sort, setSort] = useState<"TOP" | "HOT" | "NEW">("TOP");
  const qSort = { TOP: "likes", HOT: "comments", NEW: "time" }[sort];

  const postQuery = useQuery({
    queryKey: ["followings"],
    queryFn: async () => {
      if (user) {
        if (user.followings) {
          return (
            await api.get<Post[]>("/posts", {
              params: {
                userFilter: user.followings ? user.followings : [],
                page: 1,
                sort: qSort,
              },
            })
          ).data;
        }
      }
      return [];
    },
  });

  const tagsResponse = useQuery({
    queryKey: ["tags"],
    queryFn: async () =>
      (await api.get<{ id: number; name: string }[]>(`/tags`)).data,
  });

  
  const filter = tagsResponse.data
    ? [
        {
          title: "Content",
          items: ["movie", "tv show"],
        },
        {
          title: "Tags",
          items: tagsResponse.data.map((t) => {
            return t.name;
          }),
        },
      ]
    : [];

  if (user && Object.keys(user).length < 1)
    return (
      <div>
        You are not logged in.{" "}
        <Link to="login">Please log in first, to see this page.</Link>
      </div>
    );

  return (
    <>
      <div>
        <PostsColumn
          query={postQuery}
          sort={sort}
          setSort={setSort}
          title="Your Followings' posts"
        />
      </div>
      <div>{user && <FollowingColumn followings={user?.followings} />}
      <Filter filters={filter} selectedFilters={selectedFilters} setSelectedFilters={setSelectedFilters} />
      </div>
    </>
  );
}
