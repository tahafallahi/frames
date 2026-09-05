import clsx from "clsx";
import { motion } from "motion/react";

export default function Skeleton({ className }: { className?: string }) {
  return (
    <motion.div
      className={clsx(
        className,
        "h-10 bg-linear-to-r from-white/23 via-white/17 to-white/23 rounded-[10px] bg-size-[200%_100%]",
      )}
      animate={{ backgroundPositionX: ["0%", "-200%"] }}
      transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
    ></motion.div>
  );
}
