import { Link } from "react-router";
import { Bell } from "lucide-react";

import type { User } from "@/types/user";

import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import ProfileCard from "@/components/profile-card/profile";
import SlimCard from "@/components/slim-card/slim-card";

export default function UserControls({ user }: { user: User }) {
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
                <h2>
                  <Bell />
                </h2>
              }
            ></PopoverTrigger>
            <PopoverContent className="p-5 ring-1" align="end" sideOffset={36}>
              <PopoverHeader>
                <PopoverTitle>
                  <p>You have x notifications</p>
                </PopoverTitle>
                <PopoverDescription>
                  <div className="flex justify-end">
                    <Button
                      variant={"ghost"}
                      className="p-0 hover:text-destructive"
                    >
                      dismiss all
                    </Button>
                  </div>
                  <div className="flex flex-col gap-2">
                    {user.notifications.map((n) => (
                      <SlimCard className="border-l-3">
                        <p>{n}</p>
                      </SlimCard>
                    ))}
                  </div>
                </PopoverDescription>
              </PopoverHeader>
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger
              render={
                <div>
                  <img
                    className="rounded-full w-9"
                    src="https://placehold.co/50x50/lightblue/black/?text=profile"
                    alt=""
                  />
                </div>
              }
            >
              Open Popover
            </PopoverTrigger>
            <PopoverContent className="p-5 ring-1" align="end" sideOffset={36}>
              <PopoverHeader>
                <PopoverTitle>
                  <ProfileCard user={user} variant={"normal"} />
                </PopoverTitle>
                <PopoverDescription>
                  <div className="flex flex-col gap-2">
                    <Button className="font-bold">Profile</Button>
                    <Button className="font-bold bg-destructive hover:bg-destructive/80">
                      Log out
                    </Button>
                  </div>
                </PopoverDescription>
              </PopoverHeader>
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
