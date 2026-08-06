import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Privacy Policy — Carasta" };

export default function PrivacyPage() {
  const sections = [
    {
      title: "Information We Collect",
      body: "We collect information you provide directly (name, email, payment details) and data generated through your use of the platform (bids, listings, messages, Carmunity posts).",
    },
    {
      title: "How We Use Your Information",
      body: "We use your data to operate the auction platform, process payments, prevent fraud, send transaction notifications, personalise your experience, and improve our services.",
    },
    {
      title: "Sharing Your Information",
      body: "We share data with payment processors, logistics partners, and identity verification services. We do not sell your personal information to third parties for advertising purposes.",
    },
    {
      title: "Cookies",
      body: "We use essential and analytics cookies. You can manage preferences through your browser settings. Disabling cookies may affect some platform functionality.",
    },
    {
      title: "Data Retention",
      body: "We retain your account data for as long as your account is active. After deletion, we may retain anonymised transaction records for up to 7 years as required by law.",
    },
    {
      title: "Your Rights",
      body: "You have the right to access, correct, or delete your personal data. To make a request, contact privacy@carasta.com. We will respond within 30 days.",
    },
    {
      title: "Security",
      body: "We use industry-standard encryption and security practices to protect your data. Despite these measures, no system is completely secure.",
    },
    {
      title: "Contact",
      body: "For privacy questions, contact us at privacy@carasta.com or via our support center.",
    },
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 lg:px-6 py-12">
      <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
      <p className="text-sm text-muted-foreground mb-8">Last updated: July 2026</p>

      <div className="space-y-6">
        {sections.map((s) => (
          <section key={s.title}>
            <h2 className="text-base font-semibold mb-1">{s.title}</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{s.body}</p>
          </section>
        ))}
      </div>

      <div className="mt-10 pt-8 border-t text-sm text-muted-foreground">
        <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link>{" · "}
        <Link href="/support" className="text-primary hover:underline">Contact Us</Link>
      </div>
    </div>
  );
}
