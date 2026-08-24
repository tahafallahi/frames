import { useMutation } from "@tanstack/react-query";
import { Button } from "../ui/button";
import { api } from "@/lib/api";
import { useState } from "react";
import { isAxiosError, type AxiosResponse } from "axios";
import { Spinner } from "../ui/spinner";
import { useNavigate } from "react-router";

export default function LoginForm() {
  const [formError, setFormError] = useState("");
  const navigate = useNavigate()

  const formMutation = useMutation({
    mutationFn: async (event: React.SubmitEvent<HTMLFormElement>) => {
      event.preventDefault();
      const res  =
      await api.post<AxiosResponse>(
        "/auth/login",
        Object.fromEntries(new FormData(event.target)),
      )
      setFormError("");
      return res.data
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        if (error.status === 401) {
          setFormError("Username or password is incorrect.")
        } else {
          setFormError(error.message);
        }
      }
    },
    onSuccess: () => navigate("/")
  });

  return (
    <form
      onSubmit={formMutation.mutate}
      className="w-125 px-15 py-8 text-muted-foreground flex flex-col bg-popover border-t-4 border-primary gap-10"
    >
      <div className="flex flex-col gap-4">
        {formError ? <p className="text-destructive">{formError}</p> : null}

        <div className=" flex flex-col gap-1">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            name="username"
            className="pl-3 p-1 border-primary rounded-lg border"
          />
        </div>
        <div className=" flex flex-col gap-1">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            className="pl-3 p-1 border-primary rounded-lg border"
          />
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex flex-col justify-end gap-2">
          {formMutation.isPending ? (
            <Button
              className="h-10 font-bold bg-primary/60 hover:bg-primary/60"
              type="submit"
            >
              <Spinner className="absolute size-5 -translate-x-14" />
              Loging In...
            </Button>
          ) : (
            <Button className="h-10 font-bold" type="submit">
              Log In
            </Button>
          )}
          <Button variant={"secondary"} className="h-10 font-bold">
            Or Log In With Google
          </Button>
        </div>
        <a
          href="/signup"
          className="text-sm text-center underline underline-offset-4"
        >
          If you don’t have an account, click here to sign up.
        </a>
      </div>
    </form>
  );
}
