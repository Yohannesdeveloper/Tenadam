"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Users, Trophy, Calendar, MessageCircle, Flame, Medal } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

export function Community() {
  const { t } = useLanguage();
  const c = t("community") as Record<string, string>;

  const groups = [
    { name: c.anxietyCircle, members: 1240, active: true },
    { name: c.studentNetwork, members: 3890, active: true },
    { name: c.healthcareSupport, members: 876, active: false },
    { name: c.stressFreeGroup, members: 2100, active: true },
  ];

  const events = [
    { title: c.breathingWorkshop, date: "Jun 8", attendees: 45 },
    { title: c.awarenessTalk, date: "Jun 12", attendees: 120 },
    { title: c.healingCircle, date: "Jun 15", attendees: 230 },
  ];

  const leaderboard = [
    { rank: 1, name: "Meron T.", points: 2840, badge: "gold" },
    { rank: 2, name: "Dawit K.", points: 2650, badge: "silver" },
    { rank: 3, name: "Hanna M.", points: 2420, badge: "bronze" },
    { rank: 4, name: "Samuel A.", points: 2180, badge: null },
    { rank: 5, name: c.you, points: 1950, badge: null, highlight: true },
  ];
  return (
    <section id="community" className="section-padding" aria-labelledby="community-heading">
      <div className="container-wide">
        <SectionHeader
          label={c.label}
          title={c.title}
          description={c.description}
        />

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Groups */}
          <GlassCard>
            <div className="flex items-center gap-2 text-lg font-semibold">
              <Users className="h-5 w-5 text-tenadam-green-500" aria-hidden="true" />
              {c.wellnessGroups}
            </div>
            <ul className="mt-4 space-y-3">
              {groups.map((group) => (
                <li
                  key={group.name}
                  className="flex items-center justify-between rounded-xl bg-tenadam-neutral-50 p-3 dark:bg-tenadam-neutral-800/50"
                >
                  <div>
                    <p className="text-sm font-medium">{group.name}</p>
                    <p className="text-xs text-tenadam-neutral-500">{group.members.toLocaleString()} {c.members}</p>
                  </div>
                  {group.active && (
                    <span className="flex items-center gap-1 rounded-full bg-tenadam-green-100 px-2 py-0.5 text-xs font-medium text-tenadam-green-700 dark:bg-tenadam-green-900/40 dark:text-tenadam-green-300">
                      <span className="h-1.5 w-1.5 rounded-full bg-tenadam-green-500" aria-hidden="true" />
                      {c.active}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </GlassCard>

          {/* Events & Challenges */}
          <GlassCard delay={0.1}>
            <div className="flex items-center gap-2 text-lg font-semibold">
              <Calendar className="h-5 w-5 text-tenadam-blue-500" aria-hidden="true" />
              {c.upcomingEvents}
            </div>
            <ul className="mt-4 space-y-3">
              {events.map((event) => (
                <li
                  key={event.title}
                  className="rounded-xl bg-tenadam-neutral-50 p-3 dark:bg-tenadam-neutral-800/50"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{event.title}</p>
                    <span className="rounded-full bg-tenadam-blue-100 px-2 py-0.5 text-xs font-medium text-tenadam-blue-700 dark:bg-tenadam-blue-900/40 dark:text-tenadam-blue-300">
                      {event.date}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-tenadam-neutral-500">{event.attendees} {c.attending}</p>
                </li>
              ))}
            </ul>

            <div className="mt-6 flex items-center gap-2 text-lg font-semibold">
              <Flame className="h-5 w-5 text-orange-500" aria-hidden="true" />
              {c.activeChallenge}
            </div>
            <div className="mt-3 rounded-xl bg-gradient-to-r from-orange-50 to-amber-50 p-4 dark:from-orange-900/20 dark:to-amber-900/20">
              <p className="font-medium">{c.mindfulnessChallenge}</p>
              <p className="mt-1 text-sm text-tenadam-neutral-600 dark:text-tenadam-neutral-400">
                {c.dayOfTotal}
              </p>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-tenadam-neutral-200 dark:bg-tenadam-neutral-700">
                <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-orange-500 to-amber-500" />
              </div>
            </div>
          </GlassCard>

          {/* Leaderboard */}
          <GlassCard delay={0.2}>
            <div className="flex items-center gap-2 text-lg font-semibold">
              <Trophy className="h-5 w-5 text-amber-500" aria-hidden="true" />
              {c.leaderboard}
            </div>
            <ul className="mt-4 space-y-2">
              {leaderboard.map((entry) => (
                <li
                  key={entry.name}
                  className={`flex items-center gap-3 rounded-xl p-3 ${
                    entry.highlight
                      ? "bg-tenadam-green-50 ring-2 ring-tenadam-green-200 dark:bg-tenadam-green-900/20 dark:ring-tenadam-green-800"
                      : "bg-tenadam-neutral-50 dark:bg-tenadam-neutral-800/50"
                  }`}
                >
                  <span className="flex h-7 w-7 items-center justify-center text-sm font-bold text-tenadam-neutral-400">
                    {entry.badge === "gold" ? <Medal className="h-5 w-5 text-amber-400" /> :
                     entry.badge === "silver" ? <Medal className="h-5 w-5 text-gray-400" /> :
                     entry.badge === "bronze" ? <Medal className="h-5 w-5 text-amber-700" /> :
                     `#${entry.rank}`}
                  </span>
                  <span className="flex-1 text-sm font-medium">{entry.name}</span>
                  <span className="text-sm font-semibold text-tenadam-green-600 dark:text-tenadam-green-400">
                    {entry.points.toLocaleString()} {c.pts}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-4 flex items-center gap-2 text-sm text-tenadam-neutral-500">
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              {c.messagesToday}
            </div>
          </GlassCard>
        </div>
      </div>
    </section>
  );
}
