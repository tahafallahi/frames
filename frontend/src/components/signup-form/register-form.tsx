import { useMutation } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";

import { api } from "@/lib/api";
import { Spinner } from "../ui/spinner";
import { Field, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import BarButton from "../bar-button/bar-button";
import BarLink from "../bar-link/bar-link";
import type { Post } from "@/types/post";
import { useUser } from "@/contexts/user-context";
import { useEffect } from "react";

interface SignupFormValues {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function SignupForm() {
  const navigate = useNavigate();
  const [user] = useUser()

  const {
    register,
    handleSubmit,
    getValues,
    setError,
    formState: { errors },
  } = useForm<SignupFormValues>();

  const formMutation = useMutation({
    mutationFn: async (values: SignupFormValues) =>
      (await api.post<Post>("/auth/signup", values)).data,
    onError: (error) => {
      if (isAxiosError(error) && error.status === 409) {
        setError("root.server", {
          message: "Username or email already exist.",
        });
      }
    },
    onSuccess: async (_data, _variables, _onMutateResult, context) => {
      await navigate(-1);
      void context.client.invalidateQueries({ queryKey: ["user"] });
    },
  });

  useEffect(() => {
    if (user) void navigate("/")
  })

  if (user) return "Redirecting..."

  return (
    <form
      onSubmit={handleSubmit((values) => formMutation.mutate(values))}
      noValidate
      className="w-125 px-15 py-8 text-muted-foreground flex flex-col bg-popover border-t-4 border-primary gap-10"
    >
      <FieldGroup>
        <div className="flex flex-col gap-4">
          {errors.root?.server && (
            <p className="text-destructive">{errors.root.server.message}</p>
          )}

          <Field className="flex flex-col gap-1">
            <FieldLabel htmlFor="username">Username</FieldLabel>
            {errors.username && (
              <p className="text-sm text-destructive">
                {errors.username.message}
              </p>
            )}
            <Input
              id="username"
              type="text"
              autoCapitalize="none"
              spellCheck={false}
              aria-invalid={!!errors.username}
              autoComplete="username"
              className="pl-3 p-1 border-primary rounded-lg border"
              {...register("username", {
                required: "Username is required.",
                minLength: {
                  value: 3,
                  message: "Username must be between 3 and 32 characters.",
                },
                maxLength: {
                  value: 32,
                  message: "Username must be between 3 and 32 characters.",
                },
              })}
            />
          </Field>

          <Field className="flex flex-col gap-1">
            <FieldLabel htmlFor="email">Email</FieldLabel>
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
            <Input
              type="email"
              id="email"
              autoComplete="email"
              aria-invalid={!!errors.email}
              className="pl-3 p-1 border-primary rounded-lg border"
              {...register("email", {
                required: "Email is required.",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Please enter a valid email address.",
                },
              })}
            />
          </Field>

          <Field className="flex flex-col gap-1">
            <FieldLabel htmlFor="password">Password</FieldLabel>
            {errors.password && (
              <p className="text-sm text-destructive">
                {errors.password.message}
              </p>
            )}
            <Input
              type="password"
              id="password"
              aria-invalid={!!errors.password}
              autoComplete="new-password"
              className="pl-3 p-1 border-primary rounded-lg border"
              {...register("password", {
                required: "Password is required.",
                minLength: {
                  value: 8,
                  message: "Password must have at least 8 characters.",
                },
                maxLength: {
                  value: 100,
                  message: "Password must have less than 100 characters.",
                },
                deps: ["confirmPassword"], // re-validate confirmation when this changes
              })}
            />
          </Field>

          <Field className="flex flex-col gap-1">
            <FieldLabel htmlFor="confirmPassword">Confirm Password</FieldLabel>
            {errors.confirmPassword && (
              <p className="text-sm text-destructive">
                {errors.confirmPassword.message}
              </p>
            )}
            <Input
              type="password"
              id="confirmPassword"
              autoComplete="new-password"
              aria-invalid={!!errors.confirmPassword}
              className="pl-3 p-1 border-primary rounded-lg border"
              {...register("confirmPassword", {
                required: "Please confirm your password.",
                validate: (value) =>
                  value === getValues("password") || "Passwords don't match.",
              })}
            />
          </Field>
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex flex-col justify-end gap-2">
            {formMutation.isPending || formMutation.isSuccess ? (
              <BarButton type="submit" disabled>
                <Spinner className="absolute size-5 -translate-x-14" />
                Sign Up...
              </BarButton>
            ) : (
              <BarButton type="submit">Sign Up</BarButton>
            )}
            <BarLink
              to={import.meta.env.VITE_GOOGLE_OAUTH2_LINK}
              variant="secondary"
            >
              <span>Or Sign Up With Google</span>
            </BarLink>
          </div>
          <Link
            to="/login"
            replace 
            className="text-sm text-center underline underline-offset-4"
          >
            If you already have an account, click here to log in.
          </Link>
        </div>
      </FieldGroup>
    </form>
  );
}
