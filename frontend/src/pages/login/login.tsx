import LoginForm from "@/components/login-form/login-form";

export default function Login() {
  return (
    <>
      <div className="flex flex-col gap-18 items-center pt-12">
        <h3 className="text-6xl font-bold">
          Welcome back to <span className="text-primary">Frames</span>
        </h3>
        <LoginForm />
      </div>
    </>
  );
}
