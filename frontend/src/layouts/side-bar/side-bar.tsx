import QueryWrapper from "@/components/query-wrapper/query-wrapper";
import Skeleton from "@/components/skeleton/skeleton";
import { useUser } from "@/contexts/user-context";
import { api } from "@/lib/api";
import type { TrendingTitles } from "@/types/show";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";

export default function SideBar({ selectedFeed }: { selectedFeed: string }) {
  const [user] = useUser();

  const trendingQuery = useQuery({
    queryKey: ["trending-titles"],
    queryFn: async () =>
      (await api.get<TrendingTitles>("/trending/titles")).data,
  });

  const tabs = [
    ["All", ""],
    ["Following", "/followings"],
    ["My Posts", `/profile/${user?.id}`],
  ];

  return (
    <div className="sticky top-18 h-[calc(100dvh-72px)] w-full  p-10 border-r text-2xl flex flex-col gap-10">
      <div className="flex flex-col gap-1">
        {tabs.map(([t, l], i) => (
          <Link to={l} key={i}>
            {t === selectedFeed ? (
              <h3 className="text-primary font-bold">{t}</h3>
            ) : (
              <h3 className="hover:text-primary">{t}</h3>
            )}
          </Link>
        ))}
      </div>
      <div className="flex flex-col gap-2">
        <Link to={"/trending/movie"}>
          <h3 className="hover:text-primary">Movies</h3>
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
                <p
                  className="text-muted-foreground whitespace-nowrap overflow-clip text-ellipsis "
                >
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
          <h3 className="hover:text-primary">TV Shows</h3>
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
              <p
                className="text-muted-foreground whitespace-nowrap overflow-clip text-ellipsis "
              >
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
