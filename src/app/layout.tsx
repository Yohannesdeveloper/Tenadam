import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const interDisplay = Inter({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
   title: "Tenadam — AI-Powered Well-being for Ethiopia",
  description:
    "Tenadam — an AI-powered Tenadam companion offering mood tracking, guided breathing exercises, and culturally adapted CBT tips in English, Amharic, Afaan Oromoo, and Tigrigna.",
  keywords: [
     "Tenadam Ethiopia",
    "mood tracking",
    "CBT tips",
    "AI mental health",
    "breathing exercises",
    "Ethiopian mental health",
    "tenadam",
    "Tenadam app",
  ],
  authors: [{ name: "Tenadam, Inc." }],
  openGraph: {
     title: "Tenadam — AI-Powered Well-being for Ethiopia",
    description:
      "An AI-powered Tenadam companion that offers mood tracking, guided breathing exercises, and culturally adapted CBT tips — in English, Amharic, Afaan Oromoo, and Tigrigna.",
    type: "website",
    locale: "en_US",
    siteName: "Tenadam",
  },
  twitter: {
    card: "summary_large_image",
     title: "Tenadam — AI-Powered Well-being for Ethiopia",
    description:
      "An AI-powered Tenadam companion for Ethiopians. Mood tracking, breathing exercises, and CBT tips in English, Amharic, Afaan Oromoo, and Tigrigna.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('tenadam-theme');
                  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (theme === 'dark' || (!theme && prefersDark)) {
                    document.documentElement.classList.add('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className={`${inter.variable} ${interDisplay.variable} font-sans`}>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-tenadam-green-600 focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
