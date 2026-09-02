import { UserContext } from "@/contexts/user-context";
import { api } from "@/lib/api";
import type { User } from "@/types/user";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export default function UserProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);

  const query = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const response = await api.get<User>("/user");
      if (response.data) setUser(response.data);
    },
    retry: false,
  });

  return <UserContext value={[user, setUser, query]}>{children}</UserContext>;
}
