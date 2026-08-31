import type { UserContext as UserContextType } from "@/types/contexts";
import { createContext, useContext } from "react";

export const UserContext = createContext<UserContextType>(null);

export function useUser() {
  const context = useContext(UserContext);
  if (!context)
    throw new Error("userUser must be within a UserContextProvider");
  return context;
}
