import ProfileCard from "@/components/profile-card/profile-card";
import SlimCard from "@/components/slim-card/slim-card";
import type { ApiSearchUser } from "@/types/user";
import type React from "react";

interface Props {
  users: ApiSearchUser[] | undefined;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export default function UserDisplay({ users }: Props) {
  return (
    <div className="flex flex-col gap-2">
      {users?.map((u, i) => (
        <SlimCard key={i}>
          <ProfileCard user={u} variant={"compact"} />
        </SlimCard>
      ))}
    </div>
  );
}
