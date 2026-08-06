"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronRight, ChevronLeft, Check, Car, Camera, ClipboardList, BookOpen, DollarSign, Clock, Eye, Send, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const STEPS = [
  { id: 1, label: "Vehicle Info", icon: Car },
  { id: 2, label: "Photos", icon: Camera },
  { id: 3, label: "Condition", icon: ClipboardList },
  { id: 4, label: "Story", icon: BookOpen },
  { id: 5, label: "Reserve Price", icon: DollarSign },
  { id: 6, label: "Duration", icon: Clock },
  { id: 7, label: "Review", icon: Eye },
  { id: 8, label: "Publish", icon: Send },
];

const MAKES = ["BMW", "Ferrari", "Ford", "Honda", "Lamborghini", "McLaren", "Mercedes-Benz", "Nissan", "Porsche", "Tesla", "Toyota", "Audi", "Dodge"];
const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 50 }, (_, i) => String(CURRENT_YEAR - i));
const CONDITIONS = ["new", "like-new", "excellent", "good", "fair", "poor"];
const DURATIONS = [
  { value: "3", label: "3 days" },
  { value: "5", label: "5 days" },
  { value: "7", label: "7 days (recommended)" },
  { value: "10", label: "10 days" },
  { value: "14", label: "14 days" },
];

export function SellWizardClient() {
  const [step, setStep] = useState(1);
  const [published, setPublished] = useState(false);

  const [formData, setFormData] = useState({
    make: "",
    model: "",
    year: "",
    trim: "",
    vin: "",
    mileage: "",
    fuelType: "",
    transmission: "",
    driveType: "",
    exteriorColor: "",
    interiorColor: "",
    photos: [] as string[],
    condition: "",
    hasInspection: false,
    description: "",
    story: "",
    features: "",
    reservePrice: "",
    startingBid: "",
    duration: "7",
  });

  const update = (key: string, value: string | boolean) => setFormData((p) => ({ ...p, [key]: value }));

  const next = () => { if (step < 8) setStep((s) => s + 1); };
  const back = () => { if (step > 1) setStep((s) => s - 1); };

  if (published) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 flex flex-col items-center text-center">
        <div className="h-20 w-20 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center mb-6">
          <Check className="h-10 w-10 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold mb-3">Listing Published!</h1>
        <p className="text-muted-foreground mb-8">Your vehicle is now live on Carasta. Bidders will be notified and the auction countdown has started.</p>
        <div className="flex gap-3">
          <Link href="/sell/listings"><Button variant="outline">Manage Listings</Button></Link>
          <Link href="/auctions"><Button>View Auctions</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 lg:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">List Your Vehicle</h1>
        <p className="text-muted-foreground">Complete all steps to publish your auction listing</p>
      </div>

      {/* Progress */}
      <div className="mb-8 overflow-x-auto scrollbar-hide">
        <div className="flex gap-2 min-w-max pb-2">
          {STEPS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => id < step && setStep(id)}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-full text-xs font-medium transition-all border",
                id === step ? "bg-primary text-primary-foreground border-primary" :
                id < step ? "bg-muted text-muted-foreground border-transparent cursor-pointer hover:border-primary/50" :
                "text-muted-foreground/50 border-transparent cursor-not-allowed"
              )}
            >
              {id < step ? <Check className="h-3.5 w-3.5" /> : <Icon className="h-3.5 w-3.5" />}
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Step content */}
      <div className="rounded-2xl border bg-card p-6 mb-6">
        {step === 1 && (
          <div className="space-y-5">
            <h2 className="text-xl font-semibold">Vehicle Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Make *</label>
                <Select value={formData.make} onValueChange={(v) => update("make", v)}>
                  <SelectTrigger><SelectValue placeholder="Select make" /></SelectTrigger>
                  <SelectContent>{MAKES.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Model *</label>
                <Input value={formData.model} onChange={(e) => update("model", e.target.value)} placeholder="e.g. 911 Carrera" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Year *</label>
                <Select value={formData.year} onValueChange={(v) => update("year", v)}>
                  <SelectTrigger><SelectValue placeholder="Select year" /></SelectTrigger>
                  <SelectContent>{YEARS.map((y) => <SelectItem key={y} value={y}>{y}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Trim</label>
                <Input value={formData.trim} onChange={(e) => update("trim", e.target.value)} placeholder="e.g. S, GT3, Competition" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Mileage *</label>
                <Input value={formData.mileage} onChange={(e) => update("mileage", e.target.value)} placeholder="e.g. 24500" type="number" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">VIN</label>
                <Input value={formData.vin} onChange={(e) => update("vin", e.target.value)} placeholder="17-digit VIN" maxLength={17} />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Fuel Type *</label>
                <Select value={formData.fuelType} onValueChange={(v) => update("fuelType", v)}>
                  <SelectTrigger><SelectValue placeholder="Select fuel" /></SelectTrigger>
                  <SelectContent>
                    {["gasoline", "diesel", "electric", "hybrid"].map((f) => <SelectItem key={f} value={f} className="capitalize">{f}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Transmission *</label>
                <Select value={formData.transmission} onValueChange={(v) => update("transmission", v)}>
                  <SelectTrigger><SelectValue placeholder="Select transmission" /></SelectTrigger>
                  <SelectContent>
                    {["automatic", "manual", "semi-automatic", "cvt"].map((t) => <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Exterior Color *</label>
                <Input value={formData.exteriorColor} onChange={(e) => update("exteriorColor", e.target.value)} placeholder="e.g. Guards Red" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Interior Color *</label>
                <Input value={formData.interiorColor} onChange={(e) => update("interiorColor", e.target.value)} placeholder="e.g. Black leather" />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <h2 className="text-xl font-semibold">Photos</h2>
            <p className="text-sm text-muted-foreground">Upload at least 10 high-quality photos. Include exterior, interior, engine bay, and any flaws.</p>
            <div className="border-2 border-dashed rounded-2xl p-12 text-center bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer">
              <Upload className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
              <p className="font-medium mb-1">Drag and drop photos here</p>
              <p className="text-sm text-muted-foreground mb-4">or click to browse files</p>
              <Button variant="outline" size="sm">Browse Files</Button>
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
              {["https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=400&auto=format&fit=crop"].map((url, i) => (
                <div key={i} className="relative aspect-square rounded-xl overflow-hidden border bg-muted">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt={`photo ${i + 1}`} className="h-full w-full object-cover" />
                  <button className="absolute top-1 right-1 h-5 w-5 flex items-center justify-center rounded-full bg-black/50 text-white hover:bg-red-500">
                    <X className="h-3 w-3" />
                  </button>
                  {i === 0 && <Badge className="absolute bottom-1 left-1 text-[9px] h-4 px-1">Cover</Badge>}
                </div>
              ))}
              <div className="aspect-square rounded-xl border-2 border-dashed flex items-center justify-center cursor-pointer hover:border-primary transition-colors bg-muted/30">
                <Upload className="h-5 w-5 text-muted-foreground" />
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5">
            <h2 className="text-xl font-semibold">Vehicle Condition</h2>
            <div>
              <label className="text-sm font-medium mb-3 block">Overall Condition *</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {CONDITIONS.map((c) => (
                  <button
                    key={c}
                    onClick={() => update("condition", c)}
                    className={cn(
                      "p-4 rounded-xl border text-sm font-medium capitalize transition-all text-left",
                      formData.condition === c ? "border-primary bg-primary/5 text-primary" : "hover:border-primary/50"
                    )}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Description *</label>
              <textarea
                className="flex min-h-32 w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
                placeholder="Describe the vehicle's condition, any modifications, or known issues..."
                value={formData.description}
                onChange={(e) => update("description", e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Notable Features (comma-separated)</label>
              <Input value={formData.features} onChange={(e) => update("features", e.target.value)} placeholder="e.g. Sport Chrono, BOSE Audio, Heated Seats" />
            </div>
            <div className="flex items-center gap-3 p-4 rounded-xl border bg-muted/30">
              <input type="checkbox" id="inspection" checked={formData.hasInspection} onChange={(e) => update("hasInspection", e.target.checked)} className="h-4 w-4" />
              <label htmlFor="inspection" className="text-sm cursor-pointer">
                <span className="font-medium">I have a third-party inspection report</span>
                <span className="text-muted-foreground ml-1">(increases buyer trust and bids)</span>
              </label>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-5">
            <h2 className="text-xl font-semibold">Your Vehicle&apos;s Story</h2>
            <p className="text-sm text-muted-foreground">Tell potential buyers about this car&apos;s history, why you&apos;re selling, and what makes it special. The best listings tell a compelling story.</p>
            <textarea
              className="flex min-h-48 w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
              placeholder="Share the history of this vehicle, how you came to own it, memorable experiences, modifications, maintenance you've performed, and why it's time to find it a new home..."
              value={formData.story}
              onChange={(e) => update("story", e.target.value)}
            />
            <p className="text-xs text-muted-foreground">{formData.story.length} characters · Aim for 200–600 characters</p>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-5">
            <h2 className="text-xl font-semibold">Pricing</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Starting Bid *</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                  <Input value={formData.startingBid} onChange={(e) => update("startingBid", e.target.value)} placeholder="50000" type="number" className="pl-7" />
                </div>
                <p className="text-xs text-muted-foreground mt-1">Lower starting bids attract more early interest</p>
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Reserve Price</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                  <Input value={formData.reservePrice} onChange={(e) => update("reservePrice", e.target.value)} placeholder="Optional minimum" type="number" className="pl-7" />
                </div>
                <p className="text-xs text-muted-foreground mt-1">Hidden from bidders. Leave blank for no reserve.</p>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-muted/50 text-sm">
              <p className="font-medium mb-1">Carasta fees</p>
              <p className="text-muted-foreground">Listing is free. Carasta charges 4.5% of final sale price on successful auction.</p>
            </div>
          </div>
        )}

        {step === 6 && (
          <div className="space-y-5">
            <h2 className="text-xl font-semibold">Auction Duration</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {DURATIONS.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => update("duration", value)}
                  className={cn(
                    "p-4 rounded-xl border text-sm text-left transition-all",
                    formData.duration === value ? "border-primary bg-primary/5 text-primary font-medium" : "hover:border-primary/50"
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
            <p className="text-sm text-muted-foreground">7-day auctions statistically achieve the highest final prices.</p>
          </div>
        )}

        {step === 7 && (
          <div className="space-y-5">
            <h2 className="text-xl font-semibold">Review Your Listing</h2>
            <div className="rounded-xl border overflow-hidden">
              {[
                ["Vehicle", `${formData.year} ${formData.make} ${formData.model}`.trim() || "Not set"],
                ["Mileage", formData.mileage ? `${parseInt(formData.mileage).toLocaleString()} mi` : "Not set"],
                ["Condition", formData.condition || "Not set"],
                ["Starting Bid", formData.startingBid ? `$${parseInt(formData.startingBid).toLocaleString()}` : "Not set"],
                ["Reserve Price", formData.reservePrice ? `$${parseInt(formData.reservePrice).toLocaleString()}` : "No reserve"],
                ["Duration", DURATIONS.find((d) => d.value === formData.duration)?.label ?? "7 days"],
                ["Photos", "2 uploaded"],
                ["Inspection Report", formData.hasInspection ? "Yes" : "No"],
              ].map(([label, value], i) => (
                <div key={label} className={cn("flex justify-between px-4 py-3 text-sm", i % 2 === 0 ? "bg-card" : "bg-muted/30")}>
                  <span className="text-muted-foreground">{label}</span>
                  <span className="font-medium">{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 8 && (
          <div className="space-y-5 text-center">
            <h2 className="text-xl font-semibold">Ready to Publish</h2>
            <p className="text-muted-foreground">Once published, your auction will go live immediately and bidders will be notified.</p>
            <div className="flex flex-col items-center gap-4 py-6">
              <Button variant="bid" size="xl" onClick={() => setPublished(true)} className="w-full max-w-sm">
                Publish Auction Now
              </Button>
              <Button variant="ghost" size="sm">Save as Draft</Button>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={back} disabled={step === 1} className="gap-1.5">
          <ChevronLeft className="h-4 w-4" /> Back
        </Button>
        <span className="text-sm text-muted-foreground">Step {step} of 8</span>
        {step < 8 ? (
          <Button onClick={next} className="gap-1.5">
            Next <ChevronRight className="h-4 w-4" />
          </Button>
        ) : null}
      </div>
    </div>
  );
}
