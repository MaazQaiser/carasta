import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Terms of Service — Carasta" };

export default function TermsPage() {
  const sections = [
    {
      title: "1. Acceptance of Terms",
      body: "By accessing or using Carasta, you agree to be bound by these Terms of Service. If you do not agree, please do not use the platform.",
    },
    {
      title: "2. Eligibility",
      body: "You must be at least 18 years old and legally able to enter contracts to use Carasta. By creating an account, you represent that you meet these requirements.",
    },
    {
      title: "3. Auction Rules",
      body: "All bids are binding. Once placed, a bid cannot be retracted unless the auction is cancelled by Carasta. Winning a reserve-met auction obligates the buyer to complete the purchase.",
    },
    {
      title: "4. Listing Standards",
      body: "Sellers must accurately represent their vehicles. Misrepresentation, hidden damage, or fraudulent VIN information will result in immediate account suspension and possible legal action.",
    },
    {
      title: "5. Payments",
      body: "Payment is due within 48 hours of auction close. Failure to pay may result in account suspension and forfeiture of any deposits made.",
    },
    {
      title: "6. Buyer Protection",
      body: "Carasta provides buyer protection on all completed transactions. If a vehicle is materially misrepresented, contact support within 7 days of delivery.",
    },
    {
      title: "7. Carmunity Conduct",
      body: "Users must follow community guidelines when posting in Carmunity. Hate speech, spam, or illegal content will be removed and may result in account termination.",
    },
    {
      title: "8. Limitation of Liability",
      body: "Carasta is not liable for any indirect, incidental, or consequential damages arising from use of the platform. Our liability is limited to the fees paid in the 12 months prior to the claim.",
    },
    {
      title: "9. Changes to Terms",
      body: "We may update these terms at any time. Continued use of the platform after updates constitutes acceptance of the revised terms.",
    },
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 lg:px-6 py-12">
      <h1 className="text-3xl font-bold mb-2">Terms of Service</h1>
      <p className="text-sm text-muted-foreground mb-8">Last updated: July 2026</p>

      <div className="prose prose-sm max-w-none space-y-6">
        {sections.map((s) => (
          <section key={s.title}>
            <h2 className="text-base font-semibold mb-1">{s.title}</h2>
            <p className="text-muted-foreground text-sm leading-relaxed">{s.body}</p>
          </section>
        ))}
      </div>

      <div className="mt-10 pt-8 border-t text-sm text-muted-foreground">
        Questions? <Link href="/support" className="text-primary hover:underline">Contact us</Link> or view our{" "}
        <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.
      </div>
    </div>
  );
}
