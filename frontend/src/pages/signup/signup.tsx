import SignupForm from "@/components/signup-form/register-form";


export default function Signup() {
  return (
    <>
      <div className="flex flex-col gap-18 items-center pt-12">
        <h3 className="text-6xl font-bold">
          Welcome to <span className="text-primary">Frames</span>
        </h3>
        <SignupForm />
      </div>
    </>
  );
}
