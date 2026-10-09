import LoginForm from "@/components/login-form/login-form";

export default function Login() {
  return (
    <>
      <div className="flex flex-col gap-18 pt-12 ">
        <h3 className="text-3xl md:text-6xl font-bold px-10 text-center">
          Welcome back to <span className="text-primary">Frames</span>
        </h3>
        <LoginForm />
      </div>
    </>
  );
}
