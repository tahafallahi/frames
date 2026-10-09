import Header from "@/layouts/header/header";
import SideBar from "@/layouts/side-bar/side-bar";
import ScrollToTop from "@/utils/scroll-to-top";
import { useState } from "react";

import { Outlet, useMatches } from "react-router";

export default function Layout({ children }: { children?: React.ReactNode }) {
  const matches = useMatches();
  const handle = (matches.at(-1)?.handle as { selectedPage: string }) ?? "";
  const [sideBarOpen, setSideBarOpen] = useState(false)

  return (
    <>
      <ScrollToTop />
      <Header setSideBarOpen={setSideBarOpen} />
      <div className="xl:grid xl:grid-cols-[300px_1fr] items-start md:justify-items-center">
        <SideBar selectedPage={handle.selectedPage} sideBarOpen={sideBarOpen} setSideBarOpen={setSideBarOpen} />
          <div className="pt-6 grid grid-cols-1 md:grid-cols-[minmax(100px,848px)_minmax(100px,300px)] items-start justify-items 
                          *:mx-4 xl:gap-12  
                          xl:*:first:ml-12 xl:*:first:mr-0
                          md:*:last:sticky *:last:top-24 *:first:order-last md:*:first:order-first ">
            {children ?? <Outlet />}
          </div>
      </div>
    </>
  );
}
