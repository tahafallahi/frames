import type { UseQueryResult } from "@tanstack/react-query";
import type { User } from "./user";

export type UserContext = [User | null, React.Dispatch<React.SetStateAction<User | null>>, UseQueryResult] | null


export enum FeedSortEnum {
  TOP,
  HOT,
  NEW
}

export const FeedSortDict = {
  [FeedSortEnum.TOP]:  {key: "TOP", value: "likes", label: "Top"},
  [FeedSortEnum.HOT]:  {key: "HOT", value: "comments", label: "Hot"},
  [FeedSortEnum.NEW]:  {key: "NEW", value: "time", label: "New"},
} as const 

export type FeedSortContextType = [FeedSortEnum, React.Dispatch<React.SetStateAction<FeedSortEnum>>]