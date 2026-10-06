import QueryWrapper from "@/components/query-wrapper/query-wrapper";
import Skeleton from "@/components/skeleton/skeleton";
import { useUser } from "@/contexts/user-context";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import type { TrendingTitles } from "@/types/show";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";

interface Props {
  selectedPage: string;
}

export default function SideBar({ selectedPage }: Props) {
  const [user] = useUser();

  const trendingQuery = useQuery({
    queryKey: ["trending-titles"],
    queryFn: async () =>
      (await api.get<TrendingTitles>("/trending/titles")).data,
  });

  const tabs = [
    { key: "feed", label: "All", path: "/", requireLogin: false },
    {
      key: "followings-feed",
      label: "Follwings",
      path: "/followings",
      requireLogin: true,
    },
    {
      key: "profile",
      label: "My Posts",
      path: `/profile/${user?.id}`,
      requireLogin: true,
    },
  ];

  return (
    <div className="sticky top-18 h-[calc(100dvh-72px)] w-full p-10  border-r text-2xl flex-col gap-10 hidden xl:flex">
      <div className="flex flex-col gap-1">
        {tabs.map((tab, i) => {
          return tab.requireLogin && !user ? (
            <h3
              key={i}
              className="opacity-50 pointer-events-none"
              aria-disabled
            >
              {tab.label}
            </h3>
          ) : (
            <Link to={tab.path} key={i} className="hover:text-primary">
              {tab.key === selectedPage ? (
                <h3 className="text-primary font-bold">{tab.label}</h3>
              ) : (
                <h3>{tab.label}</h3>
              )}
            </Link>
          );
        })}
      </div>
      <div className="flex flex-col gap-2">
        <Link to={"/trending/movie"}>
          <h3
            className={cn(
              "hover:text-primary",
              selectedPage === "trending-movies" && "text-primary font-bold",
            )}
          >
            Movies
          </h3>
        </Link>
        <div className="pl-4 flex flex-col gap-1 text-xl">
          <QueryWrapper
            query={trendingQuery}
            isEmpty={!trendingQuery.data?.movies.length}
            loadingPlaceHolder={
              <div className="flex flex-col gap-3">
                {Array(7)
                  .fill(null)
                  .map((x, i) => (
                    <Skeleton variant="line" key={i} />
                  ))}
              </div>
            }
          >
            {trendingQuery.data?.movies.slice(0, 6).map((s, i) => (
              <Link to={`/show/movie/${s.tmdbId}`} key={i}>
                <p className="text-muted-foreground whitespace-nowrap overflow-clip text-ellipsis ">
                  {s.title}
                </p>
              </Link>
            ))}
            <Link to="/trending/movie" className="text-secondary underline">
              See more
            </Link>
          </QueryWrapper>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Link to={"/trending/tv"}>
          <h3
            className={cn(
              "hover:text-primary",
              selectedPage === "trending-tvs" && "text-primary font-bold",
            )}
          >
            TV Shows
          </h3>
        </Link>
        <div className="pl-4 flex flex-col gap-1 text-xl">
          <QueryWrapper
            query={trendingQuery}
            isEmpty={!trendingQuery.data?.movies.length}
            loadingPlaceHolder={
              <div className="flex flex-col gap-3">
                {Array(7)
                  .fill(null)
                  .map((x, i) => (
                    <Skeleton variant="line" key={i} />
                  ))}
              </div>
            }
          >
            {trendingQuery.data?.tvs.slice(0, 6).map((s, i) => (
              <Link to={`/show/tv/${s.tmdbId}`} key={i}>
                <p className="text-muted-foreground whitespace-nowrap overflow-clip text-ellipsis ">
                  {s.title}
                </p>
              </Link>
            ))}
            <Link to="/trending/tv" className="text-secondary underline">
              See more
            </Link>
          </QueryWrapper>
        </div>
      </div>
    </div>
  );
}
