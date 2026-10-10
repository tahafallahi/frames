import { useUser } from "@/contexts/user-context";
import { Link } from "react-router";

export default function LoginProtection() {
  const [,, userQuery] = useUser()

  return !userQuery.isPending && (
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
