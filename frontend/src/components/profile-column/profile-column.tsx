import { api } from "@/lib/api";
import type { User } from "@/types/user";
import { useQuery } from "@tanstack/react-query";
import ProfileCard from "../profile-card/profile-card";
import QueryWrapper from "../query-wrapper/query-wrapper";
import { useUser } from "@/contexts/user-context";
import FavoriteShows from "../favorite-shows/favorite-shows";
import { Button } from "../ui/button";
import Skeleton from "../skeleton/skeleton";

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
          <QueryWrapper
            query={userQuery}
            isEmpty={!!(userQuery.data && !Object.keys(userQuery.data))}
            loadingPlaceHolder={
              <div>
                <div className="flex gap-4">
                  <Skeleton className="rounded-full w-13 h-13" />
                  <div className="flex flex-col gap-2 justify-center">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-3 w-30" />
                  </div>
                </div>
                <Skeleton className="h-3  mt-2 ml-2" />
                <div className="mt-6">
                  <Skeleton className="h-3  mt-2 ml-2" />
                  <Skeleton className="h-3  mt-2 ml-2" />
                  <Skeleton className="h-3  mt-2 ml-2" />
                </div>
                <Skeleton className="h-10  mt-7 ml-2" />
              </div>
            }
          >
            {userQuery.data && (
              <ProfileCard user={userQuery.data} variant="detailed" />
            )}

            {user && userQuery.data && user.id === userQuery.data.id ? (
              <div className="flex flex-col gap-2 px-5 py-2 border-l">
                <p>Change profile picture</p>
                <p>Change username</p>
                <p>Change bio</p>
              </div>
            ) : (
              <Button>Follow</Button>
            )}

            {!!userQuery.data?.favorites?.length && (
              <FavoriteShows shows={userQuery.data.favorites} />
            )}
          </QueryWrapper>
        </div>
      </div>
    </>
  );
}
