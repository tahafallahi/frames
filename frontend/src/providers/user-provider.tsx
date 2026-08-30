import { UserContext } from "@/contexts/user-context";
import { api } from "@/lib/api";
import type { User } from "@/types/global";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export default function UserProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);

  useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const response = await api.get<User>("/user");
      console.log(response.data);
      if (response.data) setUser(response.data);
    },
    refetchOnMount: true,
    retry: false,
  });

  return <UserContext value={[user, setUser]}>{children}</UserContext>;
}
