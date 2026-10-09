import { motion } from "motion/react";
import { twMerge } from "tailwind-merge";

export default function Skeleton({
  className,
  variant,
}: {
  className?: string;
  variant?: "line";
}) {
  let variantClassName = "";

  if (variant === "line") variantClassName = "h-5";

  return (
    <motion.div
      className={twMerge(
        " h-20 bg-linear-to-r dark:from-white/23  dark:via-white/17 dark:to-white/23  from-black/23  via-black/17 to-black/23 rounded-[10px] bg-size-[200%_100%]",
        variantClassName,
        className,
      )}
      animate={{ backgroundPositionX: ["0%", "-200%"] }}
      transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
    ></motion.div>
  );
}
