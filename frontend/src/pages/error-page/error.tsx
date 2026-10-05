import { Link, useRouteError, type ErrorResponse } from "react-router";
import Layout from "../layout/layout";

export default function ErrorPage() {
  const error = useRouteError() as ErrorResponse;

  return (
    <Layout>
      <div>
        <h4 className="text-3xl font-bold inline mr-4">
          <span className="text-primary ">{error.status}</span>{" "}
          {error.statusText}
        </h4>
        <Link to={"/"} className="text-primary/80">Go to home page.</Link>
      </div>
    </Layout>
  );
}
