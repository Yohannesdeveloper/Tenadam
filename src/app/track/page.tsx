"use client";

import React, { useState, useEffect, useRef } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Providers } from "@/components/Providers";
import { useLanguage } from "@/hooks/useLanguage";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  Sparkles,
  Send,
  Users,
  Timer,
  User,
  Shield
} from "lucide-react";
import { NutritionTracker } from "@/components/ui/NutritionTracker";

// Localized UI strings fallback structure for the dashboard
const trackingDict = {
  en: {
    title: "Interactive Wellbeing Dashboard",
    subtitle: "Track, reflect, and cultivate your mental and physical balance.",
    burnoutHeader: "Burnout & Stress Assessment",
    burnoutDesc: "Adjust the sliders below to calculate your real-time Stress & Burnout Risk Index.",
    labelMood: "Mood / Emotional State",
    labelSleep: "Sleep Quality",
    labelEnergy: "Daily Energy Levels",
    labelAnxiety: "Anxiety & Tension",
    labelStress: "Work / Life Stress",
    burnoutScoreLabel: "Burnout Risk Index",
    burnoutLow: "Balanced & Calm",
    burnoutMed: "Elevated Stress - Caution",
    burnoutHigh: "High Burnout Risk - Action Advised",
    breathingHeader: "Mindfulness Breathing Timer",
    breathingDesc: "Practice the 4-7-8 breathing technique. Reduce stress and bring immediate clarity.",
    breatheIn: "Breathe In...",
    hold: "Hold...",
    breatheOut: "Breathe Out...",
    startTimer: "Start Session",
    pauseTimer: "Pause",
    resetTimer: "Reset",
    breathGoal: "Mindfulness Minutes logged today:",
    nutritionHeader: "Integrated Nutrition & Hydration",
    nutritionDesc: "Log traditional local meals, herbal teas, and water intake to balance your lifestyle.",
    mealLabel: "Select a meal/beverage to log:",
    waterLabel: "Hydration Tracker",
    cups: "cups",
    communityHeader: "Regional Peer Support Circles",
    communityDesc: "Connect anonymously with others from your region. Share advice, encouragement, and local lifestyle practices.",
    postBtn: "Post Anonymously",
    chatPlaceholder: "Share a word of encouragement or Tenadam tip...",
    aiHeader: "AI-Powered Tenadam Twin",
    aiDesc: "Generate localized, personalized Tenadam plans and routines driven by your real-time tracking metrics.",
    generateAiBtn: "Generate AI Tenadam Plan",
    aiGenerating: "Consulting Tenadam AI...",
    aiPlaceholder: "Your personalized Tenadam routine will appear here. Log your metrics and click the button above to generate it.",
    secTitle: "Safe, encrypted, and completely anonymous.",
  },
  am: {
    title: "በይነተገናኝ የደህንነት ዳሽቦርድ",
    subtitle: "የአእምሮ እና የአካል ሚዛንዎን ይከታተሉ፣ ያስውቡ እና ያሳድጉ።",
    burnoutHeader: "የጭንቀት እና ድካም ግምገማ",
    burnoutDesc: "የጭንቀት እና የድካም አደጋ መረጃ ጠቋሚዎን በቅጽበት ለማስላት ተንሸራታቾቹን ያስተካክሉ።",
    labelMood: "ስሜት / ስሜታዊ ሁኔታ",
    labelSleep: "የእንቅልፍ ጥራት",
    labelEnergy: "የዕለት ተዕለት የኃይል ደረጃ",
    labelAnxiety: "ጭንቀት እና ውጥረት",
    labelStress: "የስራ / የህይወት ውጥረት",
    burnoutScoreLabel: "የጭንቀት ጠቋሚ",
    burnoutLow: "የተረጋጋ እና ሚዛናዊ",
    burnoutMed: "መካከለኛ ጭንቀት - ጥንቃቄ ያድርጉ",
    burnoutHigh: "ከፍተኛ የድካም ስጋት - እረፍት ያድርጉ",
    breathingHeader: "የአተነፋፈስ ልምምድ ሰዓት ቆጣሪ",
    breathingDesc: "የ 4-7-8 አተነፋፈስ ዘዴን ይለማመዱ። ጭንቀትን ይቀንሱ እና ፈጣን የአእምሮ መረጋጋት ያግኙ።",
    breatheIn: "ወደ ውስጥ ይተንፍሱ...",
    hold: "ይያዙት...",
    breatheOut: "ወደ ውጭ ይተንፍሱ...",
    startTimer: "ልምምድ ጀምር",
    pauseTimer: "አቁም",
    resetTimer: "እንደገና ጀምር",
    breathGoal: "ዛሬ የተመዘገቡ የአተነፋፈስ ደቂቃዎች፡",
    nutritionHeader: "የተመጣጠነ ምግብ እና የውሃ ክትትል",
    nutritionDesc: "የአኗኗር ዘይቤዎን ለማመጣጠን ባህላዊ ምግቦችን፣ የእፅዋት ሻይዎችን እና የውሃ አወሳሰድን ይመዝግቡ።",
    mealLabel: "ለመመዝገብ ምግብ ወይም መጠጥ ይምረጡ፡",
    waterLabel: "የውሃ ክትትል",
    cups: "ብርጭቆዎች",
    communityHeader: "የክልል እርስ በርስ ድጋፍ ሰጪ ክበቦች",
    communityDesc: "በአካባቢዎ ካሉ ሰዎች ጋር ማንነትዎን ሳይገልጹ ይገናኙ። ምክሮችን፣ ማበረታቻዎችን እና የሀገር በቀል የአኗኗር ዘይቤዎችን ያካፍሉ።",
    postBtn: "ማንነትን ሳይገልጹ ልጥፍ ያድርጉ",
    chatPlaceholder: "የማበረታቻ ቃል ወይም የጤና ምክር ያጋሩ...",
    aiHeader: "በአይ-የሚመራ የደህንነት ረዳት",
    aiDesc: "በእውነተኛ ጊዜ የመከታተያ መለኪያዎችዎ ላይ በመመስረት ለግል የተበጁ የጤና እቅዶችን እና ልምዶችን ያመንጩ።",
    generateAiBtn: "የአይ ደህንነት እቅድ አውጣ",
    aiGenerating: "ወልነስት አconnection...",
    aiPlaceholder: "የእርስዎ ግላዊ የደህንነት ልምምዶች እዚህ ይታያሉ። መለኪያዎችዎን ይመዝግቡ እና ለማመንጨት ከላይ ያለውን ቁልፍ ጠቅ ያድርጉ።",
    secTitle: "ደህንነቱ የተጠበቀ፣ የተመሰጠረ እና ሙሉ በሙሉ ማንነትን የማይገልጽ።",
  },
  om: {
    title: "Daashboordii Fayyadummaa Qaxxaamuraa",
    subtitle: "Madaala sammuu fi qaama keetii hordofi, xiinxali, gabbisi.",
    burnoutHeader: "Madaallii Dhiphinaa fi Dadhabbiikaa",
    burnoutDesc: "Madaallii Dhiphinaa fi Dadhabbiikaa kee yeroo tokkotti shallaguuf islaayidaroota gadii sirreessi.",
    labelMood: "Miira / Haala Keessoo",
    labelSleep: "Qulqullina Hirriibaa",
    labelEnergy: "Sadarkaa Humna Guyyaa",
    labelAnxiety: "Yaaddoo fi Dhiphina",
    labelStress: "Dhiphina Hojii / Jireenyaa",
    burnoutScoreLabel: "Mul'isa Dhiphinaa",
    burnoutLow: "Madaalawaa & Tasgabbii",
    burnoutMed: "Dhiphina giddu-galeessaa - Of-eeggannoo",
    burnoutHigh: "Sodaa Dadhabbiikaa Olaanaa - Boqodhaa",
    breathingHeader: "Sa'aatii Hordoffii Hargansaa",
    breathingDesc: "Mala hargansaa 4-7-8 shaakali. Dhiphina hir'isi, tasgabbii argadhu.",
    breatheIn: "Gadi fageenyaan fudhadhu...",
    hold: "Kukkuti...",
    breatheOut: "Gadi lakkisi...",
    startTimer: "Shaakala Jalqabi",
    pauseTimer: "Dhaabi",
    resetTimer: "Irra-deebi'i",
    breathGoal: "Daqiiqawwan shaakala hargansaa guyyaa har'aa:",
    nutritionHeader: "Hordoffii Nyaataa fi Bishaan Fudhachuu",
    nutritionDesc: "Fayyadummaa kee madaaluuf nyaata aadaa, shaayii qunxurraa fi bishaan guyyaa keetti galmeessi.",
    mealLabel: "Nyaata ykn dhugaatii galmeessuuf filadhu:",
    waterLabel: "Hordoffii Bishaan Dhuguu",
    cups: "kooppii",
    communityHeader: "Garee Hiriyoota Naannoo",
    communityDesc: "Maqaa kee utuu hin ibsin namoota naannoo keetii wajjin wal qunnami. Gorsa fi gochaa fayyadummaa walitti hiraa.",
    postBtn: "Barsiisi Maqaa Malee",
    chatPlaceholder: "Jecha jajjabinaa ykn gorsa fayyadummaa qoodi...",
    aiHeader: "Gargaaraa AI Fayyadummaa Kee",
    aiDesc: "Madaallii kee irratti hundaa'uun karoora fi tajaajila fayyadummaa sirriitti siif qophaa'e uumi.",
    generateAiBtn: "Karoora Fayyadummaa AI Uumi",
    aiGenerating: "Tenadam AI Mari'achaa jira...",
    aiPlaceholder: "Karoorri fayyadummaa dhuunfaa kee asitti mul'ata. Madaallii kee galmeessi maqaa gadii cuqaasuun uumi.",
    secTitle: "Amansiisaa, kuusaa iccitii eegamee fi maqaa malee.",
  },
  ti: {
    title: "መስተጋብራዊ ናይ ጥዕና ዳሽቦርድ",
    subtitle: "ሚዛን ኣእምሮኹምን ኣካልኩምን ተኸታተሉ፣ ኣስተንትኑን ኣማዕብሉን።",
    burnoutHeader: "ገምጋም ጸቕጥን ድኻምን",
    burnoutDesc: "ናይ ጸቕጥን ድኻምን ሓደጋ ምልክት ንምስላጥ ነዞም ተንሸራተቲ መተሓላለፊታት አስተኻኽሉዎም።",
    labelMood: "ስምዒት / ናይ ኣእምሮ ኩነታት",
    labelSleep: "ፅሬት ደቂስ",
    labelEnergy: "ናይ መዓልቲ ደረጃ ሓይሊ",
    labelAnxiety: "ጭንቀትን ወጥሪን",
    labelStress: "ናይ ስራሕ / ህይወት ጸቕጢ",
    burnoutScoreLabel: "ምልክት ጸቕጢ",
    burnoutLow: "ርግእን ዝተመጣጠነን",
    burnoutMed: "ማእከላይ ጸቕጢ - ጥንቃቐ",
    burnoutHigh: "ለዓሊ ሓደጋ ድኻም - ዕረፍቲ የድሊ",
    breathingHeader: "ናይ ምስትንፋስ ልምምድ ሰዓት ቆጣሪ",
    breathingDesc: "ልምምድ ምስትንፋስ 4-7-8 ተለማመዱ። ጸቕጢ ይቀንስን ቅልጡፍ ሰላም ይህብን።",
    breatheIn: "ውሰድዎ...",
    hold: "ሓዝዎ...",
    breatheOut: "ኣውጽእዎ...",
    startTimer: "ልምምድ ጀምር",
    pauseTimer: "ኣቋርጽ",
    resetTimer: "እንደገና ጀምር",
    breathGoal: "ሎሚ ዝተመዝገበ ናይ ምስትንፋስ ደቂቓታት፡",
    nutritionHeader: "ምግብን ምቁፅፃር ማይን",
    nutritionDesc: "ናይ ሂወት ሚዛንኩም ንምሕላው ባህላዊ መግብታት፣ ናይ ዕፅዋት ሻሂን መጠን ማይን መዝግቡ።",
    mealLabel: "ንክምዝገብ መግቢ ወይ መስተ ይምረፁ፡",
    waterLabel: "ምክትታል ማይ",
    cups: "ብርጭቆታት",
    communityHeader: "ባህላዊ ናይ ክልል ሓገዝ ጉጅለታት",
    communityDesc: "መንነትኩም ከይገለፅኩም ምስ ከባብያዊ ሰባት ተራኸቡ። ምኽሪ፣ ማበረታታት ሓባራዊ ልምድታትን ክፈሉ።",
    postBtn: "ብምስጢር ፅሓፉ",
    chatPlaceholder: "ናይ ሓገዝ ቃል ወይ ናይ ጥዕና ምኽሪ ምክፋል...",
    aiHeader: "ብኣይ ዝምራሕ ናይ ጥዕና ሓጋዚ",
    aiDesc: "በቲ ናይ ሓቀኛ ግዜ መለኪታትኩም መሰረት ብምግባር ብኣይ ዝተዳለወ ናይ ጥዕና መደብ ፍጠሩ።",
    generateAiBtn: "ናይ AI ጥዕና መደብ ፍጠር",
    aiGenerating: "ወልነስት AI እናሓሰበ እዩ...",
    aiPlaceholder: "ናይ ጥዕና መደብኩም ኣብዚ ክርአ እዩ። መለኪታትኩም መዝግቡ እሞ ነቲ ላዕለዋይ መጠወቒ ጠውቑ።",
    secTitle: "ውሑስ፣ ዝተመስጠረን ምሉእ ብምሉእ ብምስጢር ዝተሓለወን።",
  }
};

const initialChatMessages = {
  Addis: [
    { sender: "Anonymous Lion", text: "Taking a 5-minute break during my workday today. Breathing exercises really help. Greetings to Addis!", time: "10 mins ago" },
    { sender: "Anonymous Sage", text: "Don't forget to drink water! The weather is getting warm here.", time: "1 hr ago" }
  ],
  Oromia: [
    { sender: "Anonymous Geda", text: "Coffee ceremony with neighbors this afternoon. The community connection does wonders for anxiety.", time: "25 mins ago" },
    { sender: "Anonymous Kelcha", text: "Starting my day with mindfulness and a walk. Hope everyone has a peaceful day.", time: "3 hrs ago" }
  ],
  Tigray: [
    { sender: "Anonymous Axum", text: "A fresh cup of herbal tea with Tenadam leaf helped clear my morning headache today. Highly recommend.", time: "40 mins ago" },
    { sender: "Anonymous Selam", text: "Stay strong, family. Healing takes time, one day at a time.", time: "2 hrs ago" }
  ],
  Amhara: [
    { sender: "Anonymous Gonder", text: "I logged my steps today walking by the beautiful fields. Nature is the best therapy.", time: "15 mins ago" },
    { sender: "Anonymous Tana", text: "Anonymous support is a blessing. Stigma has no place in our healing journey.", time: "4 hrs ago" }
  ]
};

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login?redirect=/track");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-radial from-tenadam-green-50/20 via-transparent to-transparent dark:from-tenadam-green-900/10">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-10 h-10 border-4 border-tenadam-green-600 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return <>{children}</>;
}

export default function TrackPage() {
  return (
    <Providers>
      <ProtectedRoute>
        <Navbar />
        <TrackDashboardContent />
        <Footer />
      </ProtectedRoute>
    </Providers>
  );
}

function TrackDashboardContent() {
  const { language } = useLanguage();
  const t = (key: keyof typeof trackingDict.en): string => {
    return trackingDict[language]?.[key] || trackingDict.en[key];
  };

  // 1. Burnout Slider States
  const [mood, setMood] = useState(70);
  const [sleep, setSleep] = useState(65);
  const [energy, setEnergy] = useState(60);
  const [anxiety, setAnxiety] = useState(40);
  const [stress, setStress] = useState(50);
  const [burnoutIndex, setBurnoutIndex] = useState(0);

  // Recalculate Burnout & Stress Index
  // Mood/Sleep/Energy are positive factors (higher is better, so 100 - value is stress weight)
  // Anxiety/Stress are negative factors (higher is worse)
  useEffect(() => {
    const stressWeight = stress * 1.2;
    const anxietyWeight = anxiety * 1.1;
    const moodPenalty = 100 - mood;
    const sleepPenalty = 100 - sleep;
    const energyPenalty = 100 - energy;

    const total = (stressWeight + anxietyWeight + moodPenalty + sleepPenalty + energyPenalty) / 5.3;
    setBurnoutIndex(Math.min(Math.round(total), 100));
  }, [mood, sleep, energy, anxiety, stress]);

  const getBurnoutStatus = (score: number) => {
    if (score < 40) return { label: t("burnoutLow"), color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20" };
    if (score < 70) return { label: t("burnoutMed"), color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/20" };
    return { label: t("burnoutHigh"), color: "text-rose-500", bg: "bg-rose-500/10", border: "border-rose-500/20" };
  };

  const status = getBurnoutStatus(burnoutIndex);

  // 2. Animated Breathing States (4-7-8)
  const [breathingActive, setBreathingActive] = useState(false);
  const [breathingPhase, setBreathingPhase] = useState<"inhale" | "hold" | "exhale">("inhale");
  const [breathingSeconds, setBreathingSeconds] = useState(4);
  const [mindfulnessMinutes, setMindfulnessMinutes] = useState(10);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (breathingActive) {
      intervalRef.current = setInterval(() => {
        setBreathingSeconds((prev) => {
          if (prev <= 1) {
            // Transition phase
            if (breathingPhase === "inhale") {
              setBreathingPhase("hold");
              return 7;
            } else if (breathingPhase === "hold") {
              setBreathingPhase("exhale");
              return 8;
            } else {
              setBreathingPhase("inhale");
              // Add a cycle towards logging mindfulness minutes (approx 19 seconds per breath cycle)
              setMindfulnessMinutes((m) => m + 0.3);
              return 4;
            }
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [breathingActive, breathingPhase]);

  const toggleBreathing = () => {
    setBreathingActive(!breathingActive);
  };

  const resetBreathing = () => {
    setBreathingActive(false);
    setBreathingPhase("inhale");
    setBreathingSeconds(4);
  };

  // 3. Nutrition & Hydration Logger (state lifted here to share with AI insights)
  const [waterCups, setWaterCups] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("wellnest-water-cups");
      if (stored) return parseInt(stored, 10) || 0;
    }
    return 0;
  });

  // Persist water cups
  useEffect(() => {
    localStorage.setItem("wellnest-water-cups", String(waterCups));
  }, [waterCups]);

  const [foodLogs, setFoodLogs] = useState<string[]>([]);

  // 4. Peer Support Circles ( simulated realtime )
  const [activeRegion, setActiveRegion] = useState<"Addis" | "Oromia" | "Tigray" | "Amhara">("Addis");
  const [circleMessages, setCircleMessages] = useState(initialChatMessages);
  const [chatInput, setChatInput] = useState("");

  const postToCircle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const newMsg = {
      sender: "Anonymous Member",
      text: chatInput.trim(),
      time: "Just now"
    };
    setCircleMessages((prev) => ({
      ...prev,
      [activeRegion]: [newMsg, ...prev[activeRegion]]
    }));
    setChatInput("");
  };

  // 5. AI recommendations twin
  const [aiOutput, setAiOutput] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  const generateAiInsights = async () => {
    setAiLoading(true);
    setAiOutput("");

    const moodStatus = mood > 70 ? "Good" : mood > 40 ? "Moderate" : "Low";
    const stressStatus = stress > 70 ? "Critical" : stress > 40 ? "Elevated" : "Balanced";
    const nutritionSummary = foodLogs.join(", ");
    
    const userPrompt = `I am using the Tenadam Wellbeing Tracker. Today, my recorded metrics are:
- Mood / Emotional health: ${moodStatus} (${mood}/100)
- Sleep Quality: ${sleep}/100
- Energy Levels: ${energy}/100
- Anxiety Levels: ${anxiety}/100
- Work/Life Stress: ${stressStatus} (${stress}/100)
- Active Steps/Activity: logged steps and water intake of ${waterCups} cups.
- Nutrition logs: ${nutritionSummary}.

Generate a concise, personalized, and highly practical daily Tenadam routine based on these values. Offer 3-4 specific suggestions tailored to my active language/context (${language}).
Please explicitly suggest at least one traditional Ethiopian/African Tenadam practice (such as a slow coffee brewing mindfulness ceremony, an infusion of the herbal remedy Tenadam for tension, or a local community bonding structure like Debo or Equb peer sharing) that fits my current state.

IMPORTANT — Presentation variety: Each time you generate a plan, use a COMPLETELY DIFFERENT creative format. Rotate randomly between these presentation styles:
- 📅 A "Daily Timeline" format (Morning → Afternoon → Evening schedule)
- 🃏 A "Wellness Cards" format (each tip as a standalone titled card with emoji headers)
- 🎯 A "Priority Action Plan" format (ranked #1 Most Important → #4, with urgency levels)
- 🌿 A "Nature & Tradition" themed format (each tip tied to an Ethiopian plant, ritual, or season)
- 📊 A "Metrics Response" format (address each metric directly: "Your mood is X, here's what to do about it")
- 💬 A "Letter from a Friend" format (warm, conversational, personal tone as if a caring friend wrote it)
- ⚡ A "Quick Wins + Deep Practice" format (split into fast 5-min actions vs. longer mindful practices)
Pick ONE format randomly and commit to it fully. Do NOT repeat the same format every time.`;

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: userPrompt }],
          language: language
        })
      });

      if (!response.ok) throw new Error("API call failed");
      if (!response.body) throw new Error("No stream content");

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
          if (delta) {
            setAiOutput((prev) => prev + delta);
          }
        } catch {}
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
        for (const line of lines) {
          processLine(line);
        }
      }
    } catch (err) {
      console.error(err);
      const errMsg = err instanceof Error ? err.message : String(err);
      if (errMsg.includes("429")) {
        setAiOutput("Failed to fetch custom AI suggestions. OpenAI returned status 429 (Quota Exceeded / Rate Limited). Please verify your billing balance at https://platform.openai.com/.");
      } else if (errMsg.includes("401")) {
        setAiOutput("Failed to fetch custom AI suggestions. OpenAI returned status 401 (Unauthorized / Invalid Key). Please verify your API key is correct.");
      } else {
        setAiOutput("Failed to fetch custom AI suggestions. Please ensure you have configured your OPENAI_API_KEY correctly.");
      }
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <main className="min-h-screen pt-28 pb-16 bg-gradient-radial from-tenadam-green-50/20 via-transparent to-transparent dark:from-tenadam-green-900/10">
      <div className="container-wide px-4 sm:px-6 lg:px-8">
        
        {/* Banner Headers */}
        <div className="relative mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-1.5 rounded-full bg-tenadam-green-100 dark:bg-tenadam-green-900/40 px-3 py-1 text-xs font-semibold text-tenadam-green-700 dark:text-tenadam-green-300">
              <Shield className="h-3.5 w-3.5" />
              {t("secTitle")}
            </span>
            <h1 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-balance sm:text-4xl lg:text-5xl">
              {t("title")}
            </h1>
            <p className="mt-2 text-md text-tenadam-neutral-600 dark:text-tenadam-neutral-400 max-w-2xl">
              {t("subtitle")}
            </p>
          </motion.div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid gap-8 lg:grid-cols-12">
          
          {/* Left Column: Assessment & Sliders */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Stress & Burnout sliders */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="glass-card p-6"
            >
              <div className="flex items-center gap-3 border-b border-tenadam-neutral-200 dark:border-tenadam-neutral-700 pb-4 mb-6">
                <Activity className="h-6 w-6 text-tenadam-green-600 dark:text-tenadam-green-400" />
                <div>
                  <h2 className="text-xl font-bold">{t("burnoutHeader")}</h2>
                  <p className="text-xs text-tenadam-neutral-500 mt-0.5">{t("burnoutDesc")}</p>
                </div>
              </div>

              {/* Sliders Container */}
              <div className="space-y-5">
                {[
                  { key: "mood", label: t("labelMood"), val: mood, set: setMood, min: 0, max: 100 },
                  { key: "sleep", label: t("labelSleep"), val: sleep, set: setSleep, min: 0, max: 100 },
                  { key: "energy", label: t("labelEnergy"), val: energy, set: setEnergy, min: 0, max: 100 },
                  { key: "anxiety", label: t("labelAnxiety"), val: anxiety, set: setAnxiety, min: 0, max: 100 },
                  { key: "stress", label: t("labelStress"), val: stress, set: setStress, min: 0, max: 100 },
                ].map((item) => (
                  <div key={item.key} className="space-y-1.5">
                    <div className="flex justify-between text-sm font-medium">
                      <span className="text-tenadam-neutral-700 dark:text-tenadam-neutral-300">{item.label}</span>
                      <span className="text-tenadam-green-600 dark:text-tenadam-green-400 font-bold">{item.val}%</span>
                    </div>
                    <input
                      type="range"
                      min={item.min}
                      max={item.max}
                      value={item.val}
                      onChange={(e) => item.set(Number(e.target.value))}
                      className="w-full h-2 rounded-lg bg-tenadam-neutral-200 dark:bg-tenadam-neutral-700 appearance-none cursor-pointer accent-tenadam-green-600 dark:accent-tenadam-green-400"
                    />
                  </div>
                ))}
              </div>

              {/* Index Indicator */}
              <div className={`mt-8 p-4 rounded-xl border ${status.bg} ${status.border} transition-colors flex items-center justify-between`}>
                <div>
                  <p className="text-xs font-semibold text-tenadam-neutral-500 uppercase tracking-wide">
                    {t("burnoutScoreLabel")}
                  </p>
                  <p className={`text-lg font-bold mt-0.5 ${status.color}`}>
                    {status.label}
                  </p>
                </div>
                <div className="text-right">
                  <span className={`text-4xl font-extrabold tracking-tight ${status.color}`}>
                    {burnoutIndex}
                  </span>
                  <span className="text-xs text-tenadam-neutral-500 block">/ 100</span>
                </div>
              </div>
            </motion.div>

            {/* Nutrition & Hydration Tracker — Enhanced */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="glass-card p-6"
            >
              <NutritionTracker
                waterCups={waterCups}
                setWaterCups={setWaterCups}
                foodLogs={foodLogs}
                setFoodLogs={setFoodLogs}
                mood={mood}
                stress={stress}
                burnoutIndex={burnoutIndex}
              />
            </motion.div>

          </div>

          {/* Right Column: Breathing Timer & Community Chat & AI Insights */}
          <div className="lg:col-span-5 space-y-8">
            
            {/* Guided Breathing timer */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="glass-card p-6 flex flex-col items-center"
            >
              <div className="w-full flex items-center gap-3 border-b border-tenadam-neutral-200 dark:border-tenadam-neutral-700 pb-4 mb-6">
                <Timer className="h-6 w-6 text-tenadam-green-600" />
                <div className="text-left">
                  <h2 className="text-xl font-bold">{t("breathingHeader")}</h2>
                  <p className="text-xs text-tenadam-neutral-500 mt-0.5">{t("breathingDesc")}</p>
                </div>
              </div>

              {/* Glowing Breathing Bubble */}
              <div className="relative flex items-center justify-center h-48 w-48 my-4">
                <motion.div
                  animate={{
                    scale: breathingActive
                      ? breathingPhase === "inhale"
                        ? 1.5
                        : breathingPhase === "hold"
                        ? 1.5
                        : 0.8
                      : 1,
                  }}
                  transition={{
                    duration: breathingPhase === "inhale" ? 4 : breathingPhase === "hold" ? 7 : 8,
                    ease: "easeInOut",
                  }}
                  className="absolute inset-0 rounded-full bg-gradient-to-tr from-tenadam-green-500/30 to-tenadam-blue-500/30 blur-xl"
                />
                <motion.div
                  animate={{
                    scale: breathingActive
                      ? breathingPhase === "inhale"
                        ? 1.4
                        : breathingPhase === "hold"
                        ? 1.4
                        : 0.9
                      : 1,
                  }}
                  transition={{
                    duration: breathingPhase === "inhale" ? 4 : breathingPhase === "hold" ? 7 : 8,
                    ease: "easeInOut",
                  }}
                  className="h-32 w-32 rounded-full border border-tenadam-green-400 bg-white/40 dark:bg-tenadam-neutral-800/40 backdrop-blur-md flex flex-col items-center justify-center shadow-lg"
                >
                  <p className="text-xs uppercase tracking-widest text-tenadam-neutral-500">
                    {breathingActive
                      ? breathingPhase === "inhale"
                        ? t("breatheIn")
                        : breathingPhase === "hold"
                        ? t("hold")
                        : t("breatheOut")
                      : "4-7-8"}
                  </p>
                  <span className="text-3xl font-black text-tenadam-neutral-800 dark:text-tenadam-neutral-100 mt-1">
                    {breathingSeconds}s
                  </span>
                </motion.div>
              </div>

              {/* Timer Controls */}
              <div className="flex gap-3 mt-4">
                <button
                  onClick={toggleBreathing}
                  className="bg-tenadam-green-600 hover:bg-tenadam-green-700 text-white rounded-full px-5 py-2 text-sm font-semibold transition-colors"
                >
                  {breathingActive ? t("pauseTimer") : t("startTimer")}
                </button>
                <button
                  onClick={resetBreathing}
                  className="bg-tenadam-neutral-200 dark:bg-tenadam-neutral-800 hover:bg-tenadam-neutral-300 dark:hover:bg-tenadam-neutral-700 rounded-full px-5 py-2 text-sm font-semibold transition-colors"
                >
                  {t("resetTimer")}
                </button>
              </div>

              <div className="mt-6 text-xs text-tenadam-neutral-500 border-t pt-4 w-full text-center">
                {t("breathGoal")} <span className="font-bold text-tenadam-green-600">{Math.round(mindfulnessMinutes)} min</span>
              </div>
            </motion.div>

            {/* AI Recommendation Engine */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="glass-card p-6"
            >
              <div className="flex items-center gap-3 border-b border-tenadam-neutral-200 dark:border-tenadam-neutral-700 pb-4 mb-4">
                <Sparkles className="h-6 w-6 text-tenadam-green-500" />
                <div>
                  <h2 className="text-xl font-bold">{t("aiHeader")}</h2>
                  <p className="text-xs text-tenadam-neutral-500 mt-0.5">{t("aiDesc")}</p>
                </div>
              </div>

              <button
                onClick={generateAiInsights}
                disabled={aiLoading}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-tenadam-green-600 to-tenadam-green-700 text-white font-bold py-2.5 px-4 rounded-xl shadow-lg hover:from-tenadam-green-700 hover:to-tenadam-green-800 transition-colors disabled:opacity-60"
              >
                {aiLoading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                    />
                    {t("aiGenerating")}
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    {t("generateAiBtn")}
                  </>
                )}
              </button>

              <div className="mt-4 p-4 rounded-xl bg-tenadam-neutral-50 dark:bg-tenadam-neutral-800/40 border text-sm max-h-60 overflow-y-auto leading-relaxed">
                {aiOutput ? (
                  <p className="whitespace-pre-wrap">{aiOutput}</p>
                ) : (
                  <p className="text-xs text-tenadam-neutral-400 text-center italic py-4">
                    {t("aiPlaceholder")}
                  </p>
                )}
              </div>
            </motion.div>

            {/* Peer circles */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="glass-card p-6"
            >
              <div className="flex items-center gap-3 border-b border-tenadam-neutral-200 dark:border-tenadam-neutral-700 pb-4 mb-4">
                <Users className="h-6 w-6 text-tenadam-green-600" />
                <div>
                  <h2 className="text-xl font-bold">{t("communityHeader")}</h2>
                  <p className="text-xs text-tenadam-neutral-500 mt-0.5">{t("communityDesc")}</p>
                </div>
              </div>

              {/* Circle tabs */}
              <div className="flex gap-1 border-b border-tenadam-neutral-200 dark:border-tenadam-neutral-700 pb-2 mb-4 overflow-x-auto">
                {(
                  [
                    { id: "Addis", label: "Addis Ababa" },
                    { id: "Oromia", label: "Oromia" },
                    { id: "Tigray", label: "Tigray" },
                    { id: "Amhara", label: "Amhara" }
                  ] as { id: "Addis" | "Oromia" | "Tigray" | "Amhara"; label: string }[]
                ).map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveRegion(tab.id)}
                    className={`text-xs font-semibold rounded-lg px-3 py-1.5 transition-colors whitespace-nowrap ${
                      activeRegion === tab.id
                        ? "bg-tenadam-green-100 text-tenadam-green-700 dark:bg-tenadam-green-900/30 dark:text-tenadam-green-400"
                        : "text-tenadam-neutral-500 hover:bg-tenadam-neutral-100 dark:hover:bg-tenadam-neutral-800"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Circle feed list */}
              <div className="max-h-48 overflow-y-auto space-y-3 mb-4 pr-1">
                <AnimatePresence initial={false}>
                  {circleMessages[activeRegion].map((msg, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="p-3 rounded-lg bg-tenadam-neutral-50 dark:bg-tenadam-neutral-800/40 text-xs border"
                    >
                      <div className="flex justify-between items-center mb-1 text-tenadam-neutral-400 font-bold">
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" /> {msg.sender}
                        </span>
                        <span>{msg.time}</span>
                      </div>
                      <p className="text-tenadam-neutral-700 dark:text-tenadam-neutral-300 leading-relaxed">
                        {msg.text}
                      </p>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Chat Input form */}
              <form onSubmit={postToCircle} className="flex gap-2">
                <input
                  type="text"
                  placeholder={t("chatPlaceholder")}
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  className="text-xs flex-1 rounded-xl border border-tenadam-neutral-200 dark:border-tenadam-neutral-700 p-2.5 focus:outline-none focus:border-tenadam-green-500 bg-transparent"
                />
                <button
                  type="submit"
                  disabled={!chatInput.trim()}
                  className="bg-tenadam-green-600 hover:bg-tenadam-green-700 text-white rounded-xl px-3 py-2 text-xs font-bold transition-colors disabled:opacity-50 shrink-0"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </motion.div>

          </div>

        </div>

      </div>
    </main>
  );
}
