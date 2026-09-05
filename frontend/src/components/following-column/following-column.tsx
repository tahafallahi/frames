import type { User } from "@/types/user";
import ProfileCard from "../profile-card/profile-card";

export default function FollowingColumn({
  followings,
}: {
  followings: User[];
}) {
  return (
    <div className="w-75 flex flex-col gap-3">
      {followings ? (
        <>
          <h4 className="text-2xl">{followings.length} Following</h4>
          <div className="flex flex-col gap-6 border-l py-3 px-5">
            {followings.map((u, i) => (
              <ProfileCard user={u} variant="compact" key={i} />
            ))}
          </div>
        </>
      ) : (
        <>
          <h4 className="text-2xl">0 Following</h4> <p>empty</p>
        </>
      )}
    </div>
  );
}
