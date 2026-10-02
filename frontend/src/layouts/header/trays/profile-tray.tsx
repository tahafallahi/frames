import BarButton from "@/components/bar-button/bar-button";
import BarLink from "@/components/bar-link/bar-link";
import ProfileCard from "@/components/profile-card/profile-card";
import { api } from "@/lib/api";
import type { User } from "@/types/user";
import { useMutation } from "@tanstack/react-query";

interface Props {
  user: User;
}

export default function ProfileTray({ user }: Props) {
  const logoutMut = useMutation({mutationFn: async() => await api.post("/auth/logout"), onSuccess: (_data, _variables, _onMutateResult, context) => context.client.invalidateQueries({queryKey: ["user"]}) })

  return (
    <>
      <ProfileCard user={user} variant={"full"} />
      <div className="flex flex-col gap-2">
      <BarLink
          to={"/profile/" + user.id}
        >
          Profile
        </BarLink>
        <BarButton variant="destructive" onClick={() => logoutMut.mutate()}>
          Log out
        </BarButton>
      </div>
    </>
  );
}
