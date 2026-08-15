import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";

import "./index.css";
import Layout from "./pages/layout/layout";

const router = createBrowserRouter([
  {
    Component: Layout,
    children: [
      {
        path: "/",
        element: <p className="h-1000">Hello</p>,
      },
    ],
  },
]);

document.documentElement.classList.add("dark");

createRoot(document.getElementById("root")!).render(
  <StrictMode>
      <RouterProvider router={router}></RouterProvider>
  </StrictMode>,
);
