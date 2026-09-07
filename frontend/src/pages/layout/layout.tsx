import Header from "@/layouts/header/header";
import SideBar from "@/layouts/side-bar/side-bar";
import ScrollToTop from "@/utils/scroll-to-top";
import { Outlet } from "react-router";

export default function Layout() {
  return (
    <>
      <ScrollToTop />
      <Header />
      <div className="grid grid-cols-[300px_1fr] items-start justify-items-center">
        <SideBar selectedFeed="All" />
        <div className="pt-6" >
          <div className="grid grid-cols-[minmax(100px,700px)_minmax(100px,300px)] items-start justify-items gap-12">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
}
