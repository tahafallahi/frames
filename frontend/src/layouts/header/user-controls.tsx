import { Link } from "react-router";
import { Bell } from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTitle,
  PopoverHeader,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import ProfileCard from "@/components/profile-card/profile-card";

import type { User } from "@/types/user";
import type { UseQueryResult } from "@tanstack/react-query";
import QueryWrapper from "@/components/query-wrapper/query-wrapper";
import Skeleton from "@/components/skeleton/skeleton";

export default function UserControls({
  user,
  query,
}: {
  user: User | null;
  query: UseQueryResult;
}) {
  return (
    <QueryWrapper
      query={query}
      emptyStateMessage={
        <div className=" mx-5 flex gap-8 shrink-0 justify-between items-center">
          <h2>
            <Link to="login">Log In</Link>
          </h2>
          <h2>
            <Link to="login">Sign Up</Link>
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

          <Popover>
            <PopoverTrigger
              render={
                <Button
                  variant={"ghost"}
                  size={"icon-lg"}
                  aria-label="Notifications"
                >
                  <Bell className="size-6" />
                </Button>
              }
            ></PopoverTrigger>
            <PopoverContent className="p-5 ring-1" align="end" sideOffset={36}>
              <PopoverHeader>
                <PopoverTitle>You have x notifications</PopoverTitle>
              </PopoverHeader>
              <div className="flex justify-end">
                <Button
                  variant={"ghost"}
                  className="p-0 hover:text-destructive"
                >
                  dismiss all
                </Button>
              </div>
              {/* <div className="flex flex-col gap-2">
                    {user.notifications.map((n, i) => (
                      <SlimCard key={i} className="border-l-3">
                        <p>{n}</p>
                      </SlimCard>
                    ))}
                  </div> */}
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger
              render={
                <Button variant={"ghost"} className="p-0" aria-label="Profile">
                  <img
                    className="rounded-full w-8"
                    src={
                      user.profilePath ??
                      "https://placehold.co/50x50/lightblue/black/?text=profile"
                    }
                    alt=""
                  />
                </Button>
              }
            >
              Open Popover
            </PopoverTrigger>
            <PopoverContent className="p-5 ring-1" align="end" sideOffset={36}>
              <PopoverHeader>
                <ProfileCard user={user} variant={"full"} />
              </PopoverHeader>
              <div className="flex flex-col gap-2">
                <Link to={"/profile/" + user.id}>Profile</Link>
                <Button className="font-bold bg-destructive hover:bg-destructive/80">
                  Log out
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      )}
    </QueryWrapper>
  );
}
