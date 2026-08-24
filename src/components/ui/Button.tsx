"use client";

import { cn } from "@/lib/utils";
import { motion, type HTMLMotionProps } from "framer-motion";
import { forwardRef } from "react";

interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: "primary" | "secondary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
}

const variants = {
  primary:
    "bg-tenadam-green-600 text-white hover:bg-tenadam-green-700 shadow-lg shadow-tenadam-green-600/25 dark:bg-tenadam-green-500 dark:hover:bg-tenadam-green-400 dark:text-tenadam-green-950",
  secondary:
    "bg-tenadam-neutral-100 text-tenadam-neutral-900 hover:bg-tenadam-neutral-200 dark:bg-tenadam-neutral-800 dark:text-tenadam-neutral-50 dark:hover:bg-tenadam-neutral-700",
  ghost:
    "bg-transparent text-tenadam-neutral-700 hover:bg-tenadam-neutral-100 dark:text-tenadam-neutral-300 dark:hover:bg-tenadam-neutral-800",
  outline:
    "border-2 border-tenadam-neutral-200 bg-transparent text-tenadam-neutral-900 hover:border-tenadam-green-500 hover:text-tenadam-green-600 dark:border-tenadam-neutral-700 dark:text-tenadam-neutral-50 dark:hover:border-tenadam-green-400",
};

const sizes = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-8 py-4 text-lg",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => (
    <motion.button
      ref={ref}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tenadam-green-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-tenadam-neutral-900",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  )
);

Button.displayName = "Button";
