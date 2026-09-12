import { useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

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

import type React from "react";
import type { ApiSearchResponse } from "@/types/search";
import type { ApiSearchShow } from "@/types/show";
import { isAxiosError } from "axios";

const DEBOUNCE_DELAY = 500;
const STALE_TIME = 1000 * 60;
const LIMIT = 10;

export default function PostForm({
  handleFormSubmit,
  setShow,
}: {
  handleFormSubmit: React.SubmitEventHandler<HTMLFormElement>;
  setShow: (show: ApiSearchShow | null) => void;
}) {
  const [input, setInput] = useState("");
  const timeoutId = useRef<number>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const query = useQuery({
    queryKey: ["formSearchResult", input],
    queryFn: () => getSearchResult(input, LIMIT),
    staleTime: STALE_TIME,
    enabled: input.length > 0,
  });

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
        onSubmit={handleFormSubmit}
        className="px-5 py-3 bg-popover border-t border-primary"
      >
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="title">Title *</FieldLabel>
            <Input
              id="title"
              name="title"
              type="text"
              placeholder="Title of your post."
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="show">Movie or TV Show *</FieldLabel>
            <Combobox
              id="show"
              name="showId"
              items={query.data && query.data}
              onInputValueChange={(input) => {
                handleInput(input);
              }}
              itemToStringValue={(show: ApiSearchShow) =>
                show.tmdbId.toString()
              }
              itemToStringLabel={(show: ApiSearchShow) => `${show.title}`}
              onItemHighlighted={(show) => show && setShow(show)}
            >
              <ComboboxInput
                placeholder="Name of the movie or tv show you want to write about."
                ref={inputRef}
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
          </Field>
          <Field>
            <FieldLabel htmlFor="content">Body</FieldLabel>
            <Textarea
              id="content"
              name="content"
              className="h-40"
              placeholder="Body of your post (optional)."
            />
          </Field>
          <div className="flex justify-end gap-4">
            <Button className="w-20 font-bold" variant={"destructive"}>
              Discard
            </Button>
            <Button type="submit" className="w-20 font-bold">
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
