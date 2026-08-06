"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Car, Gavel, Users, ChevronRight, Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/context/auth-context";

type Role = "buyer" | "seller" | "both";

const STEPS = ["Welcome", "Your Role", "Interests", "Done"] as const;

const INTERESTS = [
  "American Muscle", "European Classics", "JDM", "Air-cooled", "Pre-war",
  "Race Cars", "Trucks & Off-road", "Electric Classics", "Restorations", "Barn Finds",
];

export default function OnboardingPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [step, setStep] = useState(0);
  const [role, setRole] = useState<Role | null>(null);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const next = () => {
    if (step < STEPS.length - 1) setStep(step + 1);
    else router.push("/");
  };

  const toggleInterest = (i: string) =>
    setSelectedInterests((prev) =>
      prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]
    );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      {/* Progress dots */}
      <div className="flex gap-2 mb-10">
        {STEPS.map((s, i) => (
          <div
            key={s}
            className={cn(
              "h-2 rounded-full transition-all",
              i === step ? "w-8 bg-primary" : i < step ? "w-2 bg-primary/50" : "w-2 bg-muted"
            )}
          />
        ))}
      </div>

      <div className="w-full max-w-md">
        {/* Step 0 — Welcome */}
        {step === 0 && (
          <div className="text-center space-y-6">
            <div className="h-20 w-20 rounded-full bg-primary flex items-center justify-center mx-auto">
              <Car className="h-10 w-10 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Welcome{user ? `, ${user.displayName.split(" ")[0]}` : ""}!
              </h1>
              <p className="text-muted-foreground">
                You&apos;re joining a community of automotive enthusiasts. Let&apos;s get you set up in just a moment.
              </p>
            </div>
            <Button variant="bid" size="lg" className="w-full gap-1.5" onClick={next}>
              Get Started <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Step 1 — Role */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-1">What brings you to Carasta?</h2>
              <p className="text-muted-foreground text-sm">Choose the option that best describes you.</p>
            </div>
            <div className="space-y-3">
              {([
                { value: "buyer", icon: Gavel, title: "I want to buy", desc: "Bid on live auctions and win classic cars" },
                { value: "seller", icon: Car, title: "I want to sell", desc: "List my vehicle and reach serious collectors" },
                { value: "both", icon: Users, title: "Both", desc: "Browse auctions and list my vehicles" },
              ] as const).map(({ value, icon: Icon, title, desc }) => (
                <button
                  key={value}
                  onClick={() => setRole(value)}
                  className={cn(
                    "w-full flex items-center gap-4 p-4 rounded-xl border text-left transition-all",
                    role === value ? "border-primary bg-primary/5" : "hover:border-primary/50"
                  )}
                >
                  <div className={cn(
                    "h-10 w-10 rounded-lg flex items-center justify-center shrink-0",
                    role === value ? "bg-primary text-white" : "bg-muted text-muted-foreground"
                  )}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{title}</p>
                    <p className="text-xs text-muted-foreground">{desc}</p>
                  </div>
                  {role === value && <Check className="h-4 w-4 text-primary" />}
                </button>
              ))}
            </div>
            <Button variant="bid" size="lg" className="w-full" onClick={next} disabled={!role}>
              Continue <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Step 2 — Interests */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-1">What are you into?</h2>
              <p className="text-muted-foreground text-sm">We&apos;ll personalise your feed. Pick as many as you like.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {INTERESTS.map((interest) => (
                <button
                  key={interest}
                  onClick={() => toggleInterest(interest)}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium border transition-all",
                    selectedInterests.includes(interest)
                      ? "bg-primary text-primary-foreground border-primary"
                      : "border-border text-muted-foreground hover:border-primary/50"
                  )}
                >
                  {interest}
                </button>
              ))}
            </div>
            <Button variant="bid" size="lg" className="w-full" onClick={next}>
              Continue <ChevronRight className="h-4 w-4" />
            </Button>
            <button className="w-full text-sm text-muted-foreground hover:text-foreground" onClick={next}>
              Skip for now
            </button>
          </div>
        )}

        {/* Step 3 — Done */}
        {step === 3 && (
          <div className="text-center space-y-6">
            <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center mx-auto">
              <Check className="h-10 w-10 text-green-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">You&apos;re all set!</h2>
              <p className="text-muted-foreground">
                Your Carasta profile is ready. Head to the auctions to find your next dream car.
              </p>
            </div>
            <div className="space-y-3">
              <Link href="/auctions" className="block">
                <Button variant="bid" size="lg" className="w-full gap-1.5">
                  <Gavel className="h-4 w-4" /> Browse Auctions
                </Button>
              </Link>
              <Link href="/carmunity" className="block">
                <Button variant="outline" size="lg" className="w-full gap-1.5">
                  <Users className="h-4 w-4" /> Join Carmunity
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
