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
import CreatePost from "./pages/create-post/create-post";
import { toast, Toaster } from "./components/ui/toast";
import FeedSortProvider from "./providers/feed-sort-provider";
import ErrorPage from "./pages/error-page/error";

const STALE_TIME = 5 * 10 * 1000

const router = createBrowserRouter([
  { 
    path: "/",
    ErrorBoundary: ErrorPage
  },
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
        index: true,
        element: <Feed />,
        handle: { selectedPage: "feed" },
      },
      {
        path: "/posts/:postId",
        element: <ViewPost />,
      },
      {
        path: "/profile/:userId",
        element: <Profile />,
        handle: { selectedPage: "profile" },
      },
      {
        path: "/show/:mediaType/:showId",
        element: <Show />,
      },
      {
        path: "/trending/movie",
        element: <Trending mediaType={"MOVIE"} />,
        handle: { selectedPage: "trending-movies" },
      },
      {
        path: "/trending/tv",
        element: <Trending mediaType={"TV_SHOW"} />,
        handle: { selectedPage: "trending-tvs" },
      },
      {
        path: "/followings",
        element: <FollowingsFeed />,
        handle: { selectedPage: "followings-feed" },
      },
      {
        path: "/create",
        element: <CreatePost />,
      },
    ],
  },
]);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { refetchOnReconnect: "always", retry: 2, staleTime: STALE_TIME},
    mutations: {
      onError: () => {
        toast.add({
          type: "error",
          description: `Something went wrong, please try again later.`,
        });
      },
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <FeedSortProvider>
          <RouterProvider router={router}></RouterProvider>
          <Toaster timeout={import.meta.env.VITE_TOASTER_TIMEOUT} />
        </FeedSortProvider>
      </UserProvider>
    </QueryClientProvider>
  </StrictMode>,
);
