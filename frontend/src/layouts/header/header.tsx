import UserControls from "./user-controls";
import SearchBar from "./search-bar/search-bar";
import { Link } from "react-router";
import type { User } from "@/types/global";

export default function Header({
  user,
  variant,
}: {
  user?: User;
  variant?: "compact";
}) {
  return (
    <header className="sticky z-1 top-0 bg-background w-full h-18 flex justify-between items-center  px-10 border-b border-border">
      <h1 className="text-primary text-[36px] font-bold ">
        <Link to="/">Frames</Link>
      </h1>
      {variant === "compact" ? null : (
        <>
          <SearchBar />
        </>
      )}
      <UserControls user={user} />
    </header>
  );
}
