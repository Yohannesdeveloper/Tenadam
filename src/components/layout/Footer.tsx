"use client";

import { useLanguage } from "@/hooks/useLanguage";
import { Leaf } from "lucide-react";
import Link from "next/link";

export function Footer() {
  const { t } = useLanguage();
  const f = t("footer");
  const nav = t("nav");

  const footerLinks = {
    [f.product]: [
      { label: nav.features, href: "#features" },
      { label: nav.howItWorks, href: "#how-it-works" },
      { label: nav.moodTracker, href: "#mood-tracker" },
      { label: nav.resources, href: "#resources" },
      { label: nav.pricing, href: "#pricing" },
    ],
    [f.company]: [
      { label: f.about, href: "#" },
      { label: f.ourMission, href: "#" },
      { label: f.press, href: "#" },
      { label: f.contact, href: "#" },
    ],
    [f.resourcesLabel]: [
      { label: f.blog, href: "#" },
      { label: f.helpCenter, href: "#" },
      { label: f.community, href: "#community" },
      { label: nav.faq, href: "#faq" },
    ],
    [f.legal]: [
      { label: f.privacy, href: "#" },
      { label: f.terms, href: "#" },
      { label: f.dataProtection, href: "#" },
      { label: f.security, href: "#" },
    ],
  };

  return (
    <footer className="border-t border-tenadam-neutral-200 bg-tenadam-neutral-50 dark:border-tenadam-neutral-800 dark:bg-tenadam-neutral-900">
      <div className="container-wide section-padding !py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-6">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2" aria-label="Tenadam home">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-tenadam-green-600 text-white">
                <Leaf className="h-5 w-5" aria-hidden="true" />
              </div>
              <span className="font-display text-xl font-bold">Tenadam</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm text-tenadam-neutral-600 dark:text-tenadam-neutral-400">{f.footerDesc}</p>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-sm font-semibold text-tenadam-neutral-900 dark:text-tenadam-neutral-100">{category}</h3>
              <ul className="mt-4 space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm text-tenadam-neutral-600 transition-colors hover:text-tenadam-green-600 dark:text-tenadam-neutral-400 dark:hover:text-tenadam-green-400">{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-tenadam-neutral-200 pt-8 dark:border-tenadam-neutral-800 sm:flex-row">
          <p className="text-sm text-tenadam-neutral-500">
            © {new Date().getFullYear()} Tenadam, Inc. {f.allRights}
          </p>
          <div className="flex gap-6">
            {["Twitter", "LinkedIn", "Instagram"].map((social) => (
              <Link key={social} href="#" className="text-sm text-tenadam-neutral-500 transition-colors hover:text-tenadam-green-600" aria-label={`${f.followOn} ${social}`}>{social}</Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
