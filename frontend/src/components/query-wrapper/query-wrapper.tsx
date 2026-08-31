import type { UseQueryResult } from "@tanstack/react-query";

interface props {
  query: UseQueryResult
  emptyStateMessage?: string | null;
  children: React.ReactNode;
}

export default function QueryWrapper({
  query,
  emptyStateMessage = null,
  children,
}: props) {
  if (query.isError) return <p>{`Something went wrong, please try again later.`}</p>;
  if (query.isLoading) return <p>Loading...</p>;
  if (query.data) {
    if (query.data) return children;
    if (emptyStateMessage) return <p>{emptyStateMessage}</p>;
  }
}
