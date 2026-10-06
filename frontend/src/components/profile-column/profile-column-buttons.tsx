import type { User } from "@/types/user";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Spinner } from "../ui/spinner";
import BarButton from "../bar-button/bar-button";
import { Field, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface Props {
  pageUser: User;
  user: User;
}

export default function ProfileColumnButtons({ pageUser, user }: Props) {
  const [profileEditIsOpen, setProfileEditIsOpen] = useState(false);
  const isFollowed = user.followings?.some(
    (fRelation) => fRelation.followeeId === pageUser.id,
  );

  const followMut = useMutation({
    mutationFn: async () => await api.post(`/user/${pageUser.id}/follow`),
    onSuccess: (_data, _variables, _onMutateResult, context) =>
      context.client.invalidateQueries({ queryKey: ["user"] }),
  });
  const unfollowMut = useMutation({
    mutationFn: async () => await api.delete(`/user/${pageUser.id}/follow`),
    onSuccess: (_data, _variables, _onMutateResult, context) =>
      context.client.invalidateQueries({ queryKey: ["user"] }),
  });

  const editProfileMut = useMutation({
    mutationFn: async (data: { bio: string }) =>
      (await api.post<User>("/user", data)).data,
    onSuccess: (_data, _variables, _onMutateResult, context) =>
      context.client.invalidateQueries({queryKey: ["user"]})
  });

  function editProfile(data: { bio: string }) {
    editProfileMut.mutate(data);
  }

  const { register, handleSubmit } = useForm<{ bio: string }>();

  return (
    <>
      {user?.id === pageUser.id ? (
        <>
          <form
            hidden={!profileEditIsOpen}
            onSubmit={handleSubmit(editProfile)}
            className="flex flex-col gap-4"
          >
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="bio">Bio</FieldLabel>
                <Input id="bio" {...register("bio")} />
              </Field>
            </FieldGroup>
            <BarButton type="submit" className="w-full">
              Save
            </BarButton>
          </form>
          <BarButton
            onClick={() => setProfileEditIsOpen(!profileEditIsOpen)}
            className="-mt-3"
            variant={profileEditIsOpen ? "destructive" : "default"}
          >
            {profileEditIsOpen ? "Close" : "Edit Profile"}
          </BarButton>
        </>
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
