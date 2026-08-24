"use client";

import { Button } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import {
  Calendar,
  Clock,
  User,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Wind,
  Brain,
  Users,
  Stethoscope,
  Phone,
  Mail,
  MessageSquare,
  Star,
  Shield,
  ArrowRight,
} from "lucide-react";
import { useState, useMemo } from "react";
import { useLanguage } from "@/hooks/useLanguage";

const timeSlots = [
  "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM",
  "11:00 AM", "11:30 AM", "1:00 PM", "1:30 PM",
  "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM",
  "4:00 PM", "4:30 PM", "5:00 PM", "5:30 PM",
];

const generateCalendarDays = () => {
  const today = new Date();
  const days = [];
  for (let i = 0; i < 28; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    days.push({
      date: date.getDate(),
      day: date.toLocaleDateString("en-US", { weekday: "short" }),
      month: date.toLocaleDateString("en-US", { month: "short" }),
      full: date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" }),
      isToday: i === 0,
      isWeekend: date.getDay() === 0 || date.getDay() === 6,
      disabled: i === 0,
    });
  }
  return days;
};

export function AppointmentBooking() {
  const { t } = useLanguage();
  const b = t("booking") as Record<string, string>;

  const serviceCategories = [
    { id: "therapy", label: b.therapyLabel, icon: Brain, color: "from-purple-500 to-indigo-500", bg: "bg-purple-50 dark:bg-purple-900/20", borderColor: "border-purple-200 dark:border-purple-800", activeBg: "bg-purple-100 dark:bg-purple-900/40" },
    { id: "cbt", label: b.cbtLabel, icon: Stethoscope, color: "from-blue-500 to-cyan-500", bg: "bg-blue-50 dark:bg-blue-900/20", borderColor: "border-blue-200 dark:border-blue-800", activeBg: "bg-blue-100 dark:bg-blue-900/40" },
    { id: "breathing", label: b.breathingLabel, icon: Wind, color: "from-green-500 to-emerald-500", bg: "bg-green-50 dark:bg-green-900/20", borderColor: "border-green-200 dark:border-green-800", activeBg: "bg-green-100 dark:bg-green-900/40" },
    { id: "peer", label: b.peerLabel, icon: Users, color: "from-rose-500 to-pink-500", bg: "bg-rose-50 dark:bg-rose-900/20", borderColor: "border-rose-200 dark:border-rose-800", activeBg: "bg-rose-100 dark:bg-rose-900/40" },
  ];

  const servicesByCategory: Record<string, { id: string; name: string; duration: string; price: string; description: string }[]> = {
    therapy: [
      { id: "s1", name: b.individualTherapy, duration: "50 min", price: b.free, description: b.individualTherapyDesc },
      { id: "s2", name: b.couplesCounseling, duration: "60 min", price: b.free, description: b.couplesCounselingDesc },
      { id: "s3", name: b.traumaTherapy, duration: "60 min", price: b.free, description: b.traumaTherapyDesc },
      { id: "s4", name: b.familyTherapy, duration: "75 min", price: b.free, description: b.familyTherapyDesc },
    ],
    cbt: [
      { id: "s5", name: b.cbtAnxiety, duration: "45 min", price: b.free, description: b.cbtAnxietyDesc },
      { id: "s6", name: b.cbtDepression, duration: "45 min", price: b.free, description: b.cbtDepressionDesc },
      { id: "s7", name: b.stressCbt, duration: "40 min", price: b.free, description: b.stressCbtDesc },
      { id: "s8", name: b.sleepCbt, duration: "35 min", price: b.free, description: b.sleepCbtDesc },
    ],
    breathing: [
      { id: "s9", name: b.guidedBreathing, duration: "15 min", price: b.free, description: b.guidedBreathingDesc },
      { id: "s10", name: b.mindfulness, duration: "20 min", price: b.free, description: b.mindfulnessDesc },
      { id: "s11", name: b.boxBreathing, duration: "10 min", price: b.free, description: b.boxBreathingDesc },
      { id: "s12", name: b.eveningRelax, duration: "25 min", price: b.free, description: b.eveningRelaxDesc },
    ],
    peer: [
      { id: "s13", name: b.anonSupport, duration: "60 min", price: b.free, description: b.anonSupportDesc },
      { id: "s14", name: b.studentGroup, duration: "45 min", price: b.free, description: b.studentGroupDesc },
      { id: "s15", name: b.healthcareCircle, duration: "60 min", price: b.free, description: b.healthcareCircleDesc },
      { id: "s16", name: b.womenGroup, duration: "60 min", price: b.free, description: b.womenGroupDesc },
    ],
  };

  const providers = [
    { id: "p1", name: "Dr. Abebe Tadesse", specialty: b.providerSpec, rating: 5.0, reviews: 156, avatar: "AT", experience: "12 years" },
    { id: "p2", name: "Hanna Mekonnen", specialty: b.licensedTherapist, rating: 4.9, reviews: 203, avatar: "HM", experience: "8 years" },
    { id: "p3", name: "Yonas Girma", specialty: b.cbtSpecialist, rating: 4.8, reviews: 312, avatar: "YG", experience: "10 years" },
    { id: "p4", name: "Dr. Sara Hailu", specialty: b.traumaSpecialist, rating: 4.9, reviews: 178, avatar: "SH", experience: "15 years" },
    { id: "p5", name: "Tigist Worku", specialty: b.mindfulnessCoach, rating: 4.7, reviews: 245, avatar: "TW", experience: "7 years" },
  ];

  const steps = [
    { id: 1, label: b.stepService, icon: Sparkles },
    { id: 2, label: b.stepProvider, icon: User },
    { id: 3, label: b.stepSchedule, icon: Calendar },
    { id: 4, label: b.stepDetails, icon: MessageSquare },
    { id: 5, label: b.stepConfirm, icon: CheckCircle2 },
  ];
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [selectedProvider, setSelectedProvider] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    notes: "",
    isNewPatient: true,
    insurance: false,
    reminders: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const calendarDays = useMemo(() => generateCalendarDays(), []);

  const availableServices = selectedCategory ? servicesByCategory[selectedCategory] || [] : [];
  const activeService = availableServices.find((s) => s.id === selectedService);
  const activeProvider = providers.find((p) => p.id === selectedProvider);
  const activeCategory = serviceCategories.find((c) => c.id === selectedCategory);

  const canProceed = () => {
    switch (currentStep) {
      case 1: return selectedCategory && selectedService;
      case 2: return selectedProvider;
      case 3: return selectedDate && selectedTime;
      case 4: return formData.firstName && formData.lastName && formData.email && formData.phone;
      case 5: return true;
      default: return false;
    }
  };

  const nextStep = () => {
    if (currentStep < 5 && canProceed()) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsComplete(true);
    }, 2000);
  };

  const resetForm = () => {
    setCurrentStep(1);
    setSelectedCategory("");
    setSelectedService("");
    setSelectedProvider("");
    setSelectedDate("");
    setSelectedTime("");
    setFormData({ firstName: "", lastName: "", email: "", phone: "", notes: "", isNewPatient: true, insurance: false, reminders: true });
    setIsComplete(false);
  };

  if (isComplete) {
    return (
      <section id="appointment" className="section-padding" aria-labelledby="appointment-heading">
        <div className="container-wide px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-2xl"
          >
            <div className="glass-card overflow-hidden text-center">
              <div className="bg-gradient-to-br from-tenadam-green-500 to-tenadam-blue-500 px-8 py-12 text-white">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                  className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm"
                >
                  <CheckCircle2 className="h-10 w-10" />
                </motion.div>
                <h3 className="font-display text-3xl font-bold">{b.confirmed}</h3>
                <p className="mt-2 text-white/80">{b.journeyBegins}</p>
              </div>
              <div className="space-y-4 p-8 text-left">
                <div className="rounded-xl bg-tenadam-neutral-50 p-4 dark:bg-tenadam-neutral-800/50">
                  <p className="text-sm text-tenadam-neutral-500">{b.stepService}</p>
                  <p className="font-semibold">{activeService?.name}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-xl bg-tenadam-neutral-50 p-4 dark:bg-tenadam-neutral-800/50">
                    <p className="text-sm text-tenadam-neutral-500">{b.stepProvider}</p>
                    <p className="font-semibold">{activeProvider?.name}</p>
                  </div>
                  <div className="rounded-xl bg-tenadam-neutral-50 p-4 dark:bg-tenadam-neutral-800/50">
                    <p className="text-sm text-tenadam-neutral-500">{b.dateAndTime}</p>
                    <p className="font-semibold">{selectedDate}</p>
                    <p className="text-sm text-tenadam-neutral-500">{selectedTime}</p>
                  </div>
                </div>
                <div className="rounded-xl border border-tenadam-green-200 bg-tenadam-green-50 p-4 dark:border-tenadam-green-800 dark:bg-tenadam-green-900/20">
                  <div className="flex items-center gap-2 text-sm font-medium text-tenadam-green-700 dark:text-tenadam-green-300">
                    <Shield className="h-4 w-4" />
                    {b.confirmationSent} {formData.email}
                  </div>
                </div>
                <Button onClick={resetForm} variant="outline" className="mt-4 w-full">
                  {b.bookAnother}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="appointment" className="section-padding relative overflow-hidden" aria-labelledby="appointment-heading">
      {/* Background decorations */}
      <div className="absolute top-0 left-1/4 h-96 w-96 rounded-full bg-tenadam-green-400/10 blur-3xl dark:bg-tenadam-green-500/5" aria-hidden="true" />
      <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-tenadam-blue-400/10 blur-3xl dark:bg-tenadam-blue-500/5" aria-hidden="true" />

      <div className="container-wide relative px-4 sm:px-6 lg:px-8">
        <SectionHeader
          label={b.label}
          title={b.title}
          description={b.description}
        />

        <div className="mx-auto max-w-4xl">
          {/* Step Indicator */}
          <div className="mb-10">
            <div className="flex items-center justify-between">
              {steps.map((step, idx) => (
                <div key={step.id} className="flex flex-1 items-center">
                  <div className="flex flex-col items-center">
                    <motion.div
                      animate={{
                        scale: currentStep === step.id ? 1.1 : 1,
                        backgroundColor: currentStep >= step.id ? "rgb(22 163 74)" : "rgb(231 229 228)",
                      }}
                      className={cn(
                        "flex h-11 w-11 items-center justify-center rounded-full transition-colors",
                        currentStep >= step.id
                          ? "text-white shadow-lg shadow-tenadam-green-600/25"
                          : "text-tenadam-neutral-400 dark:bg-tenadam-neutral-700 dark:text-tenadam-neutral-500"
                      )}
                    >
                      {currentStep > step.id ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : (
                        <step.icon className="h-5 w-5" />
                      )}
                    </motion.div>
                    <span className={cn(
                      "mt-2 text-xs font-medium hidden sm:block",
                      currentStep >= step.id ? "text-tenadam-green-600 dark:text-tenadam-green-400" : "text-tenadam-neutral-400"
                    )}>
                      {step.label}
                    </span>
                  </div>
                  {idx < steps.length - 1 && (
                    <div className={cn(
                      "mx-2 h-0.5 flex-1 rounded transition-colors sm:mx-4",
                      currentStep > step.id ? "bg-tenadam-green-500" : "bg-tenadam-neutral-200 dark:bg-tenadam-neutral-700"
                    )} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Form Content */}
          <AnimatePresence mode="wait">
            {/* Step 1: Service Selection */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                <h3 id="appointment-heading" className="mb-2 text-xl font-semibold">{b.chooseService}</h3>
                <p className="mb-6 text-tenadam-neutral-500">{b.chooseServiceDesc}</p>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {serviceCategories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => { setSelectedCategory(cat.id); setSelectedService(""); }}
                      className={cn(
                        "flex items-center gap-4 rounded-2xl border-2 p-4 text-left transition-all hover:shadow-md",
                        selectedCategory === cat.id
                          ? `${cat.borderColor} ${cat.activeBg} shadow-md`
                          : "border-transparent glass hover:border-tenadam-neutral-200 dark:hover:border-tenadam-neutral-700"
                      )}
                    >
                      <div className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-xl", cat.bg)}>
                        <cat.icon className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="font-semibold">{cat.label}</p>
                        <p className="text-xs text-tenadam-neutral-500">{servicesByCategory[cat.id]?.length} {b.services}</p>
                      </div>
                    </button>
                  ))}
                </div>

                <AnimatePresence>
                  {selectedCategory && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-8"
                    >
                      <h4 className="mb-4 text-lg font-semibold">{b.selectService}</h4>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {availableServices.map((service) => (
                          <button
                            key={service.id}
                            onClick={() => setSelectedService(service.id)}
                            className={cn(
                              "rounded-2xl border-2 p-5 text-left transition-all hover:shadow-md",
                              selectedService === service.id
                                ? "border-tenadam-green-500 bg-tenadam-green-50 dark:bg-tenadam-green-900/20 shadow-md"
                                : "border-transparent glass hover:border-tenadam-neutral-200 dark:hover:border-tenadam-neutral-700"
                            )}
                          >
                            <div className="flex items-start justify-between">
                              <p className="font-semibold">{service.name}</p>
                              <span className="shrink-0 rounded-full bg-tenadam-green-100 px-3 py-1 text-sm font-bold text-tenadam-green-700 dark:bg-tenadam-green-900/40 dark:text-tenadam-green-300">
                                {service.price}
                              </span>
                            </div>
                            <p className="mt-1 text-sm text-tenadam-neutral-500">{service.description}</p>
                            <div className="mt-3 flex items-center gap-1 text-xs text-tenadam-neutral-400">
                              <Clock className="h-3.5 w-3.5" />
                              {service.duration}
                            </div>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}

            {/* Step 2: Provider Selection */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="mb-2 text-xl font-semibold">{b.chooseProvider}</h3>
                <p className="mb-6 text-tenadam-neutral-500">{b.chooseProviderDesc}</p>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {providers.map((provider) => (
                    <button
                      key={provider.id}
                      onClick={() => setSelectedProvider(provider.id)}
                      className={cn(
                        "rounded-2xl border-2 p-5 text-left transition-all hover:shadow-md",
                        selectedProvider === provider.id
                          ? "border-tenadam-green-500 bg-tenadam-green-50 dark:bg-tenadam-green-900/20 shadow-md"
                          : "border-transparent glass hover:border-tenadam-neutral-200 dark:hover:border-tenadam-neutral-700"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-tenadam-green-400 to-tenadam-blue-500 text-lg font-bold text-white">
                          {provider.avatar}
                        </div>
                        <div>
                          <p className="font-semibold">{provider.name}</p>
                          <p className="text-sm text-tenadam-neutral-500">{provider.specialty}</p>
                        </div>
                      </div>
                      <div className="mt-4 flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                          <span className="font-medium">{provider.rating}</span>
                          <span className="text-tenadam-neutral-400">({provider.reviews})</span>
                        </div>
                        <span className="text-tenadam-neutral-400">{provider.experience}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 3: Date & Time */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="mb-2 text-xl font-semibold">{b.pickDateTime}</h3>
                <p className="mb-6 text-tenadam-neutral-500">{b.pickDateTimeDesc}</p>

                {/* Calendar */}
                <div className="glass-card p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <h4 className="font-semibold">
                      {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-tenadam-neutral-500">
                      <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-tenadam-green-500" /> {b.available}</span>
                      <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-tenadam-neutral-300 dark:bg-tenadam-neutral-600" /> {b.unavailable}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-7 gap-2">
                    {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
                      <div key={d} className="text-center text-xs font-medium text-tenadam-neutral-400 pb-2">{d}</div>
                    ))}
                    {calendarDays.map((day, i) => (
                      <button
                        key={i}
                        disabled={day.disabled}
                        onClick={() => setSelectedDate(day.full)}
                        className={cn(
                          "flex h-10 items-center justify-center rounded-lg text-sm font-medium transition-all",
                          day.disabled
                            ? "cursor-not-allowed text-tenadam-neutral-300 dark:text-tenadam-neutral-600"
                            : selectedDate === day.full
                              ? "bg-tenadam-green-600 text-white shadow-lg shadow-tenadam-green-600/25"
                              : day.isWeekend
                                ? "text-tenadam-neutral-400 hover:bg-tenadam-neutral-100 dark:hover:bg-tenadam-neutral-800"
                                : "hover:bg-tenadam-green-50 hover:text-tenadam-green-700 dark:hover:bg-tenadam-green-900/20 dark:hover:text-tenadam-green-300"
                        )}
                      >
                        {day.date}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Time Slots */}
                <AnimatePresence>
                  {selectedDate && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-6"
                    >
                      <div className="glass-card p-6">
                        <h4 className="mb-4 font-semibold">{b.availableTimes} {selectedDate}</h4>
                        <div className="grid grid-cols-4 gap-2 sm:grid-cols-8">
                          {timeSlots.map((time) => (
                            <button
                              key={time}
                              onClick={() => setSelectedTime(time)}
                              className={cn(
                                "rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                                selectedTime === time
                                  ? "bg-tenadam-green-600 text-white shadow-lg shadow-tenadam-green-600/25"
                                  : "bg-tenadam-neutral-50 text-tenadam-neutral-700 hover:bg-tenadam-green-50 hover:text-tenadam-green-700 dark:bg-tenadam-neutral-800 dark:text-tenadam-neutral-300 dark:hover:bg-tenadam-green-900/20"
                              )}
                            >
                              {time}
                            </button>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}

            {/* Step 4: Personal Details */}
            {currentStep === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="mb-2 text-xl font-semibold">{b.yourInfo}</h3>
                <p className="mb-6 text-tenadam-neutral-500">{b.yourInfoDesc}</p>

                <div className="glass-card p-6 sm:p-8">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="firstName" className="mb-1.5 block text-sm font-medium">{b.firstName} *</label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-tenadam-neutral-400" />
                        <input
                          id="firstName"
                          type="text"
                          value={formData.firstName}
                          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                          placeholder="John"
                          className="w-full rounded-xl border border-tenadam-neutral-200 bg-white py-3 pl-11 pr-4 text-sm outline-none transition-all focus:border-tenadam-green-500 focus:ring-2 focus:ring-tenadam-green-500/20 dark:border-tenadam-neutral-700 dark:bg-tenadam-neutral-800"
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="lastName" className="mb-1.5 block text-sm font-medium">{b.lastName} *</label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-tenadam-neutral-400" />
                        <input
                          id="lastName"
                          type="text"
                          value={formData.lastName}
                          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                          placeholder="Doe"
                          className="w-full rounded-xl border border-tenadam-neutral-200 bg-white py-3 pl-11 pr-4 text-sm outline-none transition-all focus:border-tenadam-green-500 focus:ring-2 focus:ring-tenadam-green-500/20 dark:border-tenadam-neutral-700 dark:bg-tenadam-neutral-800"
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="email" className="mb-1.5 block text-sm font-medium">{b.email} *</label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-tenadam-neutral-400" />
                        <input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="john@example.com"
                          className="w-full rounded-xl border border-tenadam-neutral-200 bg-white py-3 pl-11 pr-4 text-sm outline-none transition-all focus:border-tenadam-green-500 focus:ring-2 focus:ring-tenadam-green-500/20 dark:border-tenadam-neutral-700 dark:bg-tenadam-neutral-800"
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="phone" className="mb-1.5 block text-sm font-medium">{b.phone} *</label>
                      <div className="relative">
                        <Phone className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-tenadam-neutral-400" />
                        <input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+1 (555) 000-0000"
                          className="w-full rounded-xl border border-tenadam-neutral-200 bg-white py-3 pl-11 pr-4 text-sm outline-none transition-all focus:border-tenadam-green-500 focus:ring-2 focus:ring-tenadam-green-500/20 dark:border-tenadam-neutral-700 dark:bg-tenadam-neutral-800"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-5">
                    <label htmlFor="notes" className="mb-1.5 block text-sm font-medium">{b.notes}</label>
                    <textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      rows={3}
                      placeholder={b.notesPlaceholder}
                      className="w-full rounded-xl border border-tenadam-neutral-200 bg-white py-3 px-4 text-sm outline-none transition-all focus:border-tenadam-green-500 focus:ring-2 focus:ring-tenadam-green-500/20 dark:border-tenadam-neutral-700 dark:bg-tenadam-neutral-800 resize-none"
                    />
                  </div>

                  <div className="mt-6 space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.isNewPatient}
                        onChange={(e) => setFormData({ ...formData, isNewPatient: e.target.checked })}
                        className="h-4 w-4 rounded border-tenadam-neutral-300 text-tenadam-green-600 focus:ring-tenadam-green-500"
                      />
                      <span className="text-sm">{b.newPatient}</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.insurance}
                        onChange={(e) => setFormData({ ...formData, insurance: e.target.checked })}
                        className="h-4 w-4 rounded border-tenadam-neutral-300 text-tenadam-green-600 focus:ring-tenadam-green-500"
                      />
                      <span className="text-sm">{b.useInsurance}</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.reminders}
                        onChange={(e) => setFormData({ ...formData, reminders: e.target.checked })}
                        className="h-4 w-4 rounded border-tenadam-neutral-300 text-tenadam-green-600 focus:ring-tenadam-green-500"
                      />
                      <span className="text-sm">{b.sendReminders}</span>
                    </label>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 5: Review & Confirm */}
            {currentStep === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="mb-2 text-xl font-semibold">{b.reviewConfirm}</h3>
                <p className="mb-6 text-tenadam-neutral-500">{b.reviewConfirmDesc}</p>

                <div className="glass-card overflow-hidden">
                  <div className="bg-gradient-to-r from-tenadam-green-500 to-tenadam-blue-500 p-6 text-white">
                    <div className="flex items-center gap-3">
                      <Sparkles className="h-6 w-6" />
                      <h4 className="text-lg font-bold">{b.appointmentSummary}</h4>
                    </div>
                  </div>
                  <div className="divide-y divide-tenadam-neutral-100 dark:divide-tenadam-neutral-800">
                    <div className="flex items-center gap-4 p-5">
                      <div className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-xl", activeCategory?.bg)}>
                        {activeCategory && <activeCategory.icon className="h-6 w-6" />}
                      </div>
                      <div>
                        <p className="text-sm text-tenadam-neutral-500">{b.stepService}</p>
                        <p className="font-semibold">{activeService?.name}</p>
                        <p className="text-xs text-tenadam-neutral-400">{activeService?.duration} · {activeService?.price}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-5">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-tenadam-green-400 to-tenadam-blue-500 text-sm font-bold text-white">
                        {activeProvider?.avatar}
                      </div>
                      <div>
                        <p className="text-sm text-tenadam-neutral-500">{b.stepProvider}</p>
                        <p className="font-semibold">{activeProvider?.name}</p>
                        <p className="text-xs text-tenadam-neutral-400">{activeProvider?.specialty} · {activeProvider?.experience}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-5">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-tenadam-blue-50 dark:bg-tenadam-blue-900/20">
                        <Calendar className="h-6 w-6 text-tenadam-blue-500" />
                      </div>
                      <div>
                        <p className="text-sm text-tenadam-neutral-500">{b.dateAndTime}</p>
                        <p className="font-semibold">{selectedDate}</p>
                        <p className="text-xs text-tenadam-neutral-400">{selectedTime}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-5">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-tenadam-green-50 dark:bg-tenadam-green-900/20">
                        <User className="h-6 w-6 text-tenadam-green-500" />
                      </div>
                      <div>
                        <p className="text-sm text-tenadam-neutral-500">{b.patient}</p>
                        <p className="font-semibold">{formData.firstName} {formData.lastName}</p>
                        <p className="text-xs text-tenadam-neutral-400">{formData.email} · {formData.phone}</p>
                      </div>
                    </div>
                    {formData.notes && (
                      <div className="flex items-start gap-4 p-5">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-900/20">
                          <MessageSquare className="h-6 w-6 text-amber-500" />
                        </div>
                        <div>
                          <p className="text-sm text-tenadam-neutral-500">{b.notes}</p>
                          <p className="text-sm">{formData.notes}</p>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="border-t border-tenadam-neutral-100 p-5 dark:border-tenadam-neutral-800">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-tenadam-neutral-500">{b.total}</span>
                      <span className="font-display text-2xl font-bold text-tenadam-green-600 dark:text-tenadam-green-400">
                        {activeService?.price}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-start gap-3 rounded-xl bg-tenadam-green-50 p-4 dark:bg-tenadam-green-900/20">
                  <Shield className="mt-0.5 h-5 w-5 shrink-0 text-tenadam-green-600 dark:text-tenadam-green-400" />
                  <div className="text-sm">
                    <p className="font-medium text-tenadam-green-700 dark:text-tenadam-green-300">{b.guarantee}</p>
                    <p className="text-tenadam-green-600/70 dark:text-tenadam-green-400/70">{b.guaranteeDesc}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="mt-8 flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={prevStep}
              disabled={currentStep === 1}
              className={cn(currentStep === 1 && "invisible")}
            >
              <ChevronLeft className="h-4 w-4" />
              {b.back}
            </Button>

            {currentStep < 5 ? (
              <Button onClick={nextStep} disabled={!canProceed()}>
                {b.continue}
                <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="min-w-[180px]"
              >
                {isSubmitting ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="h-5 w-5 rounded-full border-2 border-white border-t-transparent"
                    />
                    {b.confirming}
                  </>
                ) : (
                  <>
                    {b.confirmAppt}
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
