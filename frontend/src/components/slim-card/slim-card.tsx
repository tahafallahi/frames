import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export default function SlimCard({className, children }: {className?:string, children: ReactNode}) {
  return (
    <div className={cn("w-fill px-5 py-3 bg-background border-l border-primary", className)}>
      {children}
    </div>
  );
}
