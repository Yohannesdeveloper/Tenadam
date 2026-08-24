"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

const partners = [
  "Addis Ababa University", "Ethiopian Ministry of Health", "WHO Ethiopia", "UNICEF", "African Union", "Jimma University",
];

export function SocialProof() {
  const { t } = useLanguage();
  const s = t("socialProof") as Record<string, string>;

  const stats = [
    { value: "120M+", label: s.stat1Label },
    { value: "<100", label: s.stat2Label },
    { value: "4", label: s.stat3Label },
    { value: "24/7", label: s.stat4Label },
  ];

  const testimonials = [
    { quote: s.quote1, name: "Meron Tadesse", role: s.role1, avatar: "MT" },
    { quote: s.quote2, name: "Dawit Kebede", role: s.role2, avatar: "DK" },
    { quote: s.quote3, name: "Dr. Hanna Mekonnen", role: s.role3, avatar: "HM" },
  ];
  return (
    <section className="section-padding bg-tenadam-neutral-100/50 dark:bg-tenadam-neutral-800/30" aria-labelledby="social-proof-heading">
      <div className="container-wide">
        <SectionHeader
          label={s.label}
          title={s.title}
        />

        {/* Stats */}
        <div className="mb-16 grid grid-cols-2 gap-6 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <p className="font-display text-4xl font-bold gradient-text sm:text-5xl">{stat.value}</p>
              <p className="mt-2 text-sm text-tenadam-neutral-600 dark:text-tenadam-neutral-400">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <GlassCard key={t.name} delay={i * 0.1}>
              <Quote className="h-8 w-8 text-tenadam-green-300 dark:text-tenadam-green-700" aria-hidden="true" />
              <p className="mt-4 text-tenadam-neutral-700 dark:text-tenadam-neutral-300">&ldquo;{t.quote}&rdquo;</p>
              <div className="mt-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-tenadam-green-100 text-sm font-semibold text-tenadam-green-700 dark:bg-tenadam-green-900/40 dark:text-tenadam-green-300">
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="text-xs text-tenadam-neutral-500">{t.role}</p>
                </div>
              </div>
              <div className="mt-3 flex gap-0.5" aria-label="5 star rating">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-amber-400 text-amber-400" aria-hidden="true" />
                ))}
              </div>
            </GlassCard>
          ))}
        </div>

        {/* Partners */}
        <div className="mt-16 text-center">
          <p id="social-proof-heading" className="text-sm font-medium uppercase tracking-wider text-tenadam-neutral-500">
            {s.partnersTitle}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-8 sm:gap-12">
            {partners.map((partner) => (
              <span
                key={partner}
                className="text-lg font-semibold text-tenadam-neutral-400 transition-colors hover:text-tenadam-neutral-600 dark:hover:text-tenadam-neutral-300"
              >
                {partner}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
