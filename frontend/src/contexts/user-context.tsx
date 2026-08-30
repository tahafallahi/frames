import type { User } from "@/types/global";
import { createContext, useContext } from "react";

export const UserContext = createContext<
  [User | null, React.Dispatch<React.SetStateAction<User | null>>] | null
>(null);

export function useUser() {
  const context = useContext(UserContext);
  if (!context)
    throw new Error("userUser must be within a UserContextProvider");
  return context;
}
