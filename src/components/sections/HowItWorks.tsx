"use client";

import { SectionHeader } from "@/components/ui/SectionHeader";
import { useLanguage } from "@/hooks/useLanguage";
import { motion } from "framer-motion";
import { Search, CalendarCheck, TrendingUp, Heart } from "lucide-react";

export function HowItWorks() {
  const { t } = useLanguage();
  const hw = t("howItWorks");

  const steps = [
    { icon: Search, step: "01", title: hw.step1Title, description: hw.step1Desc, color: "from-tenadam-green-400 to-tenadam-green-600", bgColor: "bg-tenadam-green-50 dark:bg-tenadam-green-900/20" },
    { icon: CalendarCheck, step: "02", title: hw.step2Title, description: hw.step2Desc, color: "from-tenadam-blue-400 to-tenadam-blue-600", bgColor: "bg-tenadam-blue-50 dark:bg-tenadam-blue-900/20" },
    { icon: TrendingUp, step: "03", title: hw.step3Title, description: hw.step3Desc, color: "from-purple-400 to-indigo-600", bgColor: "bg-purple-50 dark:bg-purple-900/20" },
    { icon: Heart, step: "04", title: hw.step4Title, description: hw.step4Desc, color: "from-rose-400 to-pink-600", bgColor: "bg-rose-50 dark:bg-rose-900/20" },
  ];

  return (
    <section id="how-it-works" className="section-padding bg-tenadam-neutral-100/50 dark:bg-tenadam-neutral-800/30" aria-labelledby="how-it-works-heading">
      <div className="container-wide">
        <SectionHeader label={hw.label} title={hw.title} description={hw.description} />
        <div className="relative">
          <div className="absolute left-8 top-12 bottom-12 hidden w-0.5 bg-gradient-to-b from-tenadam-green-400 via-tenadam-blue-400 to-rose-400 lg:left-1/2 lg:block lg:-translate-x-0.5" aria-hidden="true" />
          <div className="space-y-12 lg:space-y-16">
            {steps.map((step, i) => (
              <motion.div key={step.step} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.6, delay: i * 0.1 }} className={`relative flex flex-col gap-6 lg:flex-row lg:items-center ${i % 2 === 1 ? "lg:flex-row-reverse" : ""}`}>
                <div className={`flex-1 ${i % 2 === 1 ? "lg:text-right" : ""}`}>
                  <div className={`glass-card p-6 sm:p-8 ${i % 2 === 1 ? "lg:ml-auto" : ""} max-w-lg`}>
                    <div className={`mb-4 inline-flex items-center gap-3 ${i % 2 === 1 ? "lg:flex-row-reverse" : ""}`}>
                      <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${step.bgColor}`}><step.icon className="h-6 w-6" /></div>
                      <span className={`bg-gradient-to-r ${step.color} bg-clip-text text-4xl font-black text-transparent`}>{step.step}</span>
                    </div>
                    <h3 id={i === 0 ? "how-it-works-heading" : undefined} className="text-xl font-bold">{step.title}</h3>
                    <p className="mt-2 text-tenadam-neutral-600 dark:text-tenadam-neutral-400">{step.description}</p>
                  </div>
                </div>
                <div className="absolute left-8 hidden lg:left-1/2 lg:flex lg:-translate-x-1/2">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br ${step.color} text-white shadow-lg`}><step.icon className="h-5 w-5" /></div>
                </div>
                <div className="hidden flex-1 lg:block" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
