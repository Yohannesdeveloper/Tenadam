"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { useLanguage } from "@/hooks/useLanguage";
import { Brain, Languages, Wind, LineChart, Users } from "lucide-react";

export function Features() {
  const { t } = useLanguage();
  const f = t("features");

  const features = [
    { icon: Brain, title: f.aiCbtTitle, description: f.aiCbtDesc, color: "text-tenadam-green-500", bg: "bg-tenadam-green-100 dark:bg-tenadam-green-900/30" },
    { icon: Languages, title: f.langTitle, description: f.langDesc, color: "text-tenadam-blue-500", bg: "bg-tenadam-blue-100 dark:bg-tenadam-blue-900/30" },
    { icon: Wind, title: f.breathingTitle, description: f.breathingDesc, color: "text-tenadam-green-600", bg: "bg-tenadam-green-100 dark:bg-tenadam-green-900/30" },
    { icon: LineChart, title: f.moodTitle, description: f.moodDesc, color: "text-tenadam-blue-600", bg: "bg-tenadam-blue-100 dark:bg-tenadam-blue-900/30" },
    { icon: Users, title: f.peerTitle, description: f.peerDesc, color: "text-tenadam-green-500", bg: "bg-tenadam-green-100 dark:bg-tenadam-green-900/30" },
  ];

  return (
    <section id="features" className="section-padding" aria-labelledby="features-heading">
      <div className="container-wide">
        <SectionHeader label={f.label} title={f.title} description={f.description} />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <GlassCard key={i} hover delay={i * 0.1} className={i === 4 ? "sm:col-span-2 lg:col-span-1" : ""}>
              <div className={`mb-4 inline-flex rounded-xl p-3 ${feature.bg}`}>
                <feature.icon className={`h-6 w-6 ${feature.color}`} aria-hidden="true" />
              </div>
              <h3 id={i === 0 ? "features-heading" : undefined} className="text-xl font-semibold">{feature.title}</h3>
              <p className="mt-2 text-tenadam-neutral-600 dark:text-tenadam-neutral-400">{feature.description}</p>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}
