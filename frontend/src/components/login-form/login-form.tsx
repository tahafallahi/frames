import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { isAxiosError, type AxiosResponse } from "axios";
import { Spinner } from "../ui/spinner";
import { Link, useNavigate } from "react-router";
import { Field, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import BarButton from "../bar-button/bar-button";
import BarLink from "../bar-link/bar-link";
import { useForm } from "react-hook-form";

interface LoginFormValues {
  username: string;
  password: string;
}

export default function LoginForm() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginFormValues>();

  const formMutation = useMutation({
    mutationFn: async (values: LoginFormValues) => {
      const res = await api.post<AxiosResponse>("/auth/login", values);
      return res.data;
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        if (error.status === 401) {
          setError("root.server", {
            message: "Username or password is incorrect.",
          });
        }
      } else {
        setError("root.server", {
          message: "Something went wrong, please try again later.",
        });
      }
    },
    onSuccess: async (_data, _variables, _onMutateResult, context) => {
      await context.client.invalidateQueries({ queryKey: ["user"] });
      await navigate(-1);
    },
  });

  return (
    <form
      onSubmit={handleSubmit((values: LoginFormValues) =>
        formMutation.mutate(values),
      )}
      className="md:mx-30 px-15 py-8 text-muted-foreground flex flex-col bg-popover border-t-4 border-primary gap-10"
    >
      <FieldGroup>
        <div className="flex flex-col gap-4">
          {errors.root?.server ? (
            <p className="text-destructive">{errors.root.server.message}</p>
          ) : null}

          <Field className=" flex flex-col gap-1">
            <FieldLabel htmlFor="username">Username</FieldLabel>
            {errors.username && (
              <p className="text-sm text-destructive">
                {errors.username.message}
              </p>
            )}
            <Input
              id="username"
              type="text"
              aria-invalid={!!errors.username}
              autoComplete="username"
              className="pl-3 p-1 border-primary rounded-lg border"
              {...register("username", {
                required: "Username is required.",
                maxLength: {
                  value: 32,
                  message: "Username must be between 3 and 32 characters.",
                },
                minLength: {
                  value: 3,
                  message: "Username must be between 3 and 32 characters.",
                },
              })}
            />
          </Field>
          <Field className=" flex flex-col gap-1">
            <FieldLabel htmlFor="password">Password</FieldLabel>
            {errors.password && (
              <p className="text-sm text-destructive">
                {errors.password.message}
              </p>
            )}
            <Input
              id="password"
              type="password"
              aria-invalid={!!errors.password}
              autoComplete="current-password"
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
              })}
            />
          </Field>
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex flex-col justify-end gap-2">
            {formMutation.isPending || formMutation.isSuccess ? (
              <BarButton type="submit" disabled>
                <Spinner className="absolute size-5 -translate-x-14" />
                Loging In...
              </BarButton>
            ) : (
              <BarButton type="submit">Log In</BarButton>
            )}
            <BarLink
              to={import.meta.env.VITE_GOOGLE_OAUTH2_LINK}
              variant="secondary"
            >
              <span>Or Sign Up With Google</span>
            </BarLink>
          </div>
          <Link
            to="/signup"
            replace
            className="text-sm text-center underline underline-offset-4"
          >
            If you don’t have an account, click here to sign up.
          </Link>
        </div>
      </FieldGroup>
    </form>
  );
}
