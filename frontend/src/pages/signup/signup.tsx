import SignupForm from "@/components/signup-form/register-form";


export default function Signup() {
  return (
    <>
      <div className="flex flex-col gap-18  pt-12">
        <h3 className="text-3xl md:text-6xl font-bold px-10 text-center">
          Welcome to <span className="text-primary">Frames</span>
        </h3>
        <SignupForm />
      </div>
    </>
  );
}
