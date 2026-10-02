import Filter from "@/components/filter/filter";
import FollowingColumn from "@/components/following-column/following-column";
import PostsColumn from "@/components/posts-column/posts-column";
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
                userFilter: user.followings.map(r => r.followeeId),
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

  const tagQuery = useQuery({
    queryKey: ["tags"],
    queryFn: async () =>
      (await api.get<{ id: number; name: string }[]>(`/tags`)).data,
  });

  const filter = tagQuery.data
    ? [
        {
          title: "Content",
          items: ["movie", "tv show"],
        },
        {
          title: "Tags",
          items: tagQuery.data.map((t) => {
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
      <div className="flex flex-col gap-8">
        {user && <FollowingColumn followings={user?.followings} />}
        <Filter
          query={tagQuery}
          filters={filter}
          selectedFilters={selectedFilters}
          setSelectedFilters={setSelectedFilters}
        />
      </div>
    </>
  );
}
