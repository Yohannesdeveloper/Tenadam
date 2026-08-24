"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface SectionHeaderProps {
  label?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeader({
  label,
  title,
  description,
  align = "center",
  className,
}: SectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={cn(
        "mb-12 sm:mb-16",
        align === "center" && "mx-auto max-w-3xl text-center",
        className
      )}
    >
      {label && (
        <span className="mb-4 inline-block rounded-full bg-tenadam-green-100 px-4 py-1.5 text-sm font-medium text-tenadam-green-700 dark:bg-tenadam-green-900/40 dark:text-tenadam-green-300">
          {label}
        </span>
      )}
      <h2 className="font-display text-3xl font-bold tracking-tight text-balance sm:text-4xl lg:text-5xl">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-lg text-tenadam-neutral-600 text-balance dark:text-tenadam-neutral-400 sm:text-xl">
          {description}
        </p>
      )}
    </motion.div>
  );
}
