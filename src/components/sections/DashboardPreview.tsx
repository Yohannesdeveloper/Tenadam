"use client";

import { SectionHeader } from "@/components/ui/SectionHeader";
import { motion } from "framer-motion";
import {
  Activity,
  CheckCircle,
  Calendar,
  Sparkles,
  TrendingUp,
  Heart,
  Moon,
  Footprints,
} from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

export function DashboardPreview() {
  const { t } = useLanguage();
  const d = t("dashboard") as Record<string, string>;

  const habits = [
    { label: d.morningCheckin, done: true },
    { label: d.breathingEx5, done: true },
    { label: d.journalPrompt, done: false },
    { label: d.cbtChallenge, done: true },
  ];

  const recommendations = [d.rec1, d.rec2, d.rec3];
  return (
    <section id="mood-tracker" className="section-padding bg-tenadam-neutral-100/50 dark:bg-tenadam-neutral-800/30" aria-labelledby="dashboard-heading">
      <div className="container-wide">
        <SectionHeader
          label={d.label}
          title={d.title}
          description={d.description}
        />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="glass-card overflow-hidden"
        >
          <div className="grid lg:grid-cols-12">
            {/* Sidebar metrics */}
            <div className="border-b border-tenadam-neutral-200 p-6 dark:border-tenadam-neutral-700 lg:col-span-3 lg:border-b-0 lg:border-r">
              <h3 id="dashboard-heading" className="text-sm font-semibold uppercase tracking-wider text-tenadam-neutral-500">
                {d.moodScore}
              </h3>
              <div className="mt-4 flex items-end gap-2">
                <span className="font-display text-5xl font-bold text-tenadam-green-600 dark:text-tenadam-green-400">87</span>
                <span className="mb-2 text-sm text-tenadam-green-500">{d.thisWeek}</span>
              </div>
              <div className="mt-6 space-y-4">
                {[
                  { icon: Heart, label: d.emotionalHealth, value: 75, color: "bg-rose-500" },
                  { icon: Footprints, label: d.dailyHabits, value: 82, color: "bg-orange-500" },
                  { icon: Moon, label: d.sleepQuality, value: 68, color: "bg-indigo-500" },
                  { icon: Activity, label: d.stressLevel, value: 72, color: "bg-green-500" },
                ].map((metric) => (
                  <div key={metric.label}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 text-tenadam-neutral-600 dark:text-tenadam-neutral-400">
                        <metric.icon className="h-4 w-4" aria-hidden="true" />
                        {metric.label}
                      </span>
                      <span className="font-medium">{metric.value}%</span>
                    </div>
                    <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-tenadam-neutral-200 dark:bg-tenadam-neutral-700">
                      <div className={`h-full rounded-full ${metric.color}`} style={{ width: `${metric.value}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Main content */}
            <div className="p-6 lg:col-span-6">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{d.moodThisWeek}</h3>
                <TrendingUp className="h-5 w-5 text-tenadam-green-500" aria-hidden="true" />
              </div>
              <div className="mt-6 flex h-40 items-end gap-3">
                {[55, 70, 60, 85, 75, 92, 88].map((h, i) => (
                  <div key={i} className="flex flex-1 flex-col items-center gap-2">
                    <motion.div
                      initial={{ height: 0 }}
                      whileInView={{ height: `${h}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: i * 0.05 }}
                      className="w-full rounded-t-lg bg-gradient-to-t from-tenadam-green-600 to-tenadam-green-400"
                    />
                    <span className="text-xs text-tenadam-neutral-400">
                      {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i]}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <h3 className="font-semibold">{d.todaysPractices}</h3>
                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  {habits.map((habit) => (
                    <div
                      key={habit.label}
                      className="flex items-center gap-3 rounded-xl bg-tenadam-neutral-50 p-3 dark:bg-tenadam-neutral-800/50"
                    >
                      <CheckCircle
                        className={`h-5 w-5 ${habit.done ? "text-tenadam-green-500" : "text-tenadam-neutral-300 dark:text-tenadam-neutral-600"}`}
                        aria-hidden="true"
                      />
                      <span className={habit.done ? "" : "text-tenadam-neutral-400"}>{habit.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right panel */}
            <div className="border-t border-tenadam-neutral-200 p-6 dark:border-tenadam-neutral-700 lg:col-span-3 lg:border-t-0 lg:border-l">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Calendar className="h-4 w-4 text-tenadam-blue-500" aria-hidden="true" />
                {d.upcomingSessions}
              </div>
              <div className="mt-4 space-y-3">
                {[
                  { time: "10:00 AM", title: d.guidedBreathingSession, provider: d.anonymousGroup === "Anonymous group" ? "Amharic session" : d.anonymousGroup },
                  { time: "2:30 PM", title: d.cbtExercise, provider: "Dr. Abebe" },
                  { time: "7:00 PM", title: d.peerSupport, provider: d.anonymousGroup },
                ].map((booking) => (
                  <div key={booking.title} className="rounded-xl bg-tenadam-neutral-50 p-3 dark:bg-tenadam-neutral-800/50">
                    <p className="text-xs text-tenadam-blue-500">{booking.time}</p>
                    <p className="text-sm font-medium">{booking.title}</p>
                    <p className="text-xs text-tenadam-neutral-500">{booking.provider}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <Sparkles className="h-4 w-4 text-tenadam-green-500" aria-hidden="true" />
                  {d.aiRecommendations}
                </div>
                <ul className="mt-3 space-y-2">
                  {recommendations.map((rec) => (
                    <li key={rec} className="text-sm text-tenadam-neutral-600 dark:text-tenadam-neutral-400">
                      • {rec}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
