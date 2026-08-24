import { useRef, useState } from "react";
import { Button } from "../ui/button";
import { api } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import { Spinner } from "../ui/spinner";
import { isAxiosError, type AxiosResponse } from "axios";
import { Link, useNavigate } from "react-router";

export default function SignupForm() {
  const [formError, setFormError] = useState("");
  const navigate = useNavigate();

  const passwordRef = useRef<HTMLInputElement>(null);

  function handleUsernameInput(event: React.InputEvent<HTMLInputElement>) {
    const element = event.currentTarget;

    if (element.value.length > 32 || element.value.length < 3) {
      element.setCustomValidity(
        "Username must be between 3 and 32 characters.",
      );
    } else {
      element.setCustomValidity("");
    }
  }

  function handlePasswordInput(event: React.InputEvent<HTMLInputElement>) {
    const element = event.currentTarget;

    if (element.value.length < 8) {
      element.setCustomValidity("Password must have more than 8 characters.");
    } else if (element.value.length > 100) {
      element.setCustomValidity("Password must have less 100 characters.");
    } else {
      element.setCustomValidity("");
    }
  }

  function handlePasswordConfirmationInput(
    event: React.InputEvent<HTMLInputElement>,
  ) {
    const element = event.currentTarget;

    if (element.value !== passwordRef.current?.value) {
      element.setCustomValidity("Passwords don't match.");
    } else {
      element.setCustomValidity("");
    }
  }

  const formMutation = useMutation({
    mutationFn: async (event: React.SubmitEvent<HTMLFormElement>) => {
      event.preventDefault();
      setFormError("");
      return (
        await api.post<AxiosResponse>(
          "/auth/signup",
          Object.fromEntries(new FormData(event.target)),
        )
      ).data;
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        if (error.status === 409) {
          setFormError("Username or email already exist.");
        }
      }
    },
    onSuccess: async () => {
      await navigate("/");
    },
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
            name="username"
            type="text"
            onInput={handleUsernameInput}
            className="pl-3 p-1 border-primary rounded-lg border"
          />
        </div>
        <div className=" flex flex-col gap-1">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            className="pl-3 p-1 border-primary rounded-lg border"
            required
          />
        </div>

        <div className=" flex flex-col gap-1">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            ref={passwordRef}
            onInput={handlePasswordInput}
            className="pl-3 p-1 border-primary rounded-lg border"
            required
          />
        </div>

        <div className=" flex flex-col gap-1">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            onInput={handlePasswordConfirmationInput}
            className="pl-3 p-1 border-primary rounded-lg border"
            required
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
              <Spinner className="absolute size-5 -translate-x-11" />
              Sign Up
            </Button>
          ) : (
            <Button className="h-10 font-bold" type="submit">
              Sign Up
            </Button>
          )}
          <Link
            to={import.meta.env.VITE_GOOGLE_OAUTH2_LINK}
            className=" flex h-10 font-bold text-sm justify-center items-center  bg-secondary text-background rounded-sm "
          >
            <span>Or Sign Up With Google</span>
          </Link>
        </div>
        <a
          href="/login"
          className="text-sm text-center underline underline-offset-4"
        >
          If you already an account, click here to log in.
        </a>
      </div>
    </form>
  );
}
