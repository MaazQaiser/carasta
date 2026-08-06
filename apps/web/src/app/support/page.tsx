"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MessageSquare, HelpCircle, Mail, Phone, Send, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function SupportPage() {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setSent(true);
  };

  return (
    <div className="mx-auto max-w-screen-xl px-4 lg:px-6 py-12">
      <div className="text-center mb-12 max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Support Center</h1>
        <p className="text-muted-foreground">We&apos;re here to help. Reach us via chat, email, or phone.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {[
          { icon: MessageSquare, title: "Live Chat", body: "Chat with our team in real time during business hours (Mon–Fri, 9am–6pm ET).", cta: "Start Chat", href: "#" },
          { icon: Mail, title: "Email Support", body: "Send a message and we'll respond within one business day.", cta: "Email Us", href: "mailto:hello@carasta.com" },
          { icon: Phone, title: "Phone", body: "Speak directly with our buyer or seller specialists.", cta: "+1 (800) 555-0199", href: "tel:18005550199" },
        ].map(({ icon: Icon, title, body, cta, href }) => (
          <div key={title} className="rounded-2xl border bg-card p-6 text-center flex flex-col items-center">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Icon className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">{title}</h3>
            <p className="text-sm text-muted-foreground mb-4">{body}</p>
            <a href={href}>
              <Button variant="outline" size="sm">{cta}</Button>
            </a>
          </div>
        ))}
      </div>

      {/* Contact form */}
      <div className="max-w-2xl mx-auto">
        <div className="rounded-2xl border bg-card p-8">
          {sent ? (
            <div className="flex flex-col items-center py-8 text-center">
              <CheckCircle2 className="h-12 w-12 text-green-500 mb-4" />
              <h2 className="text-xl font-bold mb-1">Message sent!</h2>
              <p className="text-muted-foreground mb-4">We&apos;ll get back to you within one business day.</p>
              <Button variant="outline" onClick={() => { setSent(false); setSubject(""); setMessage(""); }}>
                Send another message
              </Button>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-bold mb-6">Send a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium block mb-1.5">Subject</label>
                  <input
                    className="w-full rounded-xl border bg-muted/30 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="How can we help you?"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1.5">Message</label>
                  <textarea
                    required
                    rows={5}
                    className="w-full rounded-xl border bg-muted/30 px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Describe your issue or question in detail…"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </div>
                <Button type="submit" variant="bid" className="gap-1.5" disabled={!message.trim()}>
                  <Send className="h-4 w-4" /> Send Message
                </Button>
              </form>
            </>
          )}
        </div>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          Looking for quick answers?{" "}
          <Link href="/faq" className="text-primary font-medium hover:underline">Visit our FAQ</Link>
        </div>
      </div>
    </div>
  );
}
