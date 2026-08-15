import mockShows from "@/testing/mocks/shows";
import { Link } from "react-router";

export default function SideBar({ selectedFeed }: { selectedFeed: string }) {
  const tabs = ["All", "Following", "My Posts"];

  return (
    <div className="sticky top-18 h-[calc(100dvh-72px)] w-75 p-10 border-r text-2xl flex flex-col gap-10">
      <div className="flex flex-col gap-1">
        {tabs.map((t, i) =>
          t === selectedFeed ? (
            <h3 key={i} className="text-primary font-bold">
              {t}
            </h3>
          ) : (
            <h3 key={i} className="font-bold">
              {t}
            </h3>
          ),
        )}
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="font-bold">Movies</h3>
        <div className="pl-4 flex flex-col gap-1">
          {mockShows.map((s) => (
            <p className="text-muted-foreground whitespace-nowrap overflow-clip text-ellipsis">
              {s.name}
            </p>
          ))}
          <Link to="/" className="text-secondary underline">
            See more
          </Link>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="font-bold">TV Shows</h3>
        <div className="pl-4 flex flex-col gap-1">
          {mockShows.map((s) => (
            <p className="text-muted-foreground whitespace-nowrap overflow-clip text-ellipsis">
              {s.name}
            </p>
          ))}
          <Link to="/" className="text-secondary underline">
            See more
          </Link>
        </div>
      </div>
    </div>
  );
}
