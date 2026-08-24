"use client";

import { Button } from "@/components/ui/Button";
import { useLanguage } from "@/hooks/useLanguage";
import { useAuth } from "@/hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";
import { Play, ArrowRight, Activity, Calendar, Sparkles, TrendingUp, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export function Hero() {
  const dashboardRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();
  const { user } = useAuth();
  const router = useRouter();
  const h = t("hero");
  const [showVideoModal, setShowVideoModal] = useState(false);

  useEffect(() => {
    if (!dashboardRef.current) return;
    const ctx = gsap.context(() => {
      gsap.to(".hero-float-1", { y: -15, duration: 3, repeat: -1, yoyo: true, ease: "sine.inOut" });
      gsap.to(".hero-float-2", { y: -10, duration: 2.5, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 0.5 });
      gsap.to(".hero-float-3", { y: -12, duration: 3.5, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 1 });
      gsap.from(dashboardRef.current, { rotateX: 8, rotateY: -8, duration: 1.2, ease: "power3.out" });
    }, dashboardRef);
    return () => ctx.revert();
  }, []);

  return (
    <section className="relative min-h-screen overflow-hidden pt-28 pb-16 sm:pt-32 lg:pt-36" aria-label="Hero">
      <div className="absolute inset-0 bg-hero-gradient dark:bg-hero-gradient-dark" aria-hidden="true" />
      <div className="absolute top-1/4 -left-32 h-96 w-96 rounded-full bg-tenadam-green-400/20 blur-3xl dark:bg-tenadam-green-500/10" aria-hidden="true" />
      <div className="absolute bottom-1/4 -right-32 h-96 w-96 rounded-full bg-tenadam-blue-400/20 blur-3xl dark:bg-tenadam-blue-500/10" aria-hidden="true" />

      <div className="container-wide relative px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-6 inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-sm font-medium text-tenadam-green-700 dark:text-tenadam-green-300">
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            {h.tagline}
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }} className="font-display text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-7xl">
            {h.title} <span className="gradient-text">{h.titleAccent}</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }} className="mx-auto mt-6 max-w-2xl text-lg text-tenadam-neutral-600 text-balance dark:text-tenadam-neutral-400 sm:text-xl">
            {h.description}
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3 }} className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" onClick={() => router.push(user ? '/track' : '/login?redirect=/track')}>
              {h.startMoodTracking}
              <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </Button>
            <Button variant="outline" size="lg" onClick={() => setShowVideoModal(true)}>
              <Play className="h-5 w-5" aria-hidden="true" />
              {h.watchDemo}
            </Button>
          </motion.div>
        </div>

        {/* Video Modal */}
        <AnimatePresence>
          {showVideoModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
              onClick={() => setShowVideoModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", duration: 0.5 }}
                className="relative w-full max-w-4xl aspect-video rounded-2xl overflow-hidden shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close button */}
                <button
                  onClick={() => setShowVideoModal(false)}
                  className="absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                  aria-label="Close video"
                >
                  <X className="h-5 w-5" />
                </button>
                
                {/* YouTube Video Embed */}
                <iframe
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/2NR4_5dt7JA?autoplay=1"
                  title="Tenadam Demo"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div ref={dashboardRef} initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.5 }} className="relative mx-auto mt-16 max-w-5xl" style={{ perspective: "1200px" }}>
          <div className="glass-card overflow-hidden p-1 shadow-2xl shadow-tenadam-green-600/10 dark:shadow-tenadam-green-500/5">
            <div className="rounded-xl bg-tenadam-neutral-100 p-4 dark:bg-tenadam-neutral-800 sm:p-6">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3"><div className="h-3 w-3 rounded-full bg-red-400" /><div className="h-3 w-3 rounded-full bg-yellow-400" /><div className="h-3 w-3 rounded-full bg-green-400" /></div>
                <span className="text-xs font-medium text-tenadam-neutral-500">{h.dashboard}</span>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="hero-float-1 glass-card col-span-1 p-4 sm:col-span-1">
                  <div className="flex items-center gap-2 text-sm text-tenadam-neutral-500"><Activity className="h-4 w-4 text-tenadam-green-500" aria-hidden="true" />{h.moodScore}</div>
                  <p className="mt-2 font-display text-3xl font-bold text-tenadam-green-600 dark:text-tenadam-green-400">78</p>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-tenadam-neutral-200 dark:bg-tenadam-neutral-700"><div className="h-full w-[78%] rounded-full bg-gradient-to-r from-tenadam-green-500 to-tenadam-blue-500" /></div>
                </div>
                <div className="hero-float-2 glass-card p-4">
                  <div className="flex items-center gap-2 text-sm text-tenadam-neutral-500"><Calendar className="h-4 w-4 text-tenadam-blue-500" aria-hidden="true" />{h.breathingExercise}</div>
                  <p className="mt-2 text-sm font-semibold">{h.calmBreathing}</p>
                  <p className="text-xs text-tenadam-neutral-500">{h.multiLangGuided}</p>
                </div>
                <div className="hero-float-3 glass-card p-4">
                  <div className="flex items-center gap-2 text-sm text-tenadam-neutral-500"><Sparkles className="h-4 w-4 text-tenadam-green-500" aria-hidden="true" />{h.aiCbtTip}</div>
                  <p className="mt-2 text-sm">{h.cbtTipText}</p>
                </div>
              </div>
              <div className="mt-4 glass-card p-4">
                <div className="flex items-center justify-between"><span className="text-sm font-medium">{h.weeklyProgress}</span><TrendingUp className="h-4 w-4 text-tenadam-green-500" aria-hidden="true" /></div>
                <div className="mt-4 flex items-end gap-2 h-24">
                  {[40, 65, 55, 80, 70, 90, 85].map((val, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <div className="w-full rounded-t-md bg-gradient-to-t from-tenadam-green-600 to-tenadam-green-400 transition-all" style={{ height: `${val}%` }} />
                      <span className="text-[10px] text-tenadam-neutral-400">{["M", "T", "W", "T", "F", "S", "S"][i]}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
