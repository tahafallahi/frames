import type { User } from "@/types/user";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Spinner } from "../ui/spinner";
import BarButton from "../bar-button/bar-button";

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
    onSuccess: (_data, _variables, _onMutateResult, context) => context.client.invalidateQueries({queryKey: ["user"]})
  });
  const unfollowMut = useMutation({
    mutationFn: async () => await api.delete(`/user/${pageUser.id}/follow`),
    onSuccess: (_data, _variables, _onMutateResult, context) => context.client.invalidateQueries({queryKey: ["user"]})
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
        <BarButton onClick={() => unfollowMut.mutate()}>
          Unfollow
          {unfollowMut.isPending && <Spinner data-icon="inline-end" />}
        </BarButton>
      ) : (
        <BarButton onClick={() => followMut.mutate()}>
          Follow
          {followMut.isPending && <Spinner data-icon="inline-end" />}
        </BarButton>
      )}
    </>
  );
}
