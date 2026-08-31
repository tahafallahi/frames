import { Link } from "react-router";
import { Bell } from "lucide-react";


import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import ProfileCard from "@/components/profile-card/profile-card";

import type { User } from "@/types/comment";

export default function UserControls({ user }: { user: User | null}) {
  return (
    <>
      {user ? (
        <div className="w-44 flex shrink-0 justify-between items-center">
          <h2>
            <Link to="/create">Create</Link>
          </h2>

          <Popover>
            <PopoverTrigger
              render={
                <Button variant={"ghost"} size={"icon-lg"} aria-label="Notifications">
                  <Bell className="size-6"/>   
                </Button>
              }
            ></PopoverTrigger>
            <PopoverContent className="p-5 ring-1" align="end" sideOffset={36}>
              <PopoverHeader>
                <PopoverTitle>
                  You have x notifications
                </PopoverTitle>
              </PopoverHeader>
                  <div className="flex justify-end">
                    <Button
                      variant={"ghost"}
                      className="p-0 hover:text-destructive"
                    >
                      dismiss all
                    </Button>
                  </div>
                  <div className="flex flex-col gap-2">
                    {/* {user.notifications.map((n, i) => (
                      <SlimCard key={i} className="border-l-3">
                        <p>{n}</p>
                      </SlimCard>
                    ))} */}
                  </div>
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger
              render={
                <Button variant={"ghost"} className="p-0" aria-label="Profile">
                  <img
                    className="rounded-full w-8"
                    src={user.profilePath ?? "https://placehold.co/50x50/lightblue/black/?text=profile"}
                    alt=""
                  />
                </ Button>
              }
            >
              Open Popover
            </PopoverTrigger>
            <PopoverContent className="p-5 ring-1" align="end" sideOffset={36}>
              <PopoverHeader>
                  <ProfileCard user={user} variant={"full"} />
              </PopoverHeader>
                  <div className="flex flex-col gap-2">
                    <Button className="font-bold">Profile</Button>
                    <Button className="font-bold bg-destructive hover:bg-destructive/80">
                      Log out
                    </Button>
                  </div>
            </PopoverContent>
          </Popover>
        </div>
      ) : (
        <div className="w-39 mx-5 flex shrink-0 justify-between items-center">
          <h2><Link to="login">Log In</Link></h2>
          <h2><Link to="login">Sign Up</Link></h2>
        </div>
      )}
    </>
  );
}
