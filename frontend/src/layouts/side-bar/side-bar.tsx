import { useUser } from "@/contexts/user-context";
import { Link } from "react-router";

export default function SideBar({ selectedFeed }: { selectedFeed: string }) {
  const [user] = useUser();

  const tabs = [
    ["All", ""],
    ["Following", "/followings"],
    ["My Posts", `/profile/${user?.id}`],
  ];

  return (
    <div className="sticky top-18 h-[calc(100dvh-72px)] w-75 p-10 border-r text-2xl flex flex-col gap-10">
      <div className="flex flex-col gap-1">
        {tabs.map(([t, l], i) => (
          <Link to={l} key={i}>
            {t === selectedFeed ? (
              <h3  className="text-primary font-bold">
                {t}
              </h3>
            ) : (
              <h3 className="hover:text-primary">
                {t}
              </h3>
            )}
          </Link>
        ))}
      </div>
      <div className="flex flex-col gap-2">
        <Link to={"/trending/movie"}>
          <h3 className="hover:text-primary">Movies</h3>
        </Link>
        <div className="pl-4 flex flex-col gap-1 text-xl">
          {/* {mockShows.map((s, i) => (
            <p
              className="text-muted-foreground whitespace-nowrap overflow-clip text-ellipsis "
              key={i}
            >
              {s.name}
            </p>
          ))} */}
          <Link to="/" className="text-secondary underline">
            See more
          </Link>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Link to={"/trending/tv"}>
          <h3 className="hover:text-primary">TV Shows</h3>
        </Link>
        <div className="pl-4 flex flex-col gap-1 text-xl">
          {/* {mockShows.map((s, i) => (
            <p
              className="text-muted-foreground whitespace-nowrap overflow-clip text-ellipsis"
              key={i}
            >
              {s.name}
            </p>
          ))} */}
          <Link to="/" className="text-secondary underline">
            See more
          </Link>
        </div>
      </div>
    </div>
  );
}
