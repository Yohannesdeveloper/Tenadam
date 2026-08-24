// src/components/ui/ChatBot.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Loader2, Send, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/hooks/useLanguage";

interface Message {
  role: "user" | "assistant";
  content: string;
}

// Simple typing indicator with animated dots
function TypingDots() {
  return (
    <div className="flex space-x-1 items-center" aria-label="Assistant is typing">
      <span className="block w-2 h-2 bg-tenadam-neutral-500 rounded-full animate-bounce" style={{ animationDelay: "0s" }} />
      <span className="block w-2 h-2 bg-tenadam-neutral-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
      <span className="block w-2 h-2 bg-tenadam-neutral-500 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }} />
    </div>
  );
}

export function ChatBot() {
  const { language } = useLanguage();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // Close panel when clicking outside and insert welcome message
  useEffect(() => {
    if (open && messages.length === 0) {
      let welcome = "Hello! I'm Tenadam AI, your Tenadam companion. How can I help you today?";
      if (language === "am") {
        welcome = "ጤና ይስጥልኝ! እኔ ቴናዳም የጤና ረዳትዎ ነኝ። ዛሬ እንዴት ልረዳዎ እችላለሁ?";
      } else if (language === "om") {
        welcome = "Akkam! Ani gargaara kee Tenadam AI dha. Har'a akkamittin si gargaaruu danda'a?";
      } else if (language === "ti") {
        welcome = "ሰላም! ኣነ ቴናዳም ሓጋዚ ጥዕናኹም እየ። ሎሚ ከመይ ገይረ ክሕግዘኩም እኽእል?";
      }
      setMessages([{ role: "assistant", content: welcome }]);
    }
    const handleClick = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open, messages, language]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg: Message = { role: "user", content: input };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      // Call our server-side API route (keeps the OpenAI key secure on the server)
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages,
          language: language,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `API error ${response.status}`);
      }

      if (!response.body) throw new Error("No response body");

      const decoder = new TextDecoder();
      let assistantContent = "";
      const reader = response.body.getReader();
      const previousCount = updatedMessages.length;
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
            assistantContent += delta;
            setMessages((prev) => [
              ...prev.slice(0, previousCount),
              { role: "assistant", content: assistantContent },
            ]);
          }
        } catch { }
      };

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          if (buffer.trim()) {
            processLine(buffer);
          }
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          processLine(line);
        }
      }

      // If streaming produced nothing, add a fallback
      if (!assistantContent.trim()) {
        setMessages((prev) => [
          ...prev.slice(0, previousCount),
          { role: "assistant", content: "I received your message but couldn't generate a response. Please try again." },
        ]);
      }
    } catch (err) {
      console.error("Chat error:", err);
      const errMsg = err instanceof Error ? err.message : String(err);
      let content = "Sorry, I couldn't connect to the AI service. Please check your API key and try again.";
      if (errMsg.includes("429")) {
        content = "Sorry, it looks like your OpenAI API key is out of credits or rate-limited (Error 429). Please verify your account billing balance at platform.openai.com.";
      } else if (errMsg.includes("401")) {
        content = "Sorry, it looks like your OpenAI API key is unauthorized or invalid (Error 401). Please check your key configuration.";
      }
      setMessages((prev) => [...prev, { role: "assistant", content }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Floating button with gradient and subtle hover */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-tenadam-green-500 to-tenadam-green-700 text-white shadow-lg hover:scale-105 focus:outline-none"
        aria-label="Open chat"
      >
        {open ? <X className="h-7 w-7" /> : <Send className="h-7 w-7" />}
      </button>

      {/* Sliding panel with glass‑morphism */}
      <AnimatePresence>
        {open && (
          <motion.div
            ref={panelRef}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-24 right-6 md:right-8 z-40 flex h-[500px] w-[360px] max-w-[calc(100vw-3rem)] flex-col rounded-2xl bg-white/30 backdrop-blur-xl shadow-2xl dark:bg-tenadam-neutral-900/60"
          >
            <div
              className="flex flex-col h-full"
            >
              <div className="flex items-center justify-between border-b border-tenadam-neutral-200 dark:border-tenadam-neutral-700 p-3">
                <h2 className="text-lg font-medium text-tenadam-neutral-800 dark:text-tenadam-neutral-100">
                  AI Assistant
                </h2>
                <button onClick={() => setOpen(false)} className="text-tenadam-neutral-500 hover:text-tenadam-neutral-700">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-3 space-y-3">
                {messages.map((msg, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: idx * 0.05 }}
                    className={cn(
                      "rounded-xl p-3 max-w-[85%]",
                      msg.role === "user"
                        ? "ml-auto bg-tenadam-green-500 text-white"
                        : "mr-auto bg-tenadam-neutral-200 text-tenadam-neutral-900 dark:bg-tenadam-neutral-800 dark:text-tenadam-neutral-100"
                    )}
                  >
                    <p className="whitespace-pre-wrap text-sm">{msg.content}</p>
                  </motion.div>
                ))}
                {loading && (
                  <div className="flex items-center space-x-2 p-2">
                    <Loader2 className="h-4 w-4 animate-spin text-tenadam-neutral-500" />
                    <TypingDots />
                  </div>
                )}
              </div>
              <div className="border-t p-3">
                <textarea
                  rows={1}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKey}
                  placeholder="Type a message..."
                  className="w-full resize-none rounded border border-tenadam-neutral-200 p-2 focus:outline-none focus:border-tenadam-green-500 dark:bg-tenadam-neutral-800 dark:border-tenadam-neutral-600"
                  disabled={loading}
                />
                <button
                  onClick={sendMessage}
                  disabled={loading || !input.trim()}
                  className="mt-2 w-full rounded bg-tenadam-green-600 py-2 text-white hover:bg-tenadam-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Send
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
