"use client";

import React, { useState, useMemo, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Droplets,
  Plus,
  Minus,
  Trash2,
  Sparkles,
  Coffee,
  Utensils,
  Leaf,
  Apple,
  Flame,
  Zap,
  Heart,
  ChevronDown,
  ChevronUp,
  Clock,
  CheckCircle2,
  TrendingUp,
  BarChart3,
  AlertCircle,
} from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Meal {
  id: string;
  name: string;
  nameAm?: string;
  nameTi?: string;
  nameOm?: string;
  category: "meal" | "beverage" | "snack" | "herbal";
  emoji: string;
  calories: number;
  protein: number; // g
  carbs: number;   // g
  fat: number;     // g
  fiber: number;   // g
  benefit: string;
  benefitAm?: string;
  benefitTi?: string;
  benefitOm?: string;
}

interface LoggedItem {
  meal: Meal;
  time: string;
  timestamp: number;
}

// ─── Meal Database ────────────────────────────────────────────────────────────

const MEAL_DATABASE: Meal[] = [
  {
    id: "injera-shiro",
    name: "Injera with Shiro & Kik Alicha",
    nameAm: "ኢንጀራ ከሽሮ እና ቅቅ አሊቻ ጋር",
    nameTi: "እንጀራ ምስ ሽሮን ቂቂ ኣሊቻን",
    nameOm: "Injera fi Shiro & Kik Alicha",
    category: "meal",
    emoji: "🫓",
    calories: 420,
    protein: 18,
    carbs: 72,
    fat: 6,
    fiber: 8,
    benefit: "High fiber, plant protein, probiotic teff",
    benefitAm: "ከፍተኛ ፋይበር፣ የእፅዋት ፕሮቲን፣ ፕሮቢዮቲክ ጤፍ",
    benefitTi: "ልዑል ፋይበር፣ ናይ ዕፂ ፕሮቲን፣ ፕሮቢዮቲክ ጤፍ",
    benefitOm: "Faaydaa fayya guddaa: faaydaa nyaataa guddaa",
  },
  {
    id: "tenadam-tea",
    name: "Tenadam Herbal Tea",
    nameAm: "ዕፀ ተናዳም ሻይ",
    nameTi: "ሻሂ ተናዳም",
    nameOm: "Shaayii Tenadam",
    category: "herbal",
    emoji: "🌿",
    calories: 5,
    protein: 0,
    carbs: 1,
    fat: 0,
    fiber: 0,
    benefit: "Stress relief, headache remedy, antioxidant",
    benefitAm: "ጭንቀትን ይቀንሳል፣ የራስ ምታት ፈውስ፣ አንቲኦክሲዳንት",
    benefitTi: "ጸቕጢ የምቀንስ፣ ናይ ርዕሲ ቅዝቃዜ ፈውሲ",
    benefitOm: "Miiraa tasgabbeessa, haadhu mataa fayyisa",
  },
  {
    id: "traditional-coffee",
    name: "Traditional Coffee Ceremony",
    nameAm: "ባህላዊ ቡና ሥነ ሥርዓት",
    nameTi: "ባህላዊ ቡን ስነ-ስርዓት",
    nameOm: "Caffee Aadaa",
    category: "beverage",
    emoji: "☕",
    calories: 10,
    protein: 0,
    carbs: 2,
    fat: 0,
    fiber: 0,
    benefit: "Community bonding, antioxidants, mental clarity",
    benefitAm: "ማህበራዊ ትስስር፣ አንቲኦክሲዳንት፣ የአእምሮ ሁለት",
    benefitTi: "ማሕበራዊ ምትእስሳር፣ ንጹህ ሓሳብ",
    benefitOm: "Hawaasa gumaachuu, sammuu naggaa",
  },
  {
    id: "fitfit",
    name: "Firfir (Shredded Injera)",
    nameAm: "ፍርፍር",
    nameTi: "ፍርፍር",
    nameOm: "Firfir",
    category: "meal",
    emoji: "🥘",
    calories: 340,
    protein: 12,
    carbs: 58,
    fat: 8,
    fiber: 5,
    benefit: "Balanced macros, traditionally warming, energizing",
    benefitAm: "ሚዛናዊ ማክሮ፣ ሞቃት ምግብ፣ ኃይልን ይሰጣል",
    benefitTi: "ሚዛናዊ ን ሓይሊ ዝህብ",
    benefitOm: "Humnaa kennuu, nyaata madaalawaa",
  },
  {
    id: "kolo",
    name: "Roasted Barley (Kolo)",
    nameAm: "ቆሎ (ገብስ)",
    nameTi: "ቆሎ",
    nameOm: "Qoollo",
    category: "snack",
    emoji: "🌾",
    calories: 185,
    protein: 6,
    carbs: 38,
    fat: 2,
    fiber: 6,
    benefit: "Slow-release energy, gluten-light, filling",
    benefitAm: "ቀስ ብቀስ ኃይል፣ ረሃብን ያስታግሳል",
    benefitTi: "ዝደቡ ሓይሊ ዝህብ",
    benefitOm: "Humna yeroo dheeraa kennuu",
  },
  {
    id: "tibs",
    name: "Tibs (Sautéed Meat & Vegetables)",
    nameAm: "ጥብስ",
    nameTi: "ጥብሲ",
    nameOm: "Tibs",
    category: "meal",
    emoji: "🥩",
    calories: 380,
    protein: 32,
    carbs: 12,
    fat: 22,
    fiber: 3,
    benefit: "High protein, iron-rich, with spiced vegetables",
    benefitAm: "ከፍተኛ ፕሮቲን፣ ብረት ይሰጣል",
    benefitTi: "ልዑል ፕሮቲን፣ ብረት",
    benefitOm: "Pirootiini guddaa, sibiilaa guddaa",
  },
  {
    id: "misir-wot",
    name: "Misir Wot (Red Lentil Stew)",
    nameAm: "ምሥር ወጥ",
    nameTi: "ምስሩ ወጥ",
    nameOm: "Misir Wot",
    category: "meal",
    emoji: "🍲",
    calories: 310,
    protein: 16,
    carbs: 52,
    fat: 5,
    fiber: 12,
    benefit: "Plant-based iron, very high fiber, anti-inflammatory berbere",
    benefitAm: "የእፅዋት ብረት፣ ከፍተኛ ፋይበር",
    benefitTi: "ናይ ዕፂ ብረት፣ ልዑል ፋይበር",
    benefitOm: "Sibiilaa fi faaydaa nyaataa guddaa",
  },
  {
    id: "avocado-juice",
    name: "Avocado Juice (Avocado Blend)",
    nameAm: "አቮካዶ ጭማቂ",
    nameTi: "ጭማቂ አቮካዶ",
    nameOm: "Jiisa Avocado",
    category: "beverage",
    emoji: "🥑",
    calories: 220,
    protein: 3,
    carbs: 22,
    fat: 14,
    fiber: 7,
    benefit: "Healthy fats, heart health, rich in potassium",
    benefitAm: "ጤናማ ቅባት፣ የልብ ጤና",
    benefitTi: "ጥዑም ስብሒ፣ ናይ ልቢ ጥዕና",
    benefitOm: "Ool fayyadaa, onnee fayyisa",
  },
  {
    id: "water",
    name: "Pure Water",
    nameAm: "ንጹህ ውሃ",
    nameTi: "ጽሩይ ማይ",
    nameOm: "Bishaan Qulqulluu",
    category: "beverage",
    emoji: "💧",
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    fiber: 0,
    benefit: "Hydration, detox, cellular function",
    benefitAm: "ውሃ ማቅፈድ፣ ማጥራት",
    benefitTi: "ሕቖ ምሃብ፣ ምጽራይ",
    benefitOm: "Bishaan dhaala kennuu",
  },
  {
    id: "gomen",
    name: "Gomen (Ethiopian Collard Greens)",
    nameAm: "ጎመን",
    nameTi: "ጎሜን",
    nameOm: "Gomen",
    category: "meal",
    emoji: "🥬",
    calories: 90,
    protein: 5,
    carbs: 14,
    fat: 2,
    fiber: 6,
    benefit: "Vitamins K & C, folate, detoxifying greens",
    benefitAm: "ቫይታሚን K እና C፣ ፎሌት",
    benefitTi: "ቫይታሚን K & C",
    benefitOm: "Vitaaminii K fi C",
  },
  {
    id: "ayib",
    name: "Ayib (Ethiopian Fresh Cheese)",
    nameAm: "አይብ",
    nameTi: "ኣይብ",
    nameOm: "Ayib",
    category: "snack",
    emoji: "🧀",
    calories: 120,
    protein: 10,
    carbs: 3,
    fat: 8,
    fiber: 0,
    benefit: "Calcium, protein, probiotic benefits",
    benefitAm: "ካልሲየም፣ ፕሮቲን፣ ፕሮቢዮቲክ",
    benefitTi: "ካልሲዩም፣ ፕሮቲን",
    benefitOm: "Kaalsiyeemii fi pirootiini",
  },
  {
    id: "beso",
    name: "Beso (Barley Flour Porridge)",
    nameAm: "ቤሶ",
    nameTi: "ቤሶ",
    nameOm: "Beso",
    category: "snack",
    emoji: "🫙",
    calories: 160,
    protein: 5,
    carbs: 34,
    fat: 2,
    fiber: 4,
    benefit: "Traditional energy drink, easily digestible",
    benefitAm: "ባህላዊ የኃይል መጠጥ፣ ቀላል ምግብ",
    benefitTi: "ናይ ባህሊ ሓይሊ",
    benefitOm: "Humna aadaa",
  },

  // ── More Ethiopian Traditional Foods ─────────────────────────────────────
  {
    id: "doro-wot",
    name: "Doro Wot (Spiced Chicken Stew)",
    nameAm: "ዶሮ ወጥ",
    nameTi: "ዶሮ ወጥ",
    nameOm: "Doro Wot",
    category: "meal",
    emoji: "🍗",
    calories: 450,
    protein: 38,
    carbs: 18,
    fat: 24,
    fiber: 3,
    benefit: "Rich protein, berbere spices, iron & zinc from chicken",
    benefitAm: "ብዙ ፕሮቲን፣ ዶሮ ሥጋ ብረት እና ዚንክ ይሰጣል",
    benefitTi: "ልዑል ፕሮቲን፣ ናይ ቅርበሬ ፀረ-ምሕዞ",
    benefitOm: "Pirootiini guddaa, sibiilaa fi zinki dooloo irraa",
  },
  {
    id: "kitfo",
    name: "Kitfo (Ethiopian Beef Tartare)",
    nameAm: "ክትፎ",
    nameTi: "ክትፎ",
    nameOm: "Kitfo",
    category: "meal",
    emoji: "🥩",
    calories: 390,
    protein: 34,
    carbs: 2,
    fat: 26,
    fiber: 0,
    benefit: "High protein, rich in B12 & iron, mitmita spiced",
    benefitAm: "ከፍተኛ ፕሮቲን፣ ቫይታሚን B12 እና ብረት",
    benefitTi: "ልዑል ፕሮቲን፣ ቫይታሚን B12 ኣለዎ",
    benefitOm: "Pirootiini guddaa, B12 fi sibiilaa",
  },
  {
    id: "tegabino",
    name: "Tegabino (Chickpea Stew)",
    nameAm: "ተጋቢኖ",
    nameTi: "ተጋቢኖ",
    nameOm: "Tegabino",
    category: "meal",
    emoji: "🫘",
    calories: 280,
    protein: 14,
    carbs: 44,
    fat: 6,
    fiber: 10,
    benefit: "Plant protein, high fiber, folate & manganese",
    benefitAm: "የእፅዋት ፕሮቲን፣ ከፍተኛ ፋይበር",
    benefitTi: "ናይ ዕፂ ፕሮቲን፣ ልዑል ፋይበር",
    benefitOm: "Pirootiinii muka, faaydaa nyaataa guddaa",
  },
  {
    id: "chechebsa",
    name: "Chechebsa (Spiced Flatbread & Butter)",
    nameAm: "ጨጨብሳ",
    nameTi: "ጨጨብሳ",
    nameOm: "Chechebsa",
    category: "meal",
    emoji: "🫓",
    calories: 360,
    protein: 9,
    carbs: 52,
    fat: 14,
    fiber: 3,
    benefit: "Traditional breakfast, quick energy, warming spices",
    benefitAm: "ባህላዊ ቁርስ፣ ፈጣን ኃይል ይሰጣል",
    benefitTi: "ናይ ባህሊ ቁርሲ፣ ቀልጢፍ ሓይሊ",
    benefitOm: "Qursa aadaa, humna hatattama kennuu",
  },
  {
    id: "shiro-wot",
    name: "Shiro Wot (Ground Chickpea Stew)",
    nameAm: "ሽሮ ወጥ",
    nameTi: "ሽሮ ወጥ",
    nameOm: "Shiro Wot",
    category: "meal",
    emoji: "🍲",
    calories: 260,
    protein: 13,
    carbs: 40,
    fat: 5,
    fiber: 7,
    benefit: "Vegan protein, berbere anti-inflammatory, gut-friendly",
    benefitAm: "ቪጋን ፕሮቲን፣ ቤርቤሬ ፀረ-ምፍሳስ",
    benefitTi: "ቪጋን ፕሮቲን፣ ፀረ-ምሕዞ ቤርቤሬ",
    benefitOm: "Pirootiini vegan, midhaanitti fayyaa",
  },
  {
    id: "genfo",
    name: "Genfo (Porridge with Spiced Butter)",
    nameAm: "ገንፎ",
    nameTi: "ገንፎ",
    nameOm: "Genfo",
    category: "meal",
    emoji: "🥣",
    calories: 310,
    protein: 8,
    carbs: 56,
    fat: 7,
    fiber: 5,
    benefit: "Energy-dense, warming, fortifying — ideal for recovery",
    benefitAm: "ኃይልን ይሰጣል፣ ሞቅ ያለ ምግብ፣ ማገገምን ያፋጥናል",
    benefitTi: "ሓይሊ ዝህብ፣ ምሕዋይ ዘቀላጥፍ",
    benefitOm: "Humna guddaa kennuu, fayyaa deebisuuf gaarii",
  },
  {
    id: "kocho",
    name: "Kocho (Enset Flatbread)",
    nameAm: "ቆጮ",
    nameTi: "ቆጮ",
    nameOm: "Kocho",
    category: "meal",
    emoji: "🫓",
    calories: 220,
    protein: 4,
    carbs: 48,
    fat: 1,
    fiber: 4,
    benefit: "Gluten-free enset staple, slow-release energy, easy digestion",
    benefitAm: "ግሉተን-ነጻ ምግብ፣ ቀስ ኃይል፣ ቀላል ምግብ",
    benefitTi: "ብዘይ ግሉተን፣ ዝደቡ ሓይሊ",
    benefitOm: "Nyaata gluten hin qabne, humna yeroo dheeraa",
  },
  {
    id: "tella",
    name: "Tella (Ethiopian Barley Beer)",
    nameAm: "ጠላ",
    nameTi: "ጠላ",
    nameOm: "Tella",
    category: "beverage",
    emoji: "🍺",
    calories: 80,
    protein: 1,
    carbs: 12,
    fat: 0,
    fiber: 0,
    benefit: "Traditional probiotic brew, social bonding, B vitamins",
    benefitAm: "ባህላዊ ፕሮቢዮቲክ መጠጥ፣ ቫይታሚን B",
    benefitTi: "ናይ ባህሊ ፕሮቢዮቲክ፣ ቫይታሚን B",
    benefitOm: "Dhugaatii aadaa piroobiyootikii",
  },
  {
    id: "tej",
    name: "Tej (Ethiopian Honey Wine)",
    nameAm: "ጠጅ",
    nameTi: "ጠጅ",
    nameOm: "Tej",
    category: "beverage",
    emoji: "🍯",
    calories: 110,
    protein: 0,
    carbs: 18,
    fat: 0,
    fiber: 0,
    benefit: "Natural honey antioxidants, traditional ceremonial drink",
    benefitAm: "የማር አንቲኦክሲዳንት፣ ባህላዊ ሥነ-ሥርዓት መጠጥ",
    benefitTi: "ናይ ሕሰብ ኣንቲኦክሲዳንት",
    benefitOm: "Antioxidant damma, dhugaatii aadaa",
  },
  {
    id: "kinche",
    name: "Kinche (Cracked Wheat Porridge)",
    nameAm: "ቅንጭ",
    nameTi: "ቅንጭ",
    nameOm: "Kinche",
    category: "meal",
    emoji: "🥣",
    calories: 240,
    protein: 8,
    carbs: 46,
    fat: 4,
    fiber: 6,
    benefit: "Whole grain goodness, sustained energy, rich in minerals",
    benefitAm: "ሙሉ እህል፣ ዘላቂ ኃይል፣ ማዕድናት ያሟላል",
    benefitTi: "ምሉእ ፍሪ፣ ዘላቂ ሓይሊ",
    benefitOm: "Midhaan guutuu, humna dhaabataa",
  },
  {
    id: "misir-fitfit",
    name: "Misir Fitfit (Lentil & Injera Mix)",
    nameAm: "ምሥር ፍርፍር",
    nameTi: "ምስሩ ፍርፍር",
    nameOm: "Misir Fitfit",
    category: "meal",
    emoji: "🍛",
    calories: 290,
    protein: 14,
    carbs: 50,
    fat: 5,
    fiber: 9,
    benefit: "Double fiber punch, plant protein, gut microbiome booster",
    benefitAm: "ፋይበር እና ፕሮቲን ይሰጣል፣ የጨጓራ ጤናን ያሻሽላል",
    benefitTi: "ፋይበር ወ ፕሮቲን፣ ናይ ሆዱ ጥዕና ዘሐይስ",
    benefitOm: "Faaydaa nyaataa guddaa, fayyaa garaa",
  },
  {
    id: "awaze",
    name: "Awaze Dipping Sauce",
    nameAm: "አዋዜ",
    nameTi: "ኣዋዜ",
    nameOm: "Awaze",
    category: "snack",
    emoji: "🌶️",
    calories: 35,
    protein: 1,
    carbs: 6,
    fat: 1,
    fiber: 2,
    benefit: "Capsaicin metabolism boost, anti-inflammatory, immune support",
    benefitAm: "ሜታቦሊዝምን ያፋጥናል፣ ፀረ-ምፍሳስ",
    benefitTi: "ሜታቦሊዝም ዘቀላጥፍ፣ ፀረ-ምሕዞ",
    benefitOm: "Metabolism fooyyessuu, dhibee ittisuu",
  },

  // ── USA Popular Foods ─────────────────────────────────────────────────────
  {
    id: "grilled-chicken-salad",
    name: "Grilled Chicken Salad",
    category: "meal",
    emoji: "🥗",
    calories: 320,
    protein: 35,
    carbs: 15,
    fat: 12,
    fiber: 5,
    benefit: "Lean protein, vitamins A & C, low-calorie satiety",
    benefitAm: "የቀጥ ሥጋ ፕሮቲን፣ ቫይታሚን A እና C",
    benefitTi: "ቀጢን ፕሮቲን፣ ቫይታሚን A ወ C",
    benefitOm: "Pirootiini dhaabataa, vitaaminii A fi C",
  },
  {
    id: "oatmeal",
    name: "Oatmeal with Berries",
    category: "meal",
    emoji: "🥣",
    calories: 290,
    protein: 9,
    carbs: 54,
    fat: 5,
    fiber: 8,
    benefit: "Beta-glucan fiber, antioxidants, heart health powerhouse",
    benefitAm: "ቤታ-ግሉካን ፋይበር፣ አንቲኦክሲዳንት፣ የልብ ጤና",
    benefitTi: "ቤታ-ግሉካን ፋይበር፣ ናይ ልቢ ጥዕና",
    benefitOm: "Faaydaa garaa fi onnee",
  },
  {
    id: "pb-toast",
    name: "Peanut Butter & Banana Toast",
    category: "snack",
    emoji: "🍞",
    calories: 340,
    protein: 12,
    carbs: 48,
    fat: 14,
    fiber: 4,
    benefit: "Quick energy, potassium, healthy fats & mood support",
    benefitAm: "ፈጣን ኃይል፣ ፖታሲየም፣ ጤናማ ቅባት",
    benefitTi: "ቀልጢፍ ሓይሊ፣ ፖታሲዩም",
    benefitOm: "Humna ariifataa, pootaasiyeemii",
  },
  {
    id: "classic-burger",
    name: "Classic Beef Burger",
    category: "meal",
    emoji: "🍔",
    calories: 550,
    protein: 28,
    carbs: 45,
    fat: 28,
    fiber: 2,
    benefit: "Protein-dense, iron-rich, satisfying comfort food",
    benefitAm: "ፕሮቲን ይሰጣል፣ ብረት አለው",
    benefitTi: "ፕሮቲን ወ ብረት ዝሓዘ",
    benefitOm: "Pirootiinii fi sibiilaa guddaa",
  },
  {
    id: "caesar-salad",
    name: "Caesar Salad",
    category: "meal",
    emoji: "🥙",
    calories: 270,
    protein: 10,
    carbs: 18,
    fat: 18,
    fiber: 3,
    benefit: "Vitamin K, calcium, healthy fats from olive oil dressing",
    benefitAm: "ቫይታሚን K፣ ካልሲየም፣ ጤናማ ቅባት",
    benefitTi: "ቫይታሚን K ወ ካልሲዩም",
    benefitOm: "Vitaaminii K fi kaalsiyeemii",
  },
  {
    id: "blueberry-smoothie",
    name: "Blueberry Protein Smoothie",
    category: "beverage",
    emoji: "🫐",
    calories: 260,
    protein: 18,
    carbs: 38,
    fat: 4,
    fiber: 5,
    benefit: "Antioxidant-rich, brain health, muscle recovery boost",
    benefitAm: "አንቲኦክሲዳንት፣ የአእምሮ ጤና፣ ጡንቻ ማገገሚያ",
    benefitTi: "ኣንቲኦክሲዳንት፣ ናይ ሓንጎል ጥዕና",
    benefitOm: "Antioxidant, fayyaa sammuu, dafquu deebisuuf",
  },
  {
    id: "sweet-potato",
    name: "Baked Sweet Potato",
    category: "meal",
    emoji: "🍠",
    calories: 180,
    protein: 4,
    carbs: 41,
    fat: 0,
    fiber: 6,
    benefit: "Beta-carotene, potassium, immune boost & eye health",
    benefitAm: "ቤታ-ካሮቲን፣ ፖታሲየም፣ ሰውነትን ይጠብቃል",
    benefitTi: "ቤታ-ካሮቲን፣ ፖታሲዩም",
    benefitOm: "Beta-karoteen, argaa fayyisuu",
  },
  {
    id: "turkey-sandwich",
    name: "Turkey & Avocado Sandwich",
    category: "meal",
    emoji: "🥪",
    calories: 430,
    protein: 30,
    carbs: 40,
    fat: 16,
    fiber: 6,
    benefit: "Lean protein, heart-healthy fats, mood-boosting tryptophan",
    benefitAm: "የቀጥ ፕሮቲን፣ ጤናማ ቅባት፣ ዘና ማለት ያስጀምራል",
    benefitTi: "ቀጢን ፕሮቲን፣ ናይ ልቢ ጥዑም ስብሒ",
    benefitOm: "Pirootiini qulqulluu, oolmaa onnee",
  },
  {
    id: "greek-yogurt",
    name: "Greek Yogurt with Honey",
    category: "snack",
    emoji: "🫙",
    calories: 160,
    protein: 14,
    carbs: 20,
    fat: 3,
    fiber: 0,
    benefit: "Probiotics, calcium, gut health & immune support",
    benefitAm: "ፕሮቢዮቲክ፣ ካልሲየም፣ የጨጓራ ጤና",
    benefitTi: "ፕሮቢዮቲክ፣ ካልሲዩም",
    benefitOm: "Piroobiyootikii, kaalsiyeemii, fayyaa garaa",
  },
  {
    id: "salmon",
    name: "Baked Salmon with Vegetables",
    category: "meal",
    emoji: "🐟",
    calories: 390,
    protein: 40,
    carbs: 14,
    fat: 18,
    fiber: 4,
    benefit: "Omega-3 fatty acids, heart & brain health, vitamin D",
    benefitAm: "ኦሜጋ-3 ቅባት፣ የልብ እና አእምሮ ጤና",
    benefitTi: "ኦሜጋ-3፣ ናይ ሓንጎልን ልቢን ጥዕና",
    benefitOm: "Omega-3, fayyaa sammuu fi onnee",
  },
  {
    id: "mac-and-cheese",
    name: "Mac & Cheese",
    category: "meal",
    emoji: "🧀",
    calories: 490,
    protein: 18,
    carbs: 62,
    fat: 18,
    fiber: 2,
    benefit: "Comfort food, calcium from cheese, quick energy carbs",
    benefitAm: "ሞቅ ምግብ፣ ካልሲየም፣ ፈጣን ካርቦሃይድሬት",
    benefitTi: "ናይ ምጽናዕ ምግቢ፣ ካልሲዩም",
    benefitOm: "Nyaata boqonnaa, kaalsiyeemii, carbohaayidireeti hatattama",
  },
  {
    id: "apple-peanut-butter",
    name: "Apple Slices & Peanut Butter",
    category: "snack",
    emoji: "🍎",
    calories: 210,
    protein: 7,
    carbs: 30,
    fat: 9,
    fiber: 4,
    benefit: "Fiber + protein combo, blood sugar stabilizer, satisfying",
    benefitAm: "ፋይበር እና ፕሮቲን፣ የደም ስኳር ማረጋጊያ",
    benefitTi: "ፋይበርን ፕሮቲን ጽምዲ",
    benefitOm: "Faaydaa faaydaa: shakkara dhiigaa dhaabachuu",
  },
];

const DAILY_GOALS = {
  calories: 2000,
  protein: 60,
  carbs: 260,
  fat: 65,
  fiber: 30,
  water: 8,
};

const CATEGORY_META = {
  meal: { label: "Meals", labelAm: "ምግቦች", icon: Utensils, color: "tenadam-green" },
  beverage: { label: "Beverages", labelAm: "መጠጦች", icon: Coffee, color: "tenadam-blue" },
  snack: { label: "Snacks", labelAm: "መክሰስ", icon: Apple, color: "amber" },
  herbal: { label: "Herbal", labelAm: "ሻይ / ዕፅዋት", icon: Leaf, color: "emerald" },
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getNow(): string {
  const now = new Date();
  return now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function MacroRing({
  value,
  max,
  color,
  size = 56,
  strokeWidth = 6,
}: {
  value: number;
  max: number;
  color: string;
  size?: number;
  strokeWidth?: number;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(value / max, 1);
  const dashOffset = circumference * (1 - progress);
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        className="text-tenadam-neutral-200 dark:text-tenadam-neutral-700"
      />
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: dashOffset }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />
    </svg>
  );
}

function CalorieGauge({ consumed, goal }: { consumed: number; goal: number }) {
  const pct = Math.min(consumed / goal, 1);
  const size = 120;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const arcLength = circumference * 0.75; // 270 degree arc
  const dashOffset = arcLength * (1 - pct);

  const getColor = () => {
    if (pct < 0.6) return "#22c55e";
    if (pct < 0.9) return "#f59e0b";
    return "#ef4444";
  };

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(135deg)" }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={`${arcLength} ${circumference}`}
          className="text-tenadam-neutral-200 dark:text-tenadam-neutral-700"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={getColor()}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${arcLength} ${circumference}`}
          initial={{ strokeDashoffset: arcLength }}
          animate={{ strokeDashoffset: dashOffset }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-lg font-black text-tenadam-neutral-800 dark:text-tenadam-neutral-100 leading-none">
          {consumed}
        </span>
        <span className="text-[10px] text-tenadam-neutral-400 mt-0.5">kcal</span>
      </div>
    </div>
  );
}

// ─── AI Analysis hook ────────────────────────────────────────────────────────

async function generateNutritionAnalysis(
  logs: LoggedItem[],
  waterCups: number,
  language: string,
  totals: { calories: number; protein: number; carbs: number; fat: number; fiber: number },
  onChunk: (text: string) => void
): Promise<void> {
  const mealList = logs.map((l) => `${l.meal.name} (${l.meal.calories}kcal, P:${l.meal.protein}g, C:${l.meal.carbs}g, F:${l.meal.fat}g)`).join("; ");
  const prompt = `You are Tenadam Nutrition AI. Analyze today's nutrition log and provide a warm, holistic Tenadam analysis:

NUTRITION LOG: ${mealList || "No meals logged yet"}
TOTALS: ${totals.calories}kcal | Protein: ${totals.protein}g | Carbs: ${totals.carbs}g | Fat: ${totals.fat}g | Fiber: ${totals.fiber}g
HYDRATION: ${waterCups} cups of water
DAILY GOALS: 2000kcal, 60g protein, 260g carbs, 65g fat, 30g fiber, 8 cups water

Provide your analysis in 4 sections:
1. 🌿 **Nutritional Balance** - Brief assessment of today's intake vs goals
2. ⚡ **Energy & Wellbeing** - How this nutrition pattern affects mood, energy, and stress
3. 💧 **Hydration Status** - Hydration assessment
4. 🍽️ **Traditional Tenadam Tip** - One specific tip incorporating Ethiopian/African traditional foods (Tenadam, Injera teff, coffee ceremony, etc.)

Keep it concise, warm, encouraging and culturally sensitive. Respond in ${language === "am" ? "Amharic" : language === "ti" ? "Tigrigna" : language === "om" ? "Afaan Oromoo" : "English"}.`;

  const response = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages: [{ role: "user", content: prompt }], language }),
  });

  if (!response.ok || !response.body) throw new Error("AI analysis failed");

  const decoder = new TextDecoder();
  const reader = response.body.getReader();
  let buffer = "";

  const processLine = (line: string) => {
    const trimmed = line.trim();
    if (!trimmed.startsWith("data:")) return;
    const jsonStr = trimmed.replace(/^data:\s*/, "");
    if (jsonStr === "[DONE]") return;
    try {
      const parsed = JSON.parse(jsonStr);
      const delta = parsed.choices?.[0]?.delta?.content;
      if (delta) onChunk(delta);
    } catch { /* ignore */ }
  };

  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      if (buffer.trim()) processLine(buffer);
      break;
    }
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() || "";
    for (const line of lines) processLine(line);
  }
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface NutritionTrackerProps {
  waterCups: number;
  setWaterCups: (n: number) => void;
  foodLogs: string[];
  setFoodLogs: (logs: string[]) => void;
  /** Additional context from parent to enrich AI prompt */
  mood?: number;
  stress?: number;
  burnoutIndex?: number;
}

export function NutritionTracker({
  waterCups,
  setWaterCups,
}: NutritionTrackerProps) {
  const { language } = useLanguage();
  const [loggedItems, setLoggedItems] = useState<LoggedItem[]>([]);

  // Load logged items from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("wellnest-food-logs");
      if (stored) {
        const parsed = JSON.parse(stored) as LoggedItem[];
        // Only load today's logs
        const today = new Date().toDateString();
        const todayLogs = parsed.filter(
          (item) => new Date(item.timestamp).toDateString() === today
        );
        setLoggedItems(todayLogs);
      }
    } catch (e) {
      console.error("Failed to load food logs:", e);
    }
  }, []);

  // Save logged items to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem("wellnest-food-logs", JSON.stringify(loggedItems));
    } catch (e) {
      console.error("Failed to save food logs:", e);
    }
  }, [loggedItems]);
  const [activeCategory, setActiveCategory] = useState<"all" | "meal" | "beverage" | "snack" | "herbal">("all");
  const [showDatabase, setShowDatabase] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [aiOutput, setAiOutput] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");
  const [showAiPanel, setShowAiPanel] = useState(false);

  // Compute totals
  const totals = useMemo(() => {
    return loggedItems.reduce(
      (acc, item) => ({
        calories: acc.calories + item.meal.calories,
        protein: acc.protein + item.meal.protein,
        carbs: acc.carbs + item.meal.carbs,
        fat: acc.fat + item.meal.fat,
        fiber: acc.fiber + item.meal.fiber,
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 }
    );
  }, [loggedItems]);

  const filteredMeals = useMemo(() => {
    let meals = MEAL_DATABASE;
    if (activeCategory !== "all") {
      meals = meals.filter((m) => m.category === activeCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      meals = meals.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          (m.nameAm && m.nameAm.toLowerCase().includes(q))
      );
    }
    return meals;
  }, [activeCategory, searchQuery]);

  const addMeal = useCallback((meal: Meal) => {
    setLoggedItems((prev) => [
      { meal, time: getNow(), timestamp: Date.now() },
      ...prev,
    ]);
  }, []);

  const removeMeal = useCallback((timestamp: number) => {
    setLoggedItems((prev) => prev.filter((i) => i.timestamp !== timestamp));
  }, []);

  const getMealName = (meal: Meal) => {
    if (language === "am" && meal.nameAm) return meal.nameAm;
    if (language === "ti" && meal.nameTi) return meal.nameTi;
    if (language === "om" && meal.nameOm) return meal.nameOm;
    return meal.name;
  };

  const getMealBenefit = (meal: Meal) => {
    if (language === "am" && meal.benefitAm) return meal.benefitAm;
    if (language === "ti" && meal.benefitTi) return meal.benefitTi;
    if (language === "om" && meal.benefitOm) return meal.benefitOm;
    return meal.benefit;
  };

  const handleGenerateAI = async () => {
    setAiLoading(true);
    setAiOutput("");
    setAiError("");
    setShowAiPanel(true);
    try {
      await generateNutritionAnalysis(
        loggedItems,
        waterCups,
        language,
        totals,
        (chunk) => setAiOutput((prev) => prev + chunk)
      );
    } catch (e) {
      setAiError(
        e instanceof Error ? e.message : "AI analysis failed. Please try again."
      );
    } finally {
      setAiLoading(false);
    }
  };

  const waterPct = Math.min(waterCups / DAILY_GOALS.water, 1);

  // Labels per language
  const L = {
    header: language === "am" ? "የምግብ እና ውሃ ትንተና" : language === "ti" ? "ትንተና ምግብን ማይን" : language === "om" ? "Xiinxala Nyaataa fi Bishaan" : "Nutrition & Hydration Analytics",
    subtitle: language === "am" ? "ባህላዊ ምግቦችን ይመዝግቡ እና የAI ጤና ትንተና ያግኙ" : language === "ti" ? "ባህላዊ ምግቦም ምዝጋብ ወ AI ትንተና ምርካብ" : language === "om" ? "Nyaata aadaa galmeessi fi xiinxala AI argadhu" : "Log traditional meals & get AI Tenadam analysis",
    addMeals: language === "am" ? "ምግብ ጨምር" : language === "ti" ? "ምግቢ ወስኽ" : language === "om" ? "Nyaata Dabaluu" : "Add Meals",
    todayLog: language === "am" ? "የዛሬ ምዝገባ" : language === "ti" ? "ናይ ሎሚ ዝርዝር" : language === "om" ? "Galmeessa Har'aa" : "Today's Log",
    aiAnalysis: language === "am" ? "AI የምግብ ትንተና ያግኙ" : language === "ti" ? "AI ትንተና ምርካብ" : language === "om" ? "Xiinxala AI Nyaataa Argadhu" : "Generate AI Nutrition Analysis",
    analyzing: language === "am" ? "Tenadam AI እያወቅ ነው..." : language === "ti" ? "Tenadam AI ይሓስብ ኣሎ..." : language === "om" ? "Tenadam AI xiinxalaa jira..." : "Tenadam AI is analyzing...",
    waterGoal: language === "am" ? "ጠቅላላ ዕለታዊ ውሃ ግብ" : "Daily Water Goal",
    noLogs: language === "am" ? "እስካሁን ምግብ አልተመዘገበም" : "No meals logged yet",
    searchPlaceholder: language === "am" ? "ምግብ ፈልግ..." : "Search meals...",
    remaining: language === "am" ? "ቀሪ" : "remaining",
    exceeded: language === "am" ? "ተሻግሯል" : "exceeded",
  };

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-tenadam-green-100 dark:bg-tenadam-green-900/30">
              <Utensils className="h-4 w-4 text-tenadam-green-600 dark:text-tenadam-green-400" />
            </span>
            {L.header}
          </h2>
          <p className="text-xs text-tenadam-neutral-500 mt-1 ml-10">{L.subtitle}</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleGenerateAI}
          disabled={aiLoading}
          className="shrink-0 flex items-center gap-1.5 bg-gradient-to-r from-tenadam-green-600 to-tenadam-green-700 hover:from-tenadam-green-500 hover:to-tenadam-green-600 text-white font-semibold text-xs py-2 px-3 rounded-xl shadow-md disabled:opacity-60 transition-all"
        >
          {aiLoading ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full"
            />
          ) : (
            <Sparkles className="h-3.5 w-3.5" />
          )}
          {aiLoading ? L.analyzing : L.aiAnalysis}
        </motion.button>
      </div>

      {/* ── Analytics Row ── */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {/* Calorie Gauge */}
        <div className="col-span-2 sm:col-span-2 flex items-center gap-4 bg-tenadam-neutral-50 dark:bg-tenadam-neutral-800/40 rounded-2xl p-4 border border-tenadam-neutral-200/60 dark:border-tenadam-neutral-700/40">
          <CalorieGauge consumed={totals.calories} goal={DAILY_GOALS.calories} />
          <div className="space-y-1 min-w-0">
            <p className="text-xs font-semibold text-tenadam-neutral-500 uppercase tracking-wide">
              <Flame className="h-3 w-3 inline mr-1 text-orange-500" />
              Calories
            </p>
            <p className="text-sm font-bold text-tenadam-neutral-800 dark:text-tenadam-neutral-100">
              {totals.calories} <span className="font-normal text-xs text-tenadam-neutral-400">/ {DAILY_GOALS.calories}</span>
            </p>
            <p className={`text-xs font-medium ${totals.calories > DAILY_GOALS.calories ? "text-rose-500" : "text-tenadam-green-600"}`}>
              {Math.abs(DAILY_GOALS.calories - totals.calories)} kcal {totals.calories > DAILY_GOALS.calories ? L.exceeded : L.remaining}
            </p>
          </div>
        </div>

        {/* Macro Rings */}
        {[
          { key: "protein", label: "Protein", unit: "g", color: "#6366f1", max: DAILY_GOALS.protein, val: totals.protein, icon: "💪" },
          { key: "carbs", label: "Carbs", unit: "g", color: "#f59e0b", max: DAILY_GOALS.carbs, val: totals.carbs, icon: "⚡" },
          { key: "fat", label: "Fat", unit: "g", color: "#ec4899", max: DAILY_GOALS.fat, val: totals.fat, icon: "🫀" },
          { key: "fiber", label: "Fiber", unit: "g", color: "#10b981", max: DAILY_GOALS.fiber, val: totals.fiber, icon: "🌱" },
        ].map((macro) => (
          <div
            key={macro.key}
            className="flex flex-col items-center justify-center gap-1 bg-tenadam-neutral-50 dark:bg-tenadam-neutral-800/40 rounded-2xl p-3 border border-tenadam-neutral-200/60 dark:border-tenadam-neutral-700/40"
          >
            <div className="relative">
              <MacroRing value={macro.val} max={macro.max} color={macro.color} size={52} strokeWidth={5} />
              <span className="absolute inset-0 flex items-center justify-center text-sm">{macro.icon}</span>
            </div>
            <p className="text-[10px] font-semibold text-tenadam-neutral-500 uppercase tracking-wide">{macro.label}</p>
            <p className="text-xs font-bold text-tenadam-neutral-800 dark:text-tenadam-neutral-100">
              {macro.val}<span className="font-normal text-tenadam-neutral-400">/{macro.max}{macro.unit}</span>
            </p>
          </div>
        ))}
      </div>

      {/* ── Hydration Tracker ── */}
      <div className="rounded-2xl border border-tenadam-blue-200/40 dark:border-tenadam-blue-800/30 bg-gradient-to-br from-tenadam-blue-50/50 to-transparent dark:from-tenadam-blue-900/10 dark:to-transparent p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Droplets className="h-5 w-5 text-tenadam-blue-500" />
            <span className="font-bold text-sm text-tenadam-blue-700 dark:text-tenadam-blue-300">Hydration Tracker</span>
            <span className="text-xs text-tenadam-neutral-400">{L.waterGoal}: {DAILY_GOALS.water} cups</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setWaterCups(Math.max(0, waterCups - 1))}
              className="h-7 w-7 flex items-center justify-center rounded-full bg-white dark:bg-tenadam-neutral-800 border border-tenadam-blue-200 hover:bg-tenadam-blue-50 transition-colors"
            >
              <Minus className="h-3 w-3" />
            </button>
            <span className="text-lg font-black text-tenadam-blue-600 dark:text-tenadam-blue-400 w-6 text-center">
              {waterCups}
            </span>
            <button
              onClick={() => setWaterCups(waterCups + 1)}
              className="h-7 w-7 flex items-center justify-center rounded-full bg-white dark:bg-tenadam-neutral-800 border border-tenadam-blue-200 hover:bg-tenadam-blue-50 transition-colors"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>
        </div>

        {/* Animated cup track */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {Array.from({ length: DAILY_GOALS.water }).map((_, i) => (
            <motion.button
              key={i}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setWaterCups(i < waterCups ? i : i + 1)}
              className="relative"
            >
              <motion.div
                animate={{
                  opacity: i < waterCups ? 1 : 0.3,
                  scale: i < waterCups ? 1 : 0.85,
                }}
                transition={{ duration: 0.2 }}
                className={`w-8 h-10 rounded-b-lg rounded-t-sm border-2 flex items-end justify-center pb-1 overflow-hidden transition-colors ${
                  i < waterCups
                    ? "border-tenadam-blue-400 bg-tenadam-blue-400/10"
                    : "border-tenadam-neutral-300 dark:border-tenadam-neutral-600"
                }`}
              >
                {i < waterCups && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: "70%" }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                    className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-tenadam-blue-500 to-tenadam-blue-300 rounded-b-md"
                  />
                )}
                <span className="relative text-[10px]">💧</span>
              </motion.div>
            </motion.button>
          ))}
          <div className="ml-2">
            <p className={`text-sm font-bold ${waterPct >= 1 ? "text-tenadam-green-600" : "text-tenadam-blue-600"}`}>
              {waterPct >= 1 ? "🎉 Goal reached!" : `${waterCups}/${DAILY_GOALS.water} cups`}
            </p>
            <div className="w-32 h-1.5 bg-tenadam-neutral-200 dark:bg-tenadam-neutral-700 rounded-full mt-1 overflow-hidden">
              <motion.div
                animate={{ width: `${waterPct * 100}%` }}
                transition={{ duration: 0.5 }}
                className="h-full bg-gradient-to-r from-tenadam-blue-400 to-tenadam-blue-600 rounded-full"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Meal Database Picker ── */}
      <div>
        <button
          onClick={() => setShowDatabase((v) => !v)}
          className="w-full flex items-center justify-between py-2.5 px-4 rounded-xl bg-tenadam-neutral-100 dark:bg-tenadam-neutral-800 hover:bg-tenadam-neutral-200 dark:hover:bg-tenadam-neutral-700 transition-colors text-sm font-semibold"
        >
          <span className="flex items-center gap-2">
            <Plus className="h-4 w-4 text-tenadam-green-600" />
            {L.addMeals}
          </span>
          {showDatabase ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>

        <AnimatePresence>
          {showDatabase && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="pt-3 space-y-3">
                {/* Search */}
                <input
                  type="text"
                  placeholder={L.searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-xs rounded-xl border border-tenadam-neutral-200 dark:border-tenadam-neutral-700 p-2.5 focus:outline-none focus:border-tenadam-green-500 bg-transparent"
                />

                {/* Category tabs */}
                <div className="flex gap-1.5 flex-wrap">
                  {(["all", "meal", "beverage", "snack", "herbal"] as const).map((cat) => {
                    const meta = cat !== "all" ? CATEGORY_META[cat] : null;
                    const isActive = activeCategory === cat;
                    return (
                      <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`text-xs font-semibold rounded-full px-3 py-1.5 transition-colors flex items-center gap-1 ${
                          isActive
                            ? "bg-tenadam-green-600 text-white"
                            : "bg-tenadam-neutral-100 dark:bg-tenadam-neutral-800 text-tenadam-neutral-600 dark:text-tenadam-neutral-400 hover:bg-tenadam-neutral-200 dark:hover:bg-tenadam-neutral-700"
                        }`}
                      >
                        {meta && <meta.icon className="h-3 w-3" />}
                        {meta ? meta.label : "All"}
                      </button>
                    );
                  })}
                </div>

                {/* Meal grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-1">
                  {filteredMeals.map((meal) => (
                    <motion.button
                      key={meal.id}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => addMeal(meal)}
                      className="flex items-center gap-3 text-left p-3 rounded-xl border border-tenadam-neutral-200/70 dark:border-tenadam-neutral-700/50 bg-white/60 dark:bg-tenadam-neutral-800/30 hover:border-tenadam-green-400 hover:bg-tenadam-green-50/30 dark:hover:bg-tenadam-green-900/10 transition-all"
                    >
                      <span className="text-2xl shrink-0">{meal.emoji}</span>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-tenadam-neutral-800 dark:text-tenadam-neutral-100 truncate">
                          {getMealName(meal)}
                        </p>
                        <p className="text-[10px] text-tenadam-neutral-400 truncate">{getMealBenefit(meal)}</p>
                        <div className="flex gap-2 mt-1">
                          <span className="text-[10px] font-bold text-orange-500">{meal.calories} kcal</span>
                          <span className="text-[10px] text-tenadam-neutral-400">P:{meal.protein}g C:{meal.carbs}g</span>
                        </div>
                      </div>
                      <Plus className="h-4 w-4 text-tenadam-green-500 shrink-0" />
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Today's Log ── */}
      <div>
        <h3 className="text-sm font-bold text-tenadam-neutral-700 dark:text-tenadam-neutral-300 flex items-center gap-2 mb-3">
          <Clock className="h-4 w-4 text-tenadam-green-500" />
          {L.todayLog}
          <span className="ml-auto text-xs font-normal text-tenadam-neutral-400">
            {loggedItems.length} items
          </span>
        </h3>

        <AnimatePresence initial={false}>
          {loggedItems.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8 text-tenadam-neutral-400 text-sm"
            >
              <Utensils className="h-8 w-8 mx-auto mb-2 opacity-30" />
              {L.noLogs}
            </motion.div>
          ) : (
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {loggedItems.map((item) => (
                <motion.div
                  key={item.timestamp}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-3 p-2.5 rounded-xl bg-tenadam-neutral-50 dark:bg-tenadam-neutral-800/40 border border-tenadam-neutral-200/60 dark:border-tenadam-neutral-700/40"
                >
                  <CheckCircle2 className="h-4 w-4 text-tenadam-green-500 shrink-0" />
                  <span className="text-lg shrink-0">{item.meal.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-tenadam-neutral-800 dark:text-tenadam-neutral-100 truncate">
                      {getMealName(item.meal)}
                    </p>
                    <p className="text-[10px] text-tenadam-neutral-400">
                      <span className="text-orange-500 font-bold">{item.meal.calories} kcal</span>
                      {" · "}P:{item.meal.protein}g C:{item.meal.carbs}g F:{item.meal.fat}g
                      {" · "}
                      <span className="text-tenadam-blue-400">{item.time}</span>
                    </p>
                  </div>
                  <button
                    onClick={() => removeMeal(item.timestamp)}
                    className="h-6 w-6 flex items-center justify-center rounded-full hover:bg-rose-100 dark:hover:bg-rose-900/20 text-tenadam-neutral-400 hover:text-rose-500 transition-colors shrink-0"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* ── AI Nutrition Analysis Panel ── */}
      <AnimatePresence>
        {showAiPanel && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            className="rounded-2xl border border-tenadam-green-200/50 dark:border-tenadam-green-800/30 bg-gradient-to-br from-tenadam-green-50/60 to-tenadam-blue-50/30 dark:from-tenadam-green-900/10 dark:to-tenadam-blue-900/5 p-4"
          >
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-4 w-4 text-tenadam-green-500" />
              <span className="text-sm font-bold text-tenadam-green-700 dark:text-tenadam-green-300">
                AI Nutrition Analysis
              </span>
              {aiLoading && (
                <div className="flex gap-1 ml-2">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                      className="w-1.5 h-1.5 rounded-full bg-tenadam-green-500"
                    />
                  ))}
                </div>
              )}
              <button
                onClick={() => setShowAiPanel(false)}
                className="ml-auto text-xs text-tenadam-neutral-400 hover:text-tenadam-neutral-600"
              >
                ✕
              </button>
            </div>

            {aiError ? (
              <div className="flex items-start gap-2 text-rose-600 text-xs">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <p>{aiError}</p>
              </div>
            ) : (
              <div className="text-sm leading-relaxed text-tenadam-neutral-700 dark:text-tenadam-neutral-300 max-h-72 overflow-y-auto whitespace-pre-wrap">
                {aiOutput || (
                  <span className="text-xs text-tenadam-neutral-400 italic">
                    {aiLoading ? L.analyzing : "Analysis will appear here..."}
                  </span>
                )}
              </div>
            )}

            {!aiLoading && !aiError && aiOutput && (
              <div className="mt-3 flex gap-2">
                <button
                  onClick={handleGenerateAI}
                  className="flex items-center gap-1.5 text-xs font-semibold text-tenadam-green-600 hover:text-tenadam-green-700 transition-colors"
                >
                  <TrendingUp className="h-3.5 w-3.5" />
                  Refresh Analysis
                </button>
                <span className="text-tenadam-neutral-300">·</span>
                <button
                  onClick={() => setShowAiPanel(false)}
                  className="text-xs text-tenadam-neutral-400 hover:text-tenadam-neutral-600 transition-colors"
                >
                  Dismiss
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Nutrition Bar Chart Summary */}
      <div className="rounded-2xl border border-tenadam-neutral-200/60 dark:border-tenadam-neutral-700/40 bg-tenadam-neutral-50/50 dark:bg-tenadam-neutral-800/20 p-4">
        <h3 className="text-xs font-bold uppercase tracking-wide text-tenadam-neutral-500 flex items-center gap-2 mb-3">
          <BarChart3 className="h-3.5 w-3.5" />
          Macro Progress
        </h3>
        <div className="space-y-2.5">
          {[
            { label: "Protein", val: totals.protein, max: DAILY_GOALS.protein, color: "bg-indigo-500", unit: "g" },
            { label: "Carbs", val: totals.carbs, max: DAILY_GOALS.carbs, color: "bg-amber-500", unit: "g" },
            { label: "Fat", val: totals.fat, max: DAILY_GOALS.fat, color: "bg-pink-500", unit: "g" },
            { label: "Fiber", val: totals.fiber, max: DAILY_GOALS.fiber, color: "bg-emerald-500", unit: "g" },
          ].map((m) => (
            <div key={m.label} className="flex items-center gap-3">
              <span className="text-[10px] w-12 text-tenadam-neutral-500 font-medium">{m.label}</span>
              <div className="flex-1 h-2 bg-tenadam-neutral-200 dark:bg-tenadam-neutral-700 rounded-full overflow-hidden">
                <motion.div
                  animate={{ width: `${Math.min((m.val / m.max) * 100, 100)}%` }}
                  transition={{ duration: 0.6 }}
                  className={`h-full ${m.color} rounded-full`}
                />
              </div>
              <span className="text-[10px] w-16 text-right text-tenadam-neutral-600 dark:text-tenadam-neutral-400 font-semibold">
                {m.val}/{m.max}{m.unit}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-3 pt-3 border-t border-tenadam-neutral-200 dark:border-tenadam-neutral-700 flex items-center gap-2">
          <Zap className="h-3.5 w-3.5 text-amber-500" />
          <span className="text-[10px] text-tenadam-neutral-500">
            Caloric balance: <span className={`font-bold ${totals.calories > DAILY_GOALS.calories ? "text-rose-500" : "text-tenadam-green-600"}`}>
              {totals.calories > DAILY_GOALS.calories ? "+" : ""}{totals.calories - DAILY_GOALS.calories} kcal
            </span>
          </span>
          <Heart className="h-3.5 w-3.5 text-rose-400 ml-auto" />
          <span className="text-[10px] text-tenadam-neutral-400">
            {Math.round(totals.fiber / DAILY_GOALS.fiber * 100)}% daily fiber
          </span>
        </div>
      </div>
    </div>
  );
}
