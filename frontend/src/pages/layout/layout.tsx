import Header from "@/layouts/header/header";
import SideBar from "@/layouts/side-bar/side-bar";
import { Outlet } from "react-router";

export default function Layout() {
  return (
    <>
      <Header />
      <div className="grid grid-cols-[300px_1fr] items-start justify-items-center">
        <SideBar selectedFeed="All" />
        <div className="pt-6">
          <Outlet />
        </div>
      </div>
    </>
  );
}
