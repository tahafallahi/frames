import PostForm from "@/components/post-form/post-form";
import QueryWrapper from "@/components/query-wrapper/query-wrapper";
import ShowCard from "@/components/show-card/show-card";
import Skeleton from "@/components/skeleton/skeleton";
import { toast } from "@/components/ui/toast";
import { useUser } from "@/contexts/user-context";
import { api } from "@/lib/api";
import type { Post, PostForm as PostFormType } from "@/types/post";
import {
  MediaType,
  type ApiSearchShow,
  type Show,
  type ShowIdentifier,
} from "@/types/show";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import LoginProtection from "../login-protection/login-protection";

const DEBOUNCE_DELAY = 300;

export default function CreatePost() {
  const [user] = useUser();
  const timeoutId = useRef<number>(null);
  const navigate = useNavigate();
  const [serachparams] = useSearchParams();

  const showIdentifier =
    serachparams.size >= 2
      ? {
          tmdbId: Number(serachparams.get("showId")),
          mediaType:
            serachparams.get("type") === "movie"
              ? MediaType.MOVIE
              : MediaType.TV_SHOW,
        }
      : null;

  const [show, setShow] = useState<ShowIdentifier | null>(
    showIdentifier ?? null,
  );

  function debounceSetShow(show: ApiSearchShow | null) {
    if (timeoutId.current) clearTimeout(timeoutId.current);
    timeoutId.current = setTimeout(() => {
      setShow(show);
    }, DEBOUNCE_DELAY);
  }

  const showQuery = useQuery({
    queryKey: ["show", show?.tmdbId, show?.mediaType],
    queryFn: async () =>
      (
        await api.get<Show>(
          `/shows/${show?.mediaType === MediaType.MOVIE ? "movie" : "tv"}/${show?.tmdbId}`,
        )
      ).data,
    enabled: !!show,
    staleTime: 5 * 10 * 1000
  });

  const sendPostMutation = useMutation({
    mutationFn: async (form: PostFormType) =>
      (await api.post<Post>("/posts", form)).data,
    onSuccess: async (data) => {
      toast.add({ type: "success", description: "Post created." });
      await navigate("/posts/" + data.id);
    },
  });

  function handleFormSubmit(form: PostFormType) {
    sendPostMutation.mutate(form);
  }

  if (!user) return <LoginProtection />;

  return (
    <>
      <div>
        <PostForm
          handleFormSubmit={handleFormSubmit}
          setShow={debounceSetShow}
          mutation={sendPostMutation}
          show={showQuery.data ?? null}
        />
      </div>
      <div>
        {showQuery.isEnabled && (
          <QueryWrapper
            query={showQuery}
            isEmpty={!!(showQuery.data && !Object.keys(showQuery.data).length)}
            loadingPlaceHolder={
              <div>
                <Skeleton className="h-7 mb-4" />
                <Skeleton className="ml-4 h-100" />
                <div className="ml-4 mt-4 flex flex-col gap-2">
                  <Skeleton variant="line" />
                  <Skeleton variant="line" />
                  <Skeleton variant="line" />
                  <Skeleton variant="line" />
                  <Skeleton variant="line" />
                  <Skeleton variant="line" className="w-50" />
                  <Skeleton variant="line" className="w-50" />
                </div>
              </div>
            }
          >
            {showQuery.data && (
              <ShowCard show={showQuery.data} title overview />
            )}
          </QueryWrapper>
        )}
      </div>
    </>
  );
}
