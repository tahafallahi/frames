import UserControls from "./user-controls";
import SearchBar from "./search-bar/search-bar";
import { Link } from "react-router";
import { useUser } from "@/contexts/user-context";
import QueryWrapper from "@/components/query-wrapper/query-wrapper";
import Skeleton from "@/components/skeleton/skeleton";

export default function Header({ variant }: { variant?: "compact" }) {
  const [user, , userQuery] = useUser();

  return (
    <header className="sticky z-1 top-0 bg-background w-full h-18 flex justify-between items-center  px-10 border-b border-border">
      <h1 className="text-primary text-[36px] font-bold">
        <Link to="/">Frames</Link>
      </h1>
      {variant === "compact" ? null : (
        <div className="max-w-175 flex-1">
          <SearchBar />
        </div>
      )}

      <QueryWrapper
        query={userQuery}
        isEmpty={!user}
        loadingPlaceHolder={
          <div className="flex gap-6 shrink-0 justify-between items-center">
            <Skeleton className="h-5 w-11"/>
            <Skeleton className="h-10 w-10 rounded-full"/>
            <Skeleton className="h-10 w-10 rounded-full"/>
          </div>
        }
      >
        {userQuery.isSuccess && <UserControls user={user} />}
      </QueryWrapper>
    </header>
  );
}
