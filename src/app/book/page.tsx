import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AppointmentBooking } from "@/components/sections/AppointmentBooking";
import { Providers } from "@/components/Providers";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Book a Session – Tenadam",
  description:
    "Schedule a therapy session, CBT session, breathing exercise, or peer support group with a certified Tenadam provider. Free, confidential, and multilingual.",
};

export default function BookPage() {
  return (
    <Providers>
      <Navbar />
      <main id="main-content" className="pt-20">
        <AppointmentBooking />
      </main>
      <Footer />
    </Providers>
  );
}
