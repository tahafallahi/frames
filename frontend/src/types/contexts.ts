import type { UseQueryResult } from "@tanstack/react-query";
import type { User } from "./global";

export type UserContext = [User | null, React.Dispatch<React.SetStateAction<User | null>>, UseQueryResult] | null