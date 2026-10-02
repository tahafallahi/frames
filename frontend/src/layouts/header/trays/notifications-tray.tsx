import SlimCard from "@/components/slim-card/slim-card";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { api } from "@/lib/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Link } from "react-router";

export default function NotificationsTray() {
  const newFollowsQuery = useQuery({
    queryKey: ["new-follows"],
    queryFn: async () =>
      (
        await api.get<{ username: string; id: string }[]>(
          "/user/follow-notifications",
        )
      ).data,
  });

  const dismissNotifsMut = useMutation({
    mutationFn: async () => await api.delete("/user/follow-notifications"),
    onMutate: async (_varaibles, context) => {
      await context.client.cancelQueries({ queryKey: ["new-follows"] });

      const prev = context.client.getQueryData(["new-follows"]);
      context.client.setQueryData(["new-follows"], []);

      return { prev };
    },
    onError: (_error, _variables, onMutateResult, context) => {
      context.client.setQueryData(["new-follows"], onMutateResult?.prev);
      toast.add({
        type: "error",
        description: "Something went wrong, please try again later.",
      });
    },
    onSettled: async (_data, _error, _variables, _onMutateResult, context) => {
      await context.client.invalidateQueries({ queryKey: ["new-follows"] });
    },
  });

  return (
    <div className="flex flex-col justify-end">
      <p>
        You have {newFollowsQuery.data ? newFollowsQuery.data.length : 0}{" "}
        notifications
      </p>
      <Button variant={"ghost"} className="p-0 hover:text-destructive self-end" onClick={() => dismissNotifsMut.mutate()}>
        dismiss all
      </Button>
      <div className="flex flex-col gap-2">
        {newFollowsQuery.data?.map((n, i) => (
          <SlimCard key={i} className="border-l-3">
            <p>
              <Link to={`/profile/${n.id}`} className="text-primary">
                {n.username}
              </Link>{" "}
              started following you!
            </p>
          </SlimCard>
        ))}
      </div>
    </div>
  );
}
