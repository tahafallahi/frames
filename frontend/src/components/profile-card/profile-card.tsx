import type { SimpleUser, User } from "@/types/user";
import { thousandToK } from "@/utils/general";
import { Link } from "react-router";

export default function ProfileCard({
  user,
  variant,
}:
  | {
      user: User;
      variant: "full" | "detailed";
    }
  | {
      user: SimpleUser | User;
      variant: "compact";
    }) {
  if (variant === "detailed") {
    return (
      <div className="flex flex-col gap-2">
        <div className="flex gap-3 items-center">
          <div className="shrink-0">
            <img
              className="rounded-full w-13"
              src={user.profilePath ?? import.meta.env.VITE_PROFILE_PLACEHOLDER}
              alt="User's profile picture"
            />
          </div>
          <div className="flex flex-col">
            <p className="text-2xl wrap-anywhere">{user.username}</p>
            <p className="text-xs text-muted-foreground">
              Likes recieved: {thousandToK(user.likesCount)}
            </p>
          </div>
        </div>
        <div className="flex gap-4 text-sm text-muted-foreground">
          <p>Followers: {user.follwersCount}</p>
          <p>Following: {user.followingsCount}</p>
        </div>
        <p className="text-muted-foreground">{user.bio}</p>
      </div>
    );
  } else if (variant === "full") {
    return (
      <div className="flex gap-3 items-center">
        <div className="shrink-0">
          <img
            className="rounded-full w-13"
            src={user.profilePath ?? import.meta.env.VITE_PROFILE_PLACEHOLDER}
            alt="User's profile picture"
          />
        </div>
        <div className="flex flex-col">
          <p className="text-2xl wrap-anywhere">{user.username}</p>
          <p className="text-xs text-muted-foreground">
            Likes recieved: {thousandToK(user.likesCount)}
          </p>
        </div>
      </div>
    );
  } else if (variant === "compact") {
    return (
      <Link to={`/profile/${user.id}`} className="hover:ring-2 ring-primary ring-offset-4 ring-offset-background">
        <div className="flex gap-3 items-center">
          <div className="shrink-0">
            <img
              className="rounded-full w-8 "
              src={user.profilePath ?? import.meta.env.VITE_PROFILE_PLACEHOLDER}
              alt="User's profile picture"
            />
          </div>
          <div className="flex flex-col">
            <p className="text-sm wrap-anywhere">{user.username}</p>
          </div>
        </div>
      </Link>
    );
  }
}
