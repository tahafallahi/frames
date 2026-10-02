import { cn } from "@/lib/utils";
import { buttonVariants } from "../ui/button";
import { Link } from "react-router";

interface Props {
  children: React.ReactNode
  className?: string;
  to: string;
}

export default function BarLink({
  children,
  className,
  to,
  ...rest
}: Props) {
  return (
    <Link
      to={to}
      {...rest}
      className={cn(
        buttonVariants({
          variant: "default",
          className: "min-h-13 font-bold min-w-0",
        }),
        className,
      )}
    >
      {children}
    </Link>
  );
}
