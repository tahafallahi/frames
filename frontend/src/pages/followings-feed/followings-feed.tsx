import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import Filter from "@/components/filter/filter";
import FollowingColumn from "@/components/following-column/following-column";
import PostsColumn from "@/components/posts-column/posts-column";
import { api } from "@/lib/api";
import { useUser } from "@/contexts/user-context";
import LoginProtection from "../login-protection/login-protection";

import { FeedSortDict } from "@/types/contexts";
import { useFeedSort } from "@/contexts/feed-sort-context";
import type { SelectedFilters } from "@/types/filter";
import type { Post } from "@/types/post";

export default function FollowingsFeed() {
  const [user] = useUser();
  const [selectedFilters, setSelectedFilters] = useState<SelectedFilters>({
    Content: [],
    Tags: [],
  });
  const [sort, setSort] = useFeedSort();

  const postQuery = useQuery({
    queryKey: ["followings", sort],
    queryFn: async () => {
      if (user) {
        if (user.followings) {
          return (
            await api.get<Post[]>("/posts", {
              params: {
                userFilter: user.followings.map((r) => r.followeeId),
                page: 1,
                sort: FeedSortDict[sort].value,
              },
            })
          ).data;
        }
      }
      return [];
    },
    staleTime: 0,
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

  if (!user) return <LoginProtection />

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
