import UserControls from "./user-controls";
import type { User } from "@/types/user";
import SearchBar from "./search-bar/search-bar";
import { Link } from "react-router";

export default function Header({ user }: { user: User }) {
  return (
    <header className="w-full h-18 flex justify-between items-center px-10 border-b border-border">
      <h1 className="text-primary text-[36px] font-bold "><Link to="/">Frames</Link></h1>
      <SearchBar />
      <UserControls user={user} />
    </header>
  );
}
