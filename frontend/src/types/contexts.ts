import type { UseQueryResult } from "@tanstack/react-query";
import type { User } from "./user";

export type UserContext = [User | null, React.Dispatch<React.SetStateAction<User | null>>, UseQueryResult] | null