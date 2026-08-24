"use client";

import { SectionHeader } from "@/components/ui/SectionHeader";
import { motion } from "framer-motion";
import { X, Check, Smartphone, Layers } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

export function ProblemSolution() {
  const { t } = useLanguage();
  const ps = t("problemSolution") as Record<string, string>;

  const beforeItems = [ps.before1, ps.before2, ps.before3, ps.before4, ps.before5];
  const afterItems = [ps.after1, ps.after2, ps.after3, ps.after4, ps.after5];

  return (
    <section className="section-padding bg-tenadam-neutral-100/50 dark:bg-tenadam-neutral-800/30" aria-labelledby="problem-heading">
      <div className="container-wide">
        <SectionHeader
          label={ps.theProblem}
          title={ps.title}
          description={ps.description}
        />

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Before */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass-card relative overflow-hidden p-8"
          >
            <div className="absolute top-4 right-4 rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-600 dark:bg-red-900/30 dark:text-red-400">
              {ps.before}
            </div>
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100 dark:bg-red-900/30">
              <Smartphone className="h-7 w-7 text-red-500" aria-hidden="true" />
            </div>
            <h3 id="problem-heading" className="text-2xl font-bold">{ps.barriersTitle}</h3>
            <ul className="mt-6 space-y-4">
              {beforeItems.map((item) => (
                <li key={item} className="flex items-start gap-3 text-tenadam-neutral-600 dark:text-tenadam-neutral-400">
                  <X className="mt-0.5 h-5 w-5 shrink-0 text-red-400" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* After */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass-card relative overflow-hidden border-tenadam-green-200 p-8 dark:border-tenadam-green-800"
          >
            <div className="absolute top-4 right-4 rounded-full bg-tenadam-green-100 px-3 py-1 text-xs font-semibold text-tenadam-green-700 dark:bg-tenadam-green-900/40 dark:text-tenadam-green-300">
              {ps.afterTenadam}
            </div>
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-tenadam-green-100 dark:bg-tenadam-green-900/30">
              <Layers className="h-7 w-7 text-tenadam-green-600" aria-hidden="true" />
            </div>
            <h3 className="text-2xl font-bold">{ps.companionTitle}</h3>
            <ul className="mt-6 space-y-4">
              {afterItems.map((item) => (
                <li key={item} className="flex items-start gap-3 text-tenadam-neutral-700 dark:text-tenadam-neutral-300">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-tenadam-green-500" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
