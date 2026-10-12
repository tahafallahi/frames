import UserControls from "./user-controls";
import SearchBar from "./search-bar/search-bar";
import { Link } from "react-router";

import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import StrokeText from "@/components/ui/stroke-text";

interface Props {
  variant?: "compact";
  setSideBarOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Header({ variant, setSideBarOpen }: Props) {

  return (
    <header className="sticky z-100 top-0 bg-background w-full h-18 flex justify-between items-center px-4 md:px-10 border-b border-border text-sm md:text-base">
      <div className="flex gap-2 items-center">
        {
          setSideBarOpen &&
        <Button variant="ghost" className="p-0 xl:hidden hover:text-primary " onClick={() => setSideBarOpen(state => !state)}>
          <Menu className="size-6 md:size-8"/>
        </Button>
        }
        <h1 className="text-primary">
          <Link to="/" className="hidden md:block">
            <StrokeText
              text="Frames"
              strokeColor="var(--primary)"
              fillColor="var(--primary)"
              strokeWidth={1}
              drawDuration={4}
              fillDelay={-3}
              stagger={0.05}
              ease="power2.out"
              trigger="mount"
              fillMode="wipe"
              fontSize={36}
              fontWeight={700}
              letterSpacing={1}
              reverse={false}
            />
          </Link>
          <Link to="/" className="block md:hidden">
            <StrokeText
              text="Frames"
              strokeColor="var(--primary)"
              fillColor="var(--primary)"
              strokeWidth={1}
              drawDuration={4}
              fillDelay={-3}
              stagger={0.05}
              ease="power2.out"
              trigger="mount"
              fillMode="wipe"
              fontSize={24}
              fontWeight={600}
              letterSpacing={1}
              reverse={false}
            />
          </Link>
        </h1>
      </div>
      {variant === "compact" ? null : (
          <SearchBar />
        
      )}

      <UserControls />
    </header>
  );
}
