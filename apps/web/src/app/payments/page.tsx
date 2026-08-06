"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CreditCard, Plus, Trash2, Shield, CheckCircle, Trophy, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn, formatPrice } from "@/lib/utils";

const MOCK_METHODS = [
  { id: "pm1", brand: "Visa", last4: "4242", expiry: "12/26", isDefault: true },
  { id: "pm2", brand: "Mastercard", last4: "5555", expiry: "08/25", isDefault: false },
];

const MOCK_TRANSACTIONS = [
  { id: "tx1", description: "1969 Chevrolet Camaro Z/28", amount: 142500, status: "completed", date: "Jul 18, 2026", type: "purchase" },
  { id: "tx2", description: "Buyer premium — 1969 Camaro", amount: 7125, status: "completed", date: "Jul 18, 2026", type: "fee" },
  { id: "tx3", description: "1971 Dodge Challenger R/T", amount: 98000, status: "pending", date: "Jul 22, 2026", type: "purchase" },
];

export default function PaymentsPage() {
  const [methods, setMethods] = useState(MOCK_METHODS);
  const [addingCard, setAddingCard] = useState(false);
  const [cardNum, setCardNum] = useState("");
  const [cardExp, setCardExp] = useState("");
  const [cardCvc, setCardCvc] = useState("");

  const removeMethod = (id: string) => setMethods((prev) => prev.filter((m) => m.id !== id));

  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault();
    setMethods((prev) => [
      ...prev,
      {
        id: `pm${Date.now()}`,
        brand: "Visa",
        last4: cardNum.slice(-4) || "0000",
        expiry: cardExp || "00/00",
        isDefault: false,
      },
    ]);
    setCardNum("");
    setCardExp("");
    setCardCvc("");
    setAddingCard(false);
  };

  return (
    <div className="mx-auto max-w-screen-xl px-4 lg:px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Payments</h1>
          <p className="text-muted-foreground mt-0.5">Manage your payment methods and transaction history</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Payment methods */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-lg">Payment Methods</h2>
              <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setAddingCard(true)}>
                <Plus className="h-4 w-4" /> Add Card
              </Button>
            </div>

            <div className="space-y-3">
              {methods.map((m) => (
                <div key={m.id} className="flex items-center gap-4 p-4 rounded-xl border bg-card">
                  <div className="h-10 w-14 rounded-lg bg-muted flex items-center justify-center shrink-0">
                    <CreditCard className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{m.brand} ending in {m.last4}</p>
                    <p className="text-xs text-muted-foreground">Expires {m.expiry}</p>
                  </div>
                  {m.isDefault && <Badge variant="secondary" className="text-xs">Default</Badge>}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-destructive"
                    onClick={() => removeMethod(m.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}

              {methods.length === 0 && (
                <div className="flex flex-col items-center py-10 text-center rounded-xl border border-dashed">
                  <CreditCard className="h-8 w-8 text-muted-foreground/40 mb-2" />
                  <p className="text-sm text-muted-foreground">No payment methods added</p>
                </div>
              )}
            </div>

            {addingCard && (
              <form onSubmit={handleAddCard} className="mt-4 p-4 rounded-xl border bg-muted/30 space-y-3">
                <h3 className="font-medium text-sm">Add New Card</h3>
                <input
                  className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Card number"
                  value={cardNum}
                  onChange={(e) => setCardNum(e.target.value)}
                  maxLength={19}
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    className="rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="MM/YY"
                    value={cardExp}
                    onChange={(e) => setCardExp(e.target.value)}
                    maxLength={5}
                  />
                  <input
                    className="rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="CVC"
                    value={cardCvc}
                    onChange={(e) => setCardCvc(e.target.value)}
                    maxLength={4}
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" variant="bid" size="sm">Add Card</Button>
                  <Button type="button" variant="ghost" size="sm" onClick={() => setAddingCard(false)}>Cancel</Button>
                </div>
              </form>
            )}
          </section>

          {/* Transactions */}
          <section>
            <h2 className="font-semibold text-lg mb-4">Transaction History</h2>
            <div className="rounded-2xl border overflow-hidden">
              {MOCK_TRANSACTIONS.map((tx, i) => (
                <div key={tx.id} className={cn("flex items-center gap-4 px-4 py-3.5", i > 0 && "border-t")}>
                  <div className={cn(
                    "h-9 w-9 rounded-full flex items-center justify-center shrink-0",
                    tx.status === "completed" ? "bg-green-50 text-green-600" : "bg-amber-50 text-amber-600"
                  )}>
                    {tx.type === "purchase" ? <Trophy className="h-4 w-4" /> : <CreditCard className="h-4 w-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{tx.description}</p>
                    <p className="text-xs text-muted-foreground">{tx.date}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className={cn("font-semibold text-sm", tx.type === "fee" && "text-muted-foreground")}>
                      -{formatPrice(tx.amount)}
                    </p>
                    <Badge
                      variant={tx.status === "completed" ? "secondary" : "outline"}
                      className={cn("text-[10px] mt-0.5", tx.status === "pending" && "text-amber-600 border-amber-300")}
                    >
                      {tx.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right sidebar */}
        <div className="space-y-4">
          <div className="rounded-2xl border bg-card p-5">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="h-5 w-5 text-green-500" />
              <h3 className="font-semibold text-sm">Buyer Protection</h3>
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              All purchases are covered by Carasta Buyer Protection. We verify vehicles and ensure safe transactions.
            </p>
            <Link href="/help">
              <Button variant="outline" size="sm" className="w-full gap-1.5">
                Learn more <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>

          <div className="rounded-2xl border bg-card p-5">
            <h3 className="font-semibold text-sm mb-3">Won Auctions Pending</h3>
            <Link href="/won">
              <div className="flex items-center gap-3 p-3 rounded-xl border hover:bg-muted/50 transition-colors cursor-pointer">
                <Trophy className="h-5 w-5 text-yellow-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium">View Won Auctions</p>
                  <p className="text-xs text-muted-foreground">Complete pending payments</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
