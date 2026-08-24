"use client";

import { useTheme } from "@/hooks/useTheme";
import { useLanguage, languages } from "@/hooks/useLanguage";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, Moon, Sun, X, Leaf, Globe, ChevronDown, LogOut } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChatBot } from "@/components/ui/ChatBot";

const navAuthDict = {
  en: {
    signin: "Sign In",
    logout: "Log Out"
  },
  am: {
    signin: "ግባ",
    logout: "ውጣ"
  },
  om: {
    signin: "Seeni",
    logout: "Ba'i"
  },
  ti: {
    signin: "እቶ",
    logout: "ውጻእ"
  }
};

function LanguageSwitcher() {
  const { language, setLanguage, mounted } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  if (!mounted) return null;
  const current = languages.find((l) => l.code === language) ?? languages[0];

  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen(!open)} className="flex h-8 items-center gap-1 rounded-full px-2.5 text-xs font-medium text-tenadam-neutral-600 transition-colors hover:bg-tenadam-neutral-100 dark:text-tenadam-neutral-400 dark:hover:bg-tenadam-neutral-800" aria-label="Select language" aria-expanded={open}>
        <Globe className="h-3.5 w-3.5" aria-hidden="true" />
        <span className="hidden sm:inline">{current.nativeLabel}</span>
        <ChevronDown className={cn("h-3 w-3 transition-transform", open && "rotate-180")} aria-hidden="true" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: -4, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -4, scale: 0.95 }} transition={{ duration: 0.15 }} className="absolute right-0 top-full mt-2 w-44 overflow-hidden rounded-xl glass shadow-lg ring-1 ring-tenadam-neutral-200 dark:ring-tenadam-neutral-700">
            {languages.map((lang) => (
              <button key={lang.code} onClick={() => { setLanguage(lang.code); setOpen(false); }} className={cn("flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors", lang.code === language ? "bg-tenadam-green-50 text-tenadam-green-700 dark:bg-tenadam-green-900/30 dark:text-tenadam-green-400" : "text-tenadam-neutral-700 hover:bg-tenadam-neutral-50 dark:text-tenadam-neutral-300 dark:hover:bg-tenadam-neutral-800")}>
                <span className="font-medium">{lang.nativeLabel}</span>
                <span className="text-xs text-tenadam-neutral-400">{lang.label}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, toggleTheme, mounted } = useTheme();
  const { language, t } = useLanguage();
  const { user, logout } = useAuth();
  const router = useRouter();
  const nav = t("nav");
  const authT = navAuthDict[language] || navAuthDict.en;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { href: "#features", label: nav.features },
    { href: "#how-it-works", label: nav.howItWorks },
    { href: "#mood-tracker", label: nav.moodTracker },
    { href: "#resources", label: nav.resources },
    { href: "#pricing", label: nav.pricing },
    { href: "#faq", label: nav.faq },
  ];

  return (
    <>
    <header className={cn("fixed inset-x-0 top-0 z-50 transition-all duration-300", scrolled ? "glass py-1.5 shadow-glass dark:shadow-glass-dark" : "bg-transparent py-2.5")}>
      <nav className="container-wide flex items-center justify-between px-3 sm:px-4 lg:px-6" aria-label="Main navigation">
        <Link href="/" className="flex items-center gap-2 group" aria-label="Tenadam home">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-tenadam-green-600 text-white transition-transform group-hover:scale-105">
            <Leaf className="h-4 w-4" aria-hidden="true" />
          </div>
          <span className="font-display text-base font-bold tracking-tight">Tenadam</span>
        </Link>

        <div className="hidden items-center gap-5 lg:flex">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} onClick={(e) => { e.preventDefault(); const el = document.querySelector(link.href); if (el) el.scrollIntoView({ behavior: 'smooth' }); setMobileOpen(false); }} className="text-xs font-medium text-tenadam-neutral-600 transition-colors hover:text-tenadam-green-600 dark:text-tenadam-neutral-400 dark:hover:text-tenadam-green-400">{link.label}</Link>
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          <LanguageSwitcher />
          {mounted && (
            <button onClick={toggleTheme} className="flex h-8 w-8 items-center justify-center rounded-full text-tenadam-neutral-600 transition-colors hover:bg-tenadam-neutral-100 dark:text-tenadam-neutral-400 dark:hover:bg-tenadam-neutral-800" aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}>
              {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </button>
          )}
          {user ? (
            <div className="flex items-center gap-2">
              <Link href="/track" className="hidden sm:flex items-center gap-1.5 bg-tenadam-green-50 dark:bg-tenadam-green-950/30 text-tenadam-green-600 dark:text-tenadam-green-400 border border-tenadam-green-200/50 dark:border-tenadam-green-800/30 px-2.5 py-1 rounded-full text-xs font-bold transition-all hover:scale-105">
                <span className="h-1.5 w-1.5 rounded-full bg-tenadam-green-500 animate-pulse" />
                <span className="max-w-[80px] truncate">{user.name}</span>
              </Link>
              <button onClick={() => { logout(); router.push("/"); }} className="flex h-8 w-8 items-center justify-center rounded-full text-rose-500 transition-colors hover:bg-rose-500/10" aria-label={authT.logout} title={authT.logout}>
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <>
              <button onClick={() => router.push('/login')} className="hidden sm:inline-flex text-xs font-semibold text-tenadam-neutral-600 hover:text-tenadam-green-600 dark:text-tenadam-neutral-400 dark:hover:text-tenadam-green-400 px-2 py-1.5 transition-colors">
                {authT.signin}
              </button>
              <Button size="sm" className="hidden sm:inline-flex text-xs" onClick={() => router.push(user ? '/track' : '/login?redirect=/track')}>
                {nav.startTracking}
              </Button>
            </>
          )}
          <button className="flex h-8 w-8 items-center justify-center rounded-full lg:hidden" onClick={() => setMobileOpen(!mobileOpen)} aria-label={mobileOpen ? nav.closeMenu : nav.openMenu} aria-expanded={mobileOpen}>
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="glass border-t border-tenadam-neutral-200 dark:border-tenadam-neutral-800 lg:hidden">
            <div className="flex flex-col gap-1 px-4 py-4">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} onClick={(e) => { e.preventDefault(); const el = document.querySelector(link.href); if (el) el.scrollIntoView({ behavior: 'smooth' }); setMobileOpen(false); }} className="rounded-lg px-4 py-3 text-sm font-medium text-tenadam-neutral-700 hover:bg-tenadam-neutral-100 dark:text-tenadam-neutral-300 dark:hover:bg-tenadam-neutral-800">{link.label}</Link>
              ))}
              {user ? (
                <div className="flex flex-col gap-2 mt-2 pt-2 border-t border-tenadam-neutral-200 dark:border-tenadam-neutral-800">
                  <div className="px-4 py-2 text-xs font-semibold text-tenadam-neutral-500">
                    Logged in as: <span className="text-tenadam-green-600 dark:text-tenadam-green-400 font-bold">{user.name}</span>
                  </div>
                  <Button variant="outline" className="w-full justify-center text-rose-500 border-rose-200 hover:bg-rose-50 dark:hover:bg-rose-950/20" onClick={() => { setMobileOpen(false); logout(); router.push("/"); }}>
                    <LogOut className="h-4 w-4 mr-2" />
                    {authT.logout}
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-tenadam-neutral-200 dark:border-tenadam-neutral-800">
                  <Button variant="outline" onClick={() => { setMobileOpen(false); router.push('/login'); }}>{authT.signin}</Button>
                  <Button onClick={() => { setMobileOpen(false); router.push(user ? '/track' : '/login?redirect=/track'); }}>{nav.startTracking}</Button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
    <ChatBot />
    </>
  );
}
