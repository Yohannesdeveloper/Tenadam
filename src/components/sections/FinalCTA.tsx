"use client";

import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

export function FinalCTA() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const router = useRouter();
  const fc = t("finalCta") as Record<string, string>;
  return (
    <section className="section-padding" aria-labelledby="final-cta-heading">
      <div className="container-wide px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-tenadam-green-600 via-tenadam-green-500 to-tenadam-blue-500 px-8 py-16 text-center text-white sm:px-16 sm:py-20"
        >
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" aria-hidden="true" />
          <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-white/10 blur-3xl" aria-hidden="true" />
          <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-white/10 blur-3xl" aria-hidden="true" />

          <div className="relative">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-medium backdrop-blur-sm">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              {fc.tagline}
            </div>

            <h2 id="final-cta-heading" className="font-display text-3xl font-bold tracking-tight text-balance sm:text-4xl lg:text-5xl">
              {fc.title}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-white/80">
              {fc.description}
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                size="lg"
                className="bg-white text-tenadam-green-700 hover:bg-tenadam-neutral-100 shadow-xl"
                onClick={() => router.push(user ? '/track' : '/login?redirect=/track')}
              >
                {fc.startMoodTracking}
                <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/40 text-white hover:bg-white/10 hover:border-white"
                onClick={() => document.getElementById('appointment')?.scrollIntoView({ behavior: 'smooth' })}
              >
                {fc.bookSession}
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
