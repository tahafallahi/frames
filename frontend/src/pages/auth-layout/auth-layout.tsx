import Header from "@/layouts/header/header";
import { Outlet } from "react-router";

export default function AuthLayout() {
  return (
    <>
      <Header variant={"compact"}/>
      <div className="grid grid-cols-[1fr] items-start justify-items-center pt-6">
          <Outlet />
      </div>
    </>
  );
}
