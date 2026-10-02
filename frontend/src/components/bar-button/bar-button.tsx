import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";
import { Button } from "../ui/button";

type Props = ComponentProps<typeof Button>;

export default function BarButton({ children, className, ...rest }: Props) {
  return (
    <Button className={cn("min-h-13 font-bold", className)} {...rest}>
      {children}
    </Button>
  );
}