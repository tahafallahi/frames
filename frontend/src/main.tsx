import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import "./index.css";
import UserProvider from "./providers/user-provider";

import Layout from "./pages/layout/layout";
import Feed from "./pages/feed/feed";
import AuthLayout from "./pages/auth-layout/auth-layout";
import Login from "./pages/login/login";
import Signup from "./pages/signup/signup";
import ViewPost from "./pages/view-post/view-post";
import Profile from "./pages/profile/profile";
import Show from "./pages/show/show";
import Trending from "./pages/trending/trending";
import FollowingsFeed from "./pages/followings-feed/followings-feed";

const router = createBrowserRouter([
  {
    Component: AuthLayout,
    children: [
      {
        path: "/signup",
        element: <Signup />,
      },
      {
        path: "/login",
        element: <Login />,
      },
    ],
  },
  {
    Component: Layout,
    children: [
      {
        path: "/",
        element: <Feed />,
      },
      {
        path: "/posts/:postId",
        element: <ViewPost />,
      },
      {
        path: "/profile/:userId",
        element: <Profile />,
      },
      {
        path: "/show/:mediaType/:showId",
        element: <Show />,
      },
      {
        path: "/trending/movie",
        element: <Trending mediaTypeProp={"MOVIE"}/>
      },
      {
        path: "/trending/tv",
        element: <Trending mediaTypeProp={"TV_SHOW"}/>
      },
      {
        path: "/followings",
        element: <FollowingsFeed />
      }
    ],
  },
]);

const queryClient = new QueryClient();

document.documentElement.classList.add("dark");

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <RouterProvider router={router}></RouterProvider>
      </UserProvider>
    </QueryClientProvider>
  </StrictMode>,
);
