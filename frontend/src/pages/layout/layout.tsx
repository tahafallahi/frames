import { useUser } from "@/contexts/user-context";
import Header from "@/layouts/header/header";
import SideBar from "@/layouts/side-bar/side-bar";
import { Outlet } from "react-router";

export default function Layout() {
  const [user, setUser] = useUser()

  console.log(user)

  return (
    <>
      <Header user={user}/>
      <div className="grid grid-cols-[300px_1fr] items-start justify-items-center">
        <SideBar selectedFeed="All" />
        <div className="pt-6">
          <Outlet />
        </div>
      </div>
    </>
  );
}
