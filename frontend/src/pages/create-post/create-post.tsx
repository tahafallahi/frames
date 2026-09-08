import PostForm from "@/components/post-form/post-form";
import { api } from "@/lib/api";
import type { PostForm as PostFormType } from "@/types/post";
import type { ApiSearchResponse } from "@/types/search";
import { MediaType, type ApiSearchShow } from "@/types/show";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

const DEBOUNCE_DELAY = 500;
const STALE_TIME = 1000 * 60;
const LIMIT = 12;

export default function CreatePost() {
  const [form, setForm] = useState<PostFormType>({
    title: "",
    showTitle: "",
    content: "",
  });

  const searcgQuery = useQuery({
    queryKey: ["searchResult", form.showTitle],
    queryFn: () => getSearchResult(form.showTitle, LIMIT),
    staleTime: STALE_TIME,
    enabled: form.showTitle.length > 0,
  });

  return (
    <>
      <div>
        <PostForm form={form} setForm={setForm} />
      </div>
      <div className="grid grid-cols-3 gap-2 py-3">
        {searcgQuery.data &&
          searcgQuery.data.movies.map((s: ApiSearchShow, i) => (
            <div className="bg-background hover:ring-2 ring-primary" key={i}>
              <img
                className="w-full h-auto aspect-2/3"
                src={
                  s.posterPath
                    ? "https://image.tmdb.org/t/p/w154/" + s.posterPath
                    : s.mediaType === MediaType.MOVIE
                      ? import.meta.env.VITE_MOVIE_PLACEHOLDER
                      : import.meta.env.VITE_TV_SHOW_PLACEHOLDER
                }
                alt={s.title}
              />
              <div className="py-4">
                <p className="text-sm text-center  line-clamp-2  ">{s.title}</p>
              </div>
            </div>
          ))}
      </div>
    </>
  );
}

async function getSearchResult(query: string, limit: number) {
  const result = await api.get<ApiSearchResponse>(
    `/search?query=${query}&limit=${limit}`,
  );

  return result.data;
}
