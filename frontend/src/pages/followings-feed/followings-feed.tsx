import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import Filter from "@/components/filter/filter";
import FollowingColumn from "@/components/following-column/following-column";
import PostsColumn from "@/components/posts-column/posts-column";
import { api } from "@/lib/api";
import { useUser } from "@/contexts/user-context";
import LoginProtection from "../login-protection/login-protection";

import { useFeedSort } from "@/contexts/feed-sort-context";
import type { SelectedFilters } from "@/types/filter";
import { postsQueryOpts } from "@/lib/queryOptions";

export default function FollowingsFeed() {
  const [user] = useUser();
  const [selectedFilters, setSelectedFilters] = useState<SelectedFilters>({
    Content: [],
    Tags: [],
  });
  const [sort, setSort] = useFeedSort();
  const userFilter = user?.followings.map((r) => r.followeeId) ?? [];
  

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
          queryOptions={{...postsQueryOpts(user?.id, sort, selectedFilters, [],userFilter), enabled: !!userFilter.length}}
          sort={sort}
          setSort={setSort}
        />
      </div>
      <div className="flex flex-col gap-4">
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
