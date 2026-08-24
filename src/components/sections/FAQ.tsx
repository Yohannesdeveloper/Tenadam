"use client";

import { SectionHeader } from "@/components/ui/SectionHeader";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, HelpCircle, MessageCircle, Mail, Phone } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";

export function FAQ() {
  const { t } = useLanguage();
  const fq = t("faq") as Record<string, string>;

  const faqCategories = [
    { id: "general", label: fq.general },
    { id: "booking", label: fq.bookingCat },
    { id: "features", label: fq.featuresCat },
    { id: "billing", label: fq.billing },
  ];

  const faqs = [
    { category: "general", question: fq.q1, answer: fq.a1 },
    { category: "general", question: fq.q2, answer: fq.a2 },
    { category: "general", question: fq.q3, answer: fq.a3 },
    { category: "booking", question: fq.q4, answer: fq.a4 },
    { category: "booking", question: fq.q5, answer: fq.a5 },
    { category: "booking", question: fq.q6, answer: fq.a6 },
    { category: "features", question: fq.q7, answer: fq.a7 },
    { category: "features", question: fq.q8, answer: fq.a8 },
    { category: "features", question: fq.q9, answer: fq.a9 },
    { category: "billing", question: fq.q10, answer: fq.a10 },
    { category: "billing", question: fq.q11, answer: fq.a11 },
    { category: "billing", question: fq.q12, answer: fq.a12 },
  ];
  const [activeCategory, setActiveCategory] = useState("general");
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const filteredFaqs = faqs.filter((f) => f.category === activeCategory);

  return (
    <section id="faq" className="section-padding" aria-labelledby="faq-heading">
      <div className="container-wide">
        <SectionHeader
          label={fq.label}
          title={fq.title}
          description={fq.description}
        />

        <div className="mx-auto max-w-3xl">
          {/* Category Tabs */}
          <div className="mb-8 flex flex-wrap justify-center gap-2">
            {faqCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => { setActiveCategory(cat.id); setOpenIndex(0); }}
                className={cn(
                  "rounded-full px-5 py-2.5 text-sm font-medium transition-all",
                  activeCategory === cat.id
                    ? "bg-tenadam-green-600 text-white shadow-lg shadow-tenadam-green-600/25"
                    : "glass text-tenadam-neutral-600 hover:bg-tenadam-neutral-100 dark:text-tenadam-neutral-400 dark:hover:bg-tenadam-neutral-800"
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* FAQ Accordion */}
          <div className="space-y-3">
            {filteredFaqs.map((faq, index) => (
              <motion.div
                key={faq.question}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="glass-card overflow-hidden"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="flex w-full items-center justify-between p-5 text-left"
                  aria-expanded={openIndex === index}
                >
                  <div className="flex items-center gap-3 pr-4">
                    <HelpCircle className="h-5 w-5 shrink-0 text-tenadam-green-500" />
                    <span className="font-semibold">{faq.question}</span>
                  </div>
                  <ChevronDown
                    className={cn(
                      "h-5 w-5 shrink-0 text-tenadam-neutral-400 transition-transform duration-300",
                      openIndex === index && "rotate-180 text-tenadam-green-500"
                    )}
                  />
                </button>
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-tenadam-neutral-100 px-5 pb-5 pt-4 dark:border-tenadam-neutral-800">
                        <p className="text-tenadam-neutral-600 dark:text-tenadam-neutral-400 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

          {/* Support CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 glass-card p-8 text-center"
          >
            <h3 className="text-xl font-bold">{fq.stillQuestions}</h3>
            <p className="mt-2 text-tenadam-neutral-500">{fq.supportHelp}</p>
            <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a href="#" className="inline-flex items-center gap-2 rounded-full bg-tenadam-green-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-tenadam-green-700">
                <MessageCircle className="h-4 w-4" />
                {fq.liveChat}
              </a>
              <a href="#" className="inline-flex items-center gap-2 rounded-full border border-tenadam-neutral-200 px-6 py-3 text-sm font-medium transition-colors hover:bg-tenadam-neutral-50 dark:border-tenadam-neutral-700 dark:hover:bg-tenadam-neutral-800">
                <Mail className="h-4 w-4" />
                {fq.emailSupport}
              </a>
              <a href="#" className="inline-flex items-center gap-2 rounded-full border border-tenadam-neutral-200 px-6 py-3 text-sm font-medium transition-colors hover:bg-tenadam-neutral-50 dark:border-tenadam-neutral-700 dark:hover:bg-tenadam-neutral-800">
                <Phone className="h-4 w-4" />
                {fq.callUs}
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
