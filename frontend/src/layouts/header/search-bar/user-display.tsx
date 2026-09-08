import ProfileCard from "@/components/profile-card/profile-card";
import SlimCard from "@/components/slim-card/slim-card";
import type { ApiSearchUser } from "@/types/user";
import type React from "react";
import { Link } from "react-router";

interface Props {
  users: ApiSearchUser[] | undefined;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function UserDisplay({ users, setOpen }: Props) {
  return (
    <div className="flex flex-col gap-2">
      {users?.map((u, i) => (
        <Link to={`/profile/${u.id}`} key={i} onClick={() => setOpen(false)}>
          <SlimCard className="hover:ring-1 ring-primary">
            <ProfileCard user={u} variant={"compact"} />
          </SlimCard>
        </Link>
      ))}
    </div>
  );
}
