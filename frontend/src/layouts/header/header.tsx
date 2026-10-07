import UserControls from "./user-controls";
import SearchBar from "./search-bar/search-bar";
import { Link } from "react-router";
import { useUser } from "@/contexts/user-context";

import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  variant?: "compact";
  setSideBarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Header({ variant, setSideBarOpen }: Props) {
  const [user, , userQuery] = useUser();

  return (
    <header className="sticky z-100 top-0 bg-background w-full h-18 flex justify-between items-center px-4 md:px-10 border-b border-border">
      <div className="flex gap-2 items-center">
        <Button variant="ghost" className="p-0 xl:hidden" onClick={() => setSideBarOpen(state => !state)}>
          <Menu className="size-8" />
        </Button>
        <h1 className="text-primary text-[36px] font-bold">
          <Link to="/">Frames</Link>
        </h1>
      </div>
      {variant === "compact" ? null : (
        <div className="max-w-200 hidden lg:block md:ml-25  xl:ml-45 mr-25  flex-1">
          <SearchBar />
        </div>
      )}

      <UserControls query={userQuery} user={user} />
    </header>
  );
}
