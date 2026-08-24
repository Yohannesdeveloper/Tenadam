"use client";

import { SectionHeader } from "@/components/ui/SectionHeader";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Moon, Heart, Brain, BookOpen, Wind, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";

export function Personalization() {
  const { t } = useLanguage();
  const p = t("personalization") as Record<string, string | string[]>;

  const goals = [
    { id: "anxiety", label: p.manageAnxiety as string, icon: Heart, color: "from-rose-500 to-pink-500", planTitle: p.anxietyTitle as string, items: p.anxItems as string[] },
    { id: "stress", label: p.reduceStress as string, icon: Wind, color: "from-teal-500 to-cyan-500", planTitle: p.stressTitle as string, items: p.stressItems as string[] },
    { id: "depression", label: p.liftMood as string, icon: Brain, color: "from-purple-500 to-indigo-500", planTitle: p.depressionTitle as string, items: p.deprItems as string[] },
    { id: "sleep", label: p.betterSleep as string, icon: Moon, color: "from-indigo-500 to-blue-500", planTitle: p.sleepTitle as string, items: p.sleepItems as string[] },
    { id: "exam-stress", label: p.examStress as string, icon: BookOpen, color: "from-amber-500 to-orange-500", planTitle: p.examTitle as string, items: p.examItems as string[] },
  ];

  const [selected, setSelected] = useState(goals[0]);

  return (
    <section id="personalization" className="section-padding" aria-labelledby="personalization-heading">
      <div className="container-wide">
        <SectionHeader
          label={p.label as string}
          title={p.title as string}
          description={p.description as string}
        />

        <div className="flex flex-wrap justify-center gap-3">
          {goals.map((goal) => (
            <button
              key={goal.id}
              onClick={() => setSelected(goal)}
              className={cn(
                "flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all",
                selected.id === goal.id
                  ? "bg-tenadam-green-600 text-white shadow-lg shadow-tenadam-green-600/25"
                  : "glass text-tenadam-neutral-700 hover:bg-tenadam-neutral-100 dark:text-tenadam-neutral-300 dark:hover:bg-tenadam-neutral-800"
              )}
              aria-pressed={selected.id === goal.id}
            >
              <goal.icon className="h-4 w-4" aria-hidden="true" />
              {goal.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={selected.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="mx-auto mt-12 max-w-2xl"
          >
            <div className="glass-card overflow-hidden">
              <div className={cn("h-2 bg-gradient-to-r", selected.color)} aria-hidden="true" />
              <div className="p-8">
                <h3 id="personalization-heading" className="text-2xl font-bold">{selected.planTitle}</h3>
                <p className="mt-2 text-tenadam-neutral-600 dark:text-tenadam-neutral-400">
                  {p.generatedBasedOn as string} <strong>{selected.label}</strong> {p.goal as string}
                </p>
                <ul className="mt-6 space-y-4">
                  {selected.items.map((item, i) => (
                    <motion.li
                      key={item}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.08 }}
                      className="flex items-start gap-3"
                    >
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-tenadam-green-500" aria-hidden="true" />
                      <span>{item}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
