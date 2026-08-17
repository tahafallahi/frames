import type { ApiSearchUser } from "@/types/search";
import type { User } from "@/types/types";

export default function ProfileCard({
  user,
  variant,
}:
  | {
      user: User;
      variant: "full" | "detailed";
    }
  | {
      user: ApiSearchUser;
      variant: "compact";
    }) {
  if (variant === "detailed") {
    return (
      <div className="flex flex-col gap-2">
        <div className="flex gap-3 items-center">
          <div className="shrink-0">
            <img
              className="rounded-full w-13"
              src={user.profilePath}
              alt="User's profile picture"
            />
          </div>
          <div className="flex flex-col">
            <p className="text-2xl wrap-anywhere">{user.username}</p>
            <p className="text-xs text-muted-foreground">
              Likes recieved:{" "}
              {user.likes < 1000 ? user.likes : user.likes / 1000 + "k"}
            </p>
          </div>
        </div>
        <div className="flex gap-4 text-sm text-muted-foreground">
          <p>Following: 420</p>
          <p>Following: 420</p>
        </div>
        <p className="text-muted-foreground">
          I spend most of my time watching movies, the rest of my time is spent
          talking about movies! My favorites genres are Italian and French
          movies.
        </p>
      </div>
    );
  } else if (variant === "full") {
    return (
      <div className="flex gap-3 items-center">
        <div className="shrink-0">
          <img
            className="rounded-full w-13"
            src={user.profilePath}
            alt="User's profile picture"
          />
        </div>
        <div className="flex flex-col">
          <p className="text-2xl wrap-anywhere">{user.username}</p>
          <p className="text-xs text-muted-foreground">
            Likes recieved:{" "}
            {user.likes < 1000 ? user.likes : user.likes / 1000 + "k"}
          </p>
        </div>
      </div>
    );
  } else if (variant === "compact") {
    return (
      <div className="flex gap-3 items-center">
        <div className="shrink-0">
          <img
            className="rounded-full w-8 "
            src={
              user.profilePath
                ? user.profilePath
                : import.meta.env.VITE_PROFILE_PLACEHOLDER
            }
            alt="User's profile picture"
          />
        </div>
        <div className="flex flex-col">
          <p className="text-sm wrap-anywhere">{user.username}</p>
        </div>
      </div>
    );
  }
}
