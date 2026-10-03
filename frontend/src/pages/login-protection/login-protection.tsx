import { Link } from "react-router";

export default function LoginProtection() {
  return (
    <div>
      You are not logged in. Please
      <Link to="/login" className="text-primary">
        {" "}
        log in{" "}
      </Link>
      first, to see this page.
    </div>
  );
}
