import { Button } from "../ui/button";
import { MediaType, type Show } from "@/types/show";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { User } from "@/types/user";
import { Spinner } from "../ui/spinner";
import { toast } from "../ui/toast";

export default function AddFavoriteButton({
  user,
  show,
  setUser,
  variant,
}: {
  user: User;
  show: Show;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  variant: "secondary" | "default";
}) {
  const isFavorite = user.favorites?.some((f) => f.id === show.id);

  const addFavoriteMutation = useMutation({
    mutationFn: async ({
      showId,
      mediaType,
    }: {
      showId: number;
      mediaType: MediaType;
    }) =>
      (
        await api.post<Show>("/user/favorites", {
          showId,
          mediaType,
        })
      ).data,
    onSuccess: () => {
      setUser({ ...user, favorites: [...user.favorites, show] });
    },
    onError: () => {
      toast.add({
        type: "error",
        description: `Something went wrong, please try again later.`,
      });
    },
  });

  const removeFavoriteMutation = useMutation({
    mutationFn: async ({
      showId,
      mediaType,
    }: {
      showId: number;
      mediaType: MediaType;
    }) =>
      (
        await api.post<Show>("/user/favorites-remove", {
          showId,
          mediaType,
        })
      ).data,
    onSuccess: () => {
      setUser({
        ...user,
        favorites: [...user.favorites.filter((f) => f.id !== show.id)],
      });
    },
    onError: () => {
      toast.add({
        type: "error",
        description: `Something went wrong, please try again later.`,
      });
    },
  });

  function handleAddFavorite() {
    if (isFavorite) {
      removeFavoriteMutation.mutate({
        showId: show.tmdbId,
        mediaType: show.mediaType,
      });
    } else {
      addFavoriteMutation.mutate({
        showId: show.tmdbId,
        mediaType: show.mediaType,
      });
    }
  }
  return isFavorite ? (
    <Button
      className="h-13 font-bold"
      variant={variant}
      onClick={handleAddFavorite}
    >
      Remove from Favorites
      {removeFavoriteMutation.isPending && <Spinner data-icon="inline-end" />}
    </Button>
  ) : (
    <Button
      className="h-13 font-bold"
      variant={variant}
      onClick={handleAddFavorite}
    >
      Add to Your Favorites
      {addFavoriteMutation.isPending && <Spinner data-icon="inline-end" />}
    </Button>
  );
}
