import { useRef, useState } from "react";
import { useQuery, type UseMutationResult } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Controller, useForm } from "react-hook-form";
import { isAxiosError } from "axios";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Field, FieldGroup, FieldLabel } from "../ui/field";
import {
  Combobox,
  ComboboxCollection,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
} from "../ui/combobox";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";

import type { ApiSearchResponse } from "@/types/search";
import { MediaType, type ApiSearchShow, type Show } from "@/types/show";
import type { Post, PostForm, PostForm as PostFormType } from "@/types/post";
import { Spinner } from "../ui/spinner";
import { tagsQueryOpts } from "@/lib/queryOptions";
import { useNavigate } from "react-router";

const DEBOUNCE_DELAY = 500;
const STALE_TIME = 1000 * 60;
const LIMIT = 10;

interface Props {
  handleFormSubmit: (form: PostFormType) => void;
  setShow: (show: ApiSearchShow | null) => void;
  mutation: UseMutationResult<Post, Error, PostForm, unknown>;
  show: Show | null;
}

export default function PostForm({
  handleFormSubmit,
  setShow,
  mutation,
  show,
}: Props) {
  const [input, setInput] = useState("");
  const timeoutId = useRef<number>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<PostFormType>({
    defaultValues: {
      showIdentifier: show
        ? {
            tmdbId: show.tmdbId,
            mediaType:
              show.mediaType === MediaType.MOVIE
                ? MediaType.MOVIE
                : MediaType.TV_SHOW,
          }
        : undefined,
    },
  });

  const query = useQuery({
    queryKey: ["formSearchResult", input],
    queryFn: () => getSearchResult(input, LIMIT),
    staleTime: STALE_TIME,
    enabled: input.length > 0,
  });

  const tags = useQuery(tagsQueryOpts());

  function handleInput(i: string) {
    if (timeoutId.current) clearTimeout(timeoutId.current);
    if (i.length < 1) setShow(null);
    timeoutId.current = setTimeout(() => {
      setInput(i);
    }, DEBOUNCE_DELAY);
  }

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-2xl font-bold">Create New Post</h3>
      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        className="px-5 py-3 bg-popover border-t border-primary"
        method="POST"
      >
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="title">Title *</FieldLabel>
            <p className="text-destructive">{errors.title?.message}</p>
            <Input
              {...register("title", {
                required: "Title is required.",
                maxLength: {
                  value: 300,
                  message: "Title should not be more than 300 characters long.",
                },
              })}
              aria-invalid={!!errors.title}
              type="text"
              placeholder="Title of your post."
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="show">Movie or TV Show *</FieldLabel>
            <p className="text-destructive">{errors.showIdentifier?.message}</p>
            <Controller
              name="showIdentifier"
              control={control}
              rules={{ required: "Please select a movie or TV show." }}
              render={({ field }) => (
                <Combobox
                  defaultValue={
                    show && {
                      tmdbId: show.tmdbId,
                      title: show.title,
                      posterPath: show.posterPath,
                      releaseDate: show.releaseYear.toString(),
                      mediaType: show.mediaType,
                    }
                  }
                  items={query.data && query.data}
                  onInputValueChange={(input) => {
                    handleInput(input);
                  }}
                  onValueChange={(show) => {
                    field.onChange(
                      show
                        ? { tmdbId: show.tmdbId, MediaType: show.mediaType }
                        : null,
                    );
                  }}
                  itemToStringLabel={(show: ApiSearchShow) => `${show.title}`}
                  onItemHighlighted={(show) => {
                    if (show) setShow(show);
                  }}
                >
                  <ComboboxInput
                    placeholder="Name of the movie or tv show you want to write about."
                    ref={inputRef}
                    aria-invalid={!!errors.showIdentifier}
                    showClear
                  ></ComboboxInput>
                  <ComboboxContent
                    className="outline-1 outline-popover ring-3"
                    sideOffset={10}
                  >
                    <ComboboxEmpty>
                      {query.isLoading
                        ? "loading..."
                        : query.isError
                          ? "something went wrong, please try again later."
                          : "empty"}
                    </ComboboxEmpty>
                    <ComboboxList>
                      {(group: { value: string; items: string[] }) => (
                        <ComboboxGroup key={group.value} items={group.items}>
                          <ComboboxLabel>{group.value}</ComboboxLabel>
                          <ComboboxCollection>
                            {(item: {
                              tmdbId: number;
                              title: string;
                              releaseDate: number;
                            }) => (
                              <ComboboxItem key={item.tmdbId} value={item}>
                                {item.title}
                                <span className="text-muted-foreground">
                                  {item.releaseDate}
                                </span>
                              </ComboboxItem>
                            )}
                          </ComboboxCollection>
                        </ComboboxGroup>
                      )}
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>
              )}
            ></Controller>
          </Field>
          <Field>
            <FieldLabel htmlFor="content">Body</FieldLabel>
            <p className="text-destructive">{errors.content?.message}</p>
            <Textarea
              {...register("content", {
                maxLength: {
                  value: 10000,
                  message: "Body should not be more than 300 characters long.",
                },
              })}
              aria-invalid={!!errors.content}
              className="h-40"
              placeholder="Body of your post (optional)."
            />
          </Field>
          <Field>
            <FieldLabel>Tags</FieldLabel>
            <p className="text-destructive">{errors.tags?.message}</p>
            <Controller
              name="tags"
              control={control}
              rules={{validate: (v) => !!v.length || "Pick at least one tag." }}
              render={({ field }) => (
                <ToggleGroup
                  value={field.value}
                  aria-invalid={!!errors.tags}
                  onValueChange={field.onChange}
                  multiple
                >
                  {tags.data?.map((t) => (
                    <ToggleGroupItem
                      value={t.name}
                      key={t.id}
                      className="h-auto rounded-full border border-border px-4 py-1.5 text-base data-pressed:border-primary data-pressed:bg-primary data-pressed:text-primary-foreground"
                    >
                      {t.name}
                    </ToggleGroupItem>
                  )) ?? "Loading tags..."}
                </ToggleGroup>
              )}
            />
          </Field>
          <div className="flex justify-between gap-4">
            <Button className="px-10 h-13 font-bold" variant={"destructive"} onClick={() => navigate(-1)}>
              Discard
            </Button>
            <Button type="submit" className="px-10 h-13 font-bold">
              {mutation.isPending && <Spinner data-icon="incline-start" />}
              Post
            </Button>
          </div>
        </FieldGroup>
      </form>
    </div>
  );
}

async function getSearchResult(query: string, limit: number) {
  try {
    const result = (
      await api.get<ApiSearchResponse>(`/search?query=${query}&limit=${limit}`)
    ).data;

    return [
      {
        value: "Movies",
        items: result.movies,
      },
      {
        value: "TV Shows",
        items: result.tvs,
      },
    ];
  } catch (error) {
    if (isAxiosError(error)) return null;
  }
}
