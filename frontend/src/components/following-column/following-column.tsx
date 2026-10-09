import type { SimpleUser, FRelation } from "@/types/user";
import ProfileCard from "../profile-card/profile-card";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "@/contexts/user-context";
import { api } from "@/lib/api";

export default function FollowingColumn({
  followings,
}: {
  followings: FRelation[];
}) {
  const [user] = useUser();

  const followersQuery = useQuery({
    queryKey: ["followers", user!.id],
    queryFn: async () =>
      (await api.get<SimpleUser[]>(`/user/${user!.id}/followers`)).data,
  });

  console.log(followersQuery.data);

  return (
    <div className="flex flex-col gap-3">
      {followings ? (
        <>
          {followings.length ? (
            <>
              <h4 className="text-2xl">{followings.length} Following</h4>
              <div className="flex flex-col gap-6 border-l py-3 px-5">
                {followersQuery.data &&
                  followersQuery.data.map((u, i) => (
                    <ProfileCard user={u} variant="compact" key={i} />
                  ))}
              </div>
            </>
          ) : (
            <p>You aren't follwoing anyone.</p>
          )}
        </>
      ) : (
        <>
          <p>You aren't follwoing anyone.</p>
        </>
      )}
    </div>
  );
}
