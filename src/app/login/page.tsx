"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";
import { useRouter, useSearchParams } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Providers } from "@/components/Providers";
import { Button } from "@/components/ui/Button";
import { motion, AnimatePresence } from "framer-motion";
import { Leaf, Lock, Mail, User, ArrowRight, ShieldCheck } from "lucide-react";

const authDict = {
  en: {
    signin: "Sign In",
    signup: "Sign Up",
    welcomeBack: "Welcome Back",
    welcomeBackDesc: "Continue your journey to mental and physical well-being.",
    createAccount: "Create Account",
    createAccountDesc: "Join Tenadam to start tracking your daily balance.",
    email: "Email Address",
    password: "Password",
    fullName: "Full Name",
    haveAccount: "Already have an account?",
    needAccount: "Don't have an account?",
    loggingIn: "Signing in...",
    signingUp: "Creating account...",
    errorGeneric: "Please enter a valid email and password.",
    successLogin: "Logged in successfully!",
    successSignup: "Registered and logged in successfully!",
  },
  am: {
    signin: "ግባ",
    signup: "ተመዝገብ",
    welcomeBack: "እንኳን ደህና መጡ",
    welcomeBackDesc: "ወደ አእምሮ እና አካል ደህንነት ጉዞዎ ይቀጥሉ።",
    createAccount: "አካውንት ይፍጠሩ",
    createAccountDesc: "ዕለታዊ ሚዛንዎን መከታተል ለመጀመር Tenadam ን ይቀላቀሉ።",
    email: "ኢሜይል አድራሻ",
    password: "የይለፍ ቃል",
    fullName: "ሙሉ ስም",
    haveAccount: "አካውንት አለዎት?",
    needAccount: "አካውንት የለዎትም?",
    loggingIn: "በመግባት ላይ...",
    signingUp: "አካውንት በመፍጠር ላይ...",
    errorGeneric: "እባክዎ ትክክለኛ ኢሜይል እና የይለፍ ቃል ያስገቡ።",
    successLogin: "በስኬት ገብተዋል!",
    successSignup: "ምዝገባው ተጠናቆ በስኬት ገብተዋል!",
  },
  om: {
    signin: "Seeni",
    signup: "Galmaahi",
    welcomeBack: "Baga Nagaan Deebite",
    welcomeBackDesc: "Gara jireenya fayyadummaa sammuu fi qaama keetiitti deebi'i.",
    createAccount: "Hisaaba Uumi",
    createAccountDesc: "Madaallii guyyaa keetii hordofuuf Tenadamitti makami.",
    email: "Teessoo Imeelii",
    password: "Jecha Iccitii",
    fullName: "Maqaa Guutuu",
    haveAccount: "Duraan hisaaba qabdaa?",
    needAccount: "Hisaaba hin qabduu?",
    loggingIn: "Seenamaa jira...",
    signingUp: "Hisaabni uumamaa jira...",
    errorGeneric: "Maaloo imeelii fi jecha iccitii sirrii galchi.",
    successLogin: "Milkaa'inaan seenteetta!",
    successSignup: "Galmeen milkaa'eera, seenteetta!",
  },
  ti: {
    signin: "እቶ",
    signup: "ተመዝገብ",
    welcomeBack: "እንኳን ደሓን መጻእኩም",
    welcomeBackDesc: "ናብ ናይ ኣእምሮን ኣካልን ደህንነት ጕዕዞኹም ቀጽሉ።",
    createAccount: "ኣካውንት ፍጠሩ",
    createAccountDesc: "ናይ መዓልታዊ ሚዛንኩም ንምክትታል Tenadam ተጸንበሩ።",
    email: "ኢሜይል ኣድራሻ",
    password: "ቃለ-መሕለፊ",
    fullName: "ምሉእ ስም",
    haveAccount: "ኣካውንት ኣለኩምዶ?",
    needAccount: "ኣካውንት የብልኩምንዶ?",
    loggingIn: "በምእታው ላይ...",
    signingUp: "ኣካውንት ብምፍጣር ላይ...",
    errorGeneric: "በጃኹም ትክክለኛ ኢሜይልን ቃለ-መሕለፊን የእትዉ።",
    successLogin: "ብዓወት ኣትዮም ኣለዉ!",
    successSignup: "ምዝገባ ተዛዚሙ ብዓወት ኣትዮም ኣለዉ!",
  }
};

export default function LoginPage() {
  return (
    <Providers>
      <Navbar />
      <Suspense>
        <LoginContent />
      </Suspense>
      <Footer />
    </Providers>
  );
}

function LoginContent() {
  const { language } = useLanguage();
  const { user, login, signup, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/track";

  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const t = (key: keyof typeof authDict.en): string => {
    return authDict[language]?.[key] || authDict.en[key];
  };

  // Redirect if already logged in
  useEffect(() => {
    if (user && !loading && !authLoading) {
      router.push(redirect);
    }
  }, [user, router, redirect, loading, authLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email.trim() || !password.trim() || (isSignUp && !name.trim())) {
      setError(t("errorGeneric"));
      return;
    }

    if (password.length < 4) {
      setError(language === "am" ? "የይለፍ ቃል ቢያንስ 4 ፊደላት መሆን አለበት።" : "Password must be at least 4 characters.");
      return;
    }

    setLoading(true);
    try {
      if (isSignUp) {
        const result = await signup(email, password, name);
        if (result.success) {
          setSuccess(t("successSignup"));
          setTimeout(() => router.push(redirect), 1000);
        } else {
          setError(result.error || t("errorGeneric"));
        }
      } else {
        const result = await login(email, password);
        if (result.success) {
          setSuccess(t("successLogin"));
          setTimeout(() => router.push(redirect), 1000);
        } else {
          setError(result.error || t("errorGeneric"));
        }
      }
    } catch {
      setError(t("errorGeneric"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen pt-28 pb-16 flex flex-col justify-center items-center bg-gradient-radial from-tenadam-green-50/20 via-transparent to-transparent dark:from-tenadam-green-900/10">
      <div className="w-full max-w-md px-4">
        
        {/* Logo and header */}
        <div className="flex flex-col items-center mb-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex h-12 w-12 items-center justify-center rounded-2xl bg-tenadam-green-600 text-white shadow-lg shadow-tenadam-green-600/20 mb-3"
          >
            <Leaf className="h-6 w-6" />
          </motion.div>
          <motion.h1
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-display text-2xl font-bold tracking-tight text-center"
          >
            {isSignUp ? t("createAccount") : t("welcomeBack")}
          </motion.h1>
          <motion.p
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-sm text-tenadam-neutral-500 dark:text-tenadam-neutral-400 text-center mt-1.5"
          >
            {isSignUp ? t("createAccountDesc") : t("welcomeBackDesc")}
          </motion.p>
        </div>

        {/* Auth Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="glass-card p-8 relative overflow-hidden"
        >
          {/* Subtle design element */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-tenadam-green-500/10 to-tenadam-blue-500/10 rounded-full blur-xl pointer-events-none" />

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <AnimatePresence mode="popLayout">
              {isSignUp && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-1.5"
                >
                  <label className="text-xs font-semibold text-tenadam-neutral-600 dark:text-tenadam-neutral-300">
                    {t("fullName")}
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4.5 w-4.5 text-tenadam-neutral-400" />
                    <input
                      type="text"
                      placeholder="Abebe Balcha"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full text-sm pl-10 pr-4 py-2.5 rounded-xl border border-tenadam-neutral-200 dark:border-tenadam-neutral-700 bg-transparent focus:outline-none focus:border-tenadam-green-500 transition-colors"
                      required={isSignUp}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-tenadam-neutral-600 dark:text-tenadam-neutral-300">
                {t("email")}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 h-4 w-4 text-tenadam-neutral-400" />
                <input
                  type="email"
                  placeholder="abebe@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-sm pl-10 pr-4 py-2.5 rounded-xl border border-tenadam-neutral-200 dark:border-tenadam-neutral-700 bg-transparent focus:outline-none focus:border-tenadam-green-500 transition-colors"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-tenadam-neutral-600 dark:text-tenadam-neutral-300">
                {t("password")}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 h-4 w-4 text-tenadam-neutral-400" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full text-sm pl-10 pr-4 py-2.5 rounded-xl border border-tenadam-neutral-200 dark:border-tenadam-neutral-700 bg-transparent focus:outline-none focus:border-tenadam-green-500 transition-colors"
                  required
                />
              </div>
            </div>

            {/* Messages */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs text-rose-500 bg-rose-500/10 p-3 rounded-lg border border-rose-500/20"
              >
                {error}
              </motion.div>
            )}
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs text-emerald-500 bg-emerald-500/10 p-3 rounded-lg border border-emerald-500/20"
              >
                {success}
              </motion.div>
            )}

            <Button
              type="submit"
              className="w-full py-2.5 justify-center flex items-center gap-2"
              disabled={loading}
            >
              {loading ? (
                isSignUp ? t("signingUp") : t("loggingIn")
              ) : (
                <>
                  {isSignUp ? t("signup") : t("signin")}
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          {/* Toggle Tab */}
          <div className="mt-6 pt-5 border-t border-tenadam-neutral-200 dark:border-tenadam-neutral-700 flex flex-col items-center gap-2">
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError("");
                setSuccess("");
              }}
              className="text-xs font-semibold text-tenadam-neutral-600 hover:text-tenadam-green-600 dark:text-tenadam-neutral-400 dark:hover:text-tenadam-green-400 transition-colors"
            >
              {isSignUp ? t("haveAccount") : t("needAccount")}{" "}
              <span className="text-tenadam-green-600 dark:text-tenadam-green-400 hover:underline ml-1">
                {isSignUp ? t("signin") : t("signup")}
              </span>
            </button>
          </div>
        </motion.div>

        {/* Stigma Free Disclaimer */}
        <div className="flex justify-center items-center gap-2 mt-6 text-xs text-tenadam-neutral-400">
          <ShieldCheck className="h-4 w-4 text-tenadam-green-500" />
          <span>Safe, encrypted, and completely confidential.</span>
        </div>
      </div>
    </main>
  );
}
