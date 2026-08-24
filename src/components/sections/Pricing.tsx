"use client";

import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

export function Pricing() {
  const { t } = useLanguage();
  const pr = t("pricing") as Record<string, string>;

  const plans = [
    {
      name: pr.freeName, price: pr.freePrice, period: pr.freePeriod, description: pr.freeDesc,
      features: [pr.freeF1, pr.freeF2, pr.freeF3, pr.freeF4, pr.freeF5, pr.freeF6],
      cta: pr.freeCta, popular: false,
    },
    {
      name: pr.premiumName, price: pr.premiumPrice, period: pr.premiumPeriod, description: pr.premiumDesc,
      features: [pr.premiumF1, pr.premiumF2, pr.premiumF3, pr.premiumF4, pr.premiumF5, pr.premiumF6, pr.premiumF7],
      cta: pr.premiumCta, popular: true,
    },
    {
      name: pr.instName, price: pr.instPrice, period: "", description: pr.instDesc,
      features: [pr.instF1, pr.instF2, pr.instF3, pr.instF4, pr.instF5, pr.instF6, pr.instF7],
      cta: pr.instCta, popular: false,
    },
  ];
  return (
    <section id="pricing" className="section-padding bg-tenadam-neutral-100/50 dark:bg-tenadam-neutral-800/30" aria-labelledby="pricing-heading">
      <div className="container-wide">
        <SectionHeader
          label={pr.label}
          title={pr.title}
          description={pr.description}
        />

        <div className="grid gap-8 lg:grid-cols-3">
          {plans.map((plan, i) => (
            <GlassCard
              key={plan.name}
              delay={i * 0.1}
              className={cn(
                "relative flex flex-col",
                plan.popular && "ring-2 ring-tenadam-green-500 shadow-glow"
              )}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-tenadam-green-600 px-4 py-1 text-xs font-semibold text-white">
                  {pr.mostPopular}
                </span>
              )}
              <h3 id={i === 0 ? "pricing-heading" : undefined} className="text-xl font-bold">{plan.name}</h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="font-display text-4xl font-bold">{plan.price}</span>
                {plan.period && (
                  <span className="text-tenadam-neutral-500">{plan.period}</span>
                )}
              </div>
              <p className="mt-2 text-sm text-tenadam-neutral-600 dark:text-tenadam-neutral-400">
                {plan.description}
              </p>
              <ul className="mt-6 flex-1 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-tenadam-green-500" aria-hidden="true" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button
                variant={plan.popular ? "primary" : "outline"}
                className="mt-8 w-full"
                onClick={() => document.getElementById('appointment')?.scrollIntoView({ behavior: 'smooth' })}
              >
                {plan.cta}
              </Button>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}
