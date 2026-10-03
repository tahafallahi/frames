import { Link } from "react-router";
import { Bell, Moon, Sun } from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

import type { User } from "@/types/user";
import type { UseQueryResult } from "@tanstack/react-query";
import QueryWrapper from "@/components/query-wrapper/query-wrapper";
import Skeleton from "@/components/skeleton/skeleton";
import { useState } from "react";
import NotificationsTray from "./trays/notifications-tray";
import ProfileTray from "./trays/profile-tray";

export default function UserControls({
  user,
  query,
}: {
  user: User | null;
  query: UseQueryResult;
}) {
  const [isDarkMode, setIsDarkMode] = useState(
    document.documentElement.classList.contains("dark"),
  );
  return (
    <QueryWrapper
      query={query}
      emptyStateMessage={
        <div className=" mx-5 flex gap-8 shrink-0 justify-between items-center">
          <h2>
            <Link to="/login">Log In</Link>
          </h2>
          <h2>
            <Link to="/signup">Sign Up</Link>
          </h2>
        </div>
      }
      isEmpty={!user}
      loadingPlaceHolder={
        <div className="flex gap-6 shrink-0 justify-between items-center">
          <Skeleton className="h-5 w-11" />
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>
      }
    >
      {user && (
        <div className="flex gap-6 shrink-0 justify-between items-center">
          <h2>
            <Link to="/create">Create</Link>
          </h2>

          <Button
            onClick={() => {
              if (document.documentElement.classList.contains("dark")) {
                document.documentElement.classList.remove("dark");
                localStorage.setItem("color-mode", "light");
                setIsDarkMode(false);
              } else {
                document.documentElement.classList.add("dark");
                localStorage.setItem("color-mode", "dark");
                setIsDarkMode(true);
              }
            }}
            variant="ghost"
            size="icon-xs"
            aria-label="Toggle color mode"
          >
            {isDarkMode ? (
              <Sun className="size-full" />
            ) : (
              <Moon className="size-full" />
            )}
          </Button>

          <Popover>
            <PopoverTrigger
              render={
                <Button
                  variant={"ghost"}
                  size={"icon-xs"}
                  aria-label="Notifications button"
                >
                  <Bell className="size-full" />
                </Button>
              }
            ></PopoverTrigger>
            <PopoverContent className="p-5 ring-1" align="end" sideOffset={36}>
              <NotificationsTray />
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger
              render={
                <Button
                  variant={"ghost"}
                  className="p-0"
                  aria-label="Profile button"
                >
                  <img
                    className="rounded-full w-8"
                    src={
                      user.profilePath ??
                      "https://placehold.co/50x50/lightblue/black/?text=profile"
                    }
                  />
                </Button>
              }
            >
              Open Popover
            </PopoverTrigger>
            <PopoverContent className="p-5 ring-1" align="end" sideOffset={36}>
              <ProfileTray user={user} />
            </PopoverContent>
          </Popover>
        </div>
      )}
    </QueryWrapper>
  );
}
