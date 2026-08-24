"use client";

import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { cn } from "@/lib/utils";
import { Star, MapPin, Clock, Filter, Search } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";

export function Marketplace() {
  const { t } = useLanguage();
  const m = t("marketplace") as Record<string, string>;

  const categories = [m.all, m.therapy, m.cbt, m.breathingCat, m.supportGroups, m.selfHelp];

  const providers = [
    { name: m.provider1, type: m.therapy, rating: 4.9, reviews: 342, location: m.provider1Loc, price: "Free", duration: m.duration50, available: m.provider1Avail, image: "from-teal-400 to-emerald-500" },
    { name: m.provider2, type: m.cbt, rating: 4.8, reviews: 218, location: m.provider2Loc, price: "Free", duration: m.duration6wk, available: m.provider2Avail, image: "from-purple-400 to-indigo-500" },
    { name: m.provider3, type: m.breathingCat, rating: 5.0, reviews: 156, location: m.provider3Loc, price: "Free", duration: m.duration15, available: m.provider3Avail, image: "from-rose-400 to-pink-500" },
    { name: m.provider4, type: m.supportGroups, rating: 4.7, reviews: 89, location: m.provider4Loc, price: "Free", duration: m.duration60, available: m.provider4Avail, image: "from-amber-400 to-orange-500" },
    { name: m.provider5, type: m.selfHelp, rating: 4.9, reviews: 67, location: m.provider5Loc, price: "Free", duration: m.duration4wk, available: m.provider5Avail, image: "from-green-400 to-teal-500" },
    { name: m.provider6, type: m.supportGroups, rating: 4.6, reviews: 412, location: m.provider6Loc, price: "Free", duration: m.duration90, available: m.provider6Avail, image: "from-blue-400 to-cyan-500" },
  ];
  const [activeCategory, setActiveCategory] = useState(m.all);
  const filtered =
    activeCategory === m.all
      ? providers
      : providers.filter((p) => p.type === activeCategory);

  return (
    <section id="resources" className="section-padding" aria-labelledby="marketplace-heading">
      <div className="container-wide">
        <SectionHeader
          label={m.label}
          title={m.title}
          description={m.description}
        />

        {/* Search & Filter Bar */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-tenadam-neutral-400" aria-hidden="true" />
            <input
              type="search"
              placeholder={m.searchPlaceholder}
              className="w-full rounded-full border border-tenadam-neutral-200 bg-white py-3 pl-12 pr-4 text-sm outline-none transition-colors focus:border-tenadam-green-500 focus:ring-2 focus:ring-tenadam-green-500/20 dark:border-tenadam-neutral-700 dark:bg-tenadam-neutral-800"
              aria-label={m.searchLabel}
            />
          </div>
          <button className="flex items-center gap-2 rounded-full glass px-5 py-3 text-sm font-medium">
            <Filter className="h-4 w-4" aria-hidden="true" />
            {m.filters}
          </button>
        </div>

        {/* Category Pills */}
        <div className="mb-8 flex flex-wrap gap-2" role="tablist" aria-label="Provider categories">
          {categories.map((cat) => (
            <button
              key={cat}
              role="tab"
              aria-selected={activeCategory === cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium transition-all",
                activeCategory === cat
                  ? "bg-tenadam-green-600 text-white"
                  : "glass text-tenadam-neutral-600 hover:bg-tenadam-neutral-100 dark:text-tenadam-neutral-400"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Provider Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((provider, i) => (
            <GlassCard key={provider.name} hover delay={i * 0.08}>
              <div className={cn("h-36 rounded-xl bg-gradient-to-br", provider.image)} aria-hidden="true" />
              <div className="mt-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold">{provider.name}</h3>
                    <span className="text-xs text-tenadam-neutral-500">{provider.type}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" aria-hidden="true" />
                    <span className="font-medium">{provider.rating}</span>
                    <span className="text-tenadam-neutral-400">({provider.reviews})</span>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-4 text-sm text-tenadam-neutral-500">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                    {provider.location}
                  </span>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <div>
                    <span className="text-lg font-bold">{provider.price}</span>
                    <span className="text-sm text-tenadam-neutral-500"> / {provider.duration}</span>
                  </div>
                  <span className="flex items-center gap-1 text-xs text-tenadam-green-600 dark:text-tenadam-green-400">
                    <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                    {provider.available}
                  </span>
                </div>
                <Button size="sm" className="mt-4 w-full" onClick={() => document.getElementById('appointment')?.scrollIntoView({ behavior: 'smooth' })}>
                  {m.bookSession}
                </Button>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}
