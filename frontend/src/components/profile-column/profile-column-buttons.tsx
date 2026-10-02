import { Button } from "../ui/button";

import type { User } from "@/types/user";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Spinner } from "../ui/spinner";

interface Props {
  pageUser: User;
  user: User;
}

export default function ProfileColumnButtons({ pageUser, user }: Props) {
  const isFollowed = user.followings?.some(
    (fRelation) => fRelation.followeeId === pageUser.id,
  );

  const followMut = useMutation({
    mutationFn: async () => await api.post(`/user/${pageUser.id}/follow`),
    onSuccess: (data, variables, onMutateResult, context) => context.client.invalidateQueries({queryKey: ["user"]})
  });
  const unfollowMut = useMutation({
    mutationFn: async () => await api.delete(`/user/${pageUser.id}/follow`),
    onSuccess: (data, variables, onMutateResult, context) => context.client.invalidateQueries({queryKey: ["user"]})
  });
  
  return (
    <>
      {user?.id === pageUser.id ? (
        <div className="flex flex-col gap-2 px-5 py-2 border-l">
          <p>Change profile picture</p>
          <p>Change username</p>
          <p>Change bio</p>
        </div>
      ) : isFollowed ? (
        <Button className="h-13 font-bold" onClick={() => unfollowMut.mutate()}>
          Unfollow
          {unfollowMut.isPending && <Spinner data-icon="inline-end" />}
        </Button>
      ) : (
        <Button className="h-13 font-bold" onClick={() => followMut.mutate()}>
          Follow
          {followMut.isPending && <Spinner data-icon="inline-end" />}
        </Button>
      )}
    </>
  );
}
