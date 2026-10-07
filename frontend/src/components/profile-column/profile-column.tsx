import { api } from "@/lib/api";
import type { User } from "@/types/user";
import { useQuery } from "@tanstack/react-query";
import ProfileCard from "../profile-card/profile-card";
import QueryWrapper from "../query-wrapper/query-wrapper";
import FavoriteShows from "../favorite-shows/favorite-shows";
import Skeleton from "../skeleton/skeleton";
import ProfileColumnButtons from "./profile-column-buttons";
import { useUser } from "@/contexts/user-context";

export default function ProfileColumn({ userId }: { userId: string }) {
  const [user] = useUser()

  const pageUserQuery = useQuery({
    queryKey: ["user", userId],
    queryFn: async () => (await api.get<User>("/user/" + userId)).data,
  });

  return (
    <>
      <div className="flex flex-col gap-4">
        <h3 className="text-2xl">Profile</h3>
        <div className="px-5 py-3 flex flex-col gap-5 md:border-l">
          <QueryWrapper
            query={pageUserQuery}
            isEmpty={!!(pageUserQuery.data && !Object.keys(pageUserQuery.data))}
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
            {pageUserQuery.data && (
              <ProfileCard user={pageUserQuery.data} variant="detailed" />
            )}

            {user && pageUserQuery.data && (
              <ProfileColumnButtons pageUser={pageUserQuery.data} user={user} />
            )}

            {!!pageUserQuery.data?.favorites?.length && (
              <FavoriteShows shows={pageUserQuery.data.favorites} />
            )}
          </QueryWrapper>
        </div>
      </div>
    </>
  );
}
