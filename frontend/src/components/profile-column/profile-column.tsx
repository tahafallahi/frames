import { api } from "@/lib/api";
import type { User } from "@/types/user";
import { useQuery } from "@tanstack/react-query";
import ProfileCard from "../profile-card/profile-card";
import QueryWrapper from "../query-wrapper/query-wrapper";
import { useUser } from "@/contexts/user-context";
import FavoriteShows from "../favorite-shows/favorite-shows";
import { Button } from "../ui/button";

export default function ProfileColumn({ userId }: { userId: string }) {
  const [user] = useUser();

  const userQuery = useQuery({
    queryKey: ["user", userId],
    queryFn: async () => (await api.get<User>("/user/" + userId)).data,
  });

  return (
    <>
      <div className="flex flex-col gap-4">
        <h3 className="text-2xl">Profile</h3>
        <div className=" w-75 px-5 py-3 flex flex-col gap-5 border-l">
          <QueryWrapper query={userQuery}>
            {userQuery.data && (
              <ProfileCard user={userQuery.data} variant="detailed" />
            )}
          </QueryWrapper>

          {user && userQuery.data && user.id === userQuery.data.id ? (
            <div className="flex flex-col gap-2 px-5 py-2 border-l">
              <p>Change profile picture</p>
              <p>Change username</p>
              <p>Change bio</p>
            </div>
          ) : (
            <Button>Follow</Button>
          )}

          {userQuery.data?.favorites && (
            <FavoriteShows shows={userQuery.data.favorites} />
          )}
        </div>
      </div>
    </>
  );
}
