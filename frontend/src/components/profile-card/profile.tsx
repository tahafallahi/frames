import type { User } from "@/types/user";

export default function Profile({
  user,
  variant,
}: {
  user: User;
  variant: "compact" | "normal";
}) {
  if (variant === "normal") {
    return (
      <div className="flex gap-3 items-center">
        <div className="shrink-0">
          <img
            className="rounded-full w-13"
            src={user.img}
            alt="User's profile picture"
          />
        </div>
        <div className="flex flex-col">
          <p className="text-2xl wrap-anywhere">{user.username}</p>
          <p className="text-xs text-muted-foreground">
            Likes recieved: {user.likes < 1000? user.likes: user.likes/1000 + "k"}
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
            src={user.img}
            alt="User's profile picture"
          />
        </div>
        <div className="flex flex-col">
          <p className="text-xs wrap-anywhere">{user.username}</p>
        </div>
      </div>
    );
  }
}
