import Header from "@/layouts/header/header";
import SideBar from "@/layouts/side-bar/side-bar";
import ScrollToTop from "@/utils/scroll-to-top";

import { Outlet, useMatches } from "react-router";

export default function Layout({ children }: { children?: React.ReactNode }) {
  const matches = useMatches();
  const handle = (matches.at(-1)?.handle as { selectedPage: string }) ?? "";

  return (
    <>
      <ScrollToTop />
      <Header />
      <div className="xl:grid xl:grid-cols-[300px_1fr] items-start justify-items-center">
        <SideBar selectedPage={handle.selectedPage} />
        <div className="pt-6">
          <div className="w-full grid grid-cols-1 md:grid-cols-[minmax(100px,848px)_minmax(100px,300px)] items-start justify-items gap-4 pr-4 md:pr-0 lg:gap-12 *:first:ml-4 mr-4 lg:*:first:ml-12 lg:mr-20 *:last:sticky *:last:top-24  ">
            {children ?? <Outlet />}
          </div>
        </div>
      </div>
    </>
  );
}
