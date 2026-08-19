interface props {
  queryData: {
    isError: boolean;
    isLoading: boolean;
    data?: unknown[];
    error?: Error | null;
  };
  emptyStateMessage?: string | null;
  children: React.ReactNode;
}

export default function QueryWrapper({
  queryData,
  emptyStateMessage = null,
  children,
}: props) {
  if (queryData.isError) return <p>{`Something went wrong, please try again later.`}</p>;
  if (queryData.isLoading) return <p>Loading...</p>;
  if (queryData.data) {
    if (queryData.data.length > 0) return children;
    if (emptyStateMessage) return <p>{emptyStateMessage}</p>;
  }
}
