import { Button } from "../ui/button";

export default function LoginForm() {
  return (
    <form className="w-125 px-15 py-8 text-muted-foreground flex flex-col bg-popover border-t-4 border-primary gap-10">
      <div className="flex flex-col gap-4">
        <div className=" flex flex-col gap-1">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            className="pl-3 p-1 border-primary rounded-lg border"
          />
        </div>
        <div className=" flex flex-col gap-1">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            className="pl-3 p-1 border-primary rounded-lg border"
          />
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex flex-col justify-end gap-2">
          <Button className="h-10 font-bold">Log In</Button>
          <Button variant={"secondary"} className="h-10 font-bold">
            Or Log In With Google
          </Button>
        </div>
        <a href="/signup" className="text-sm text-center underline underline-offset-4">
          If you don’t have an account, click here to sign up.
        </a>
      </div>
    </form>
  );
}
