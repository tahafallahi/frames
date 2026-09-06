import type { UseQueryResult } from "@tanstack/react-query";

interface props {
  query: UseQueryResult;
  emptyStateMessage?: React.ReactNode | null;
  loadingPlaceHolder: React.ReactNode;
  isEmpty: boolean;
  children: React.ReactNode;
}

export default function QueryWrapper({
  query,
  children,
  loadingPlaceHolder,
  emptyStateMessage,
  isEmpty,
}: props) {
  if (query.isError)
    return <p>{`Something went wrong, please try again later.`}</p>;
  if (query.isPending) return loadingPlaceHolder;
  if (isEmpty)
    return (
      emptyStateMessage ?? (
        <p className="pt-10 text-center text-muted-foreground">"empty"</p>
      )
    );
  return children;
}
