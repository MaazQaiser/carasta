"use client";

import React, { useState } from "react";
import { Shield, Users, Gavel, FileText, TrendingUp, Eye, CheckCircle, X, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { MOCK_VEHICLES } from "@carasta/mock-data";
import { MOCK_AUCTIONS } from "@carasta/mock-data";
import { MOCK_USERS } from "@carasta/mock-data";
import { formatPrice } from "@/lib/utils";

const MOCK_REPORTS = [
  { id: "r-1", type: "listing", title: "Misleading photos on auction a-003", reporter: "priya_wheels", status: "pending", createdAt: "2024-01-22T10:00:00Z" },
  { id: "r-2", type: "user", title: "Suspicious bidding behavior", reporter: "euro_garage", status: "pending", createdAt: "2024-01-23T14:00:00Z" },
  { id: "r-3", type: "post", title: "Spam in community feed", reporter: "muscle_mike", status: "resolved", createdAt: "2024-01-21T09:00:00Z" },
];

const STAT_CARDS = [
  { label: "Live Auctions", value: "3", icon: Gavel, color: "text-red-500", trend: "+1 today" },
  { label: "Active Users", value: "1,284", icon: Users, color: "text-blue-500", trend: "+24 today" },
  { label: "Pending Reports", value: "2", icon: AlertTriangle, color: "text-orange-500", trend: "Needs review" },
  { label: "Today's Revenue", value: "$48K", icon: TrendingUp, color: "text-green-500", trend: "+12% vs yesterday" },
];

export function AdminDashboard() {
  const [reportStatuses, setReportStatuses] = useState<Record<string, string>>(
    Object.fromEntries(MOCK_REPORTS.map((r) => [r.id, r.status]))
  );

  return (
    <div className="mx-auto max-w-screen-2xl px-4 lg:px-6 py-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center">
          <Shield className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-sm text-muted-foreground">Carasta platform management</p>
        </div>
        <Badge variant="secondary" className="ml-auto">Admin Mode</Badge>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {STAT_CARDS.map(({ label, value, icon: Icon, color, trend }) => (
          <div key={label} className="rounded-2xl border bg-card p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-muted-foreground">{label}</p>
              <Icon className={`h-5 w-5 ${color}`} />
            </div>
            <p className="text-3xl font-bold mb-1">{value}</p>
            <p className="text-xs text-muted-foreground">{trend}</p>
          </div>
        ))}
      </div>

      <Tabs defaultValue="auctions">
        <TabsList className="mb-6">
          <TabsTrigger value="auctions">Live Auctions</TabsTrigger>
          <TabsTrigger value="listings">Listings</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="reports">Reports <Badge variant="destructive" className="ml-1.5 text-[10px] h-4 px-1.5">2</Badge></TabsTrigger>
        </TabsList>

        {/* Auctions monitor */}
        <TabsContent value="auctions">
          <div className="rounded-2xl border overflow-hidden">
            <div className="px-4 py-3 bg-muted/30 flex items-center gap-2 text-sm font-medium">
              <Gavel className="h-4 w-4" /> Live Auction Monitor
            </div>
            <div className="divide-y">
              {MOCK_AUCTIONS.filter((a) => a.status === "live" || a.status === "ending-soon").map((auction) => (
                <div key={auction.id} className="flex items-center justify-between px-4 py-3 hover:bg-muted/20 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`h-2 w-2 rounded-full ${auction.status === "live" ? "bg-red-500 animate-pulse" : "bg-orange-500"}`} />
                    <div>
                      <p className="text-sm font-medium">{auction.vehicle.title}</p>
                      <p className="text-xs text-muted-foreground">{auction.bidCount} bids · {auction.participantCount} participants</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="font-semibold">{formatPrice(auction.currentBid)}</span>
                    <Badge variant={auction.status === "live" ? "live" : "ending"}>{auction.status}</Badge>
                    <Button variant="ghost" size="sm" className="gap-1"><Eye className="h-3.5 w-3.5" /> View</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Listings moderation */}
        <TabsContent value="listings">
          <div className="flex gap-3 mb-4">
            <Input placeholder="Search listings…" className="max-w-xs h-8 text-sm" />
            <Button variant="outline" size="sm">Filter</Button>
          </div>
          <div className="rounded-2xl border overflow-hidden">
            <div className="divide-y">
              {MOCK_VEHICLES.slice(0, 8).map((vehicle) => (
                <div key={vehicle.id} className="flex items-center justify-between px-4 py-3 hover:bg-muted/20">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-14 rounded-lg overflow-hidden bg-muted shrink-0">
                      {vehicle.images[0] && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={vehicle.images[0].url} alt={vehicle.title} className="h-full w-full object-cover" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{vehicle.title}</p>
                      <p className="text-xs text-muted-foreground">{vehicle.seller.displayName} · {vehicle.status}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={vehicle.status === "in-auction" ? "live" : "secondary"} className="capitalize text-[10px]">{vehicle.status}</Badge>
                    <Button variant="ghost" size="sm" className="h-7 text-xs gap-1">
                      <CheckCircle className="h-3.5 w-3.5 text-green-500" /> Approve
                    </Button>
                    <Button variant="ghost" size="sm" className="h-7 text-xs gap-1">
                      <X className="h-3.5 w-3.5 text-red-500" /> Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* User management */}
        <TabsContent value="users">
          <div className="flex gap-3 mb-4">
            <Input placeholder="Search users…" className="max-w-xs h-8 text-sm" />
            <Button variant="outline" size="sm">Filter</Button>
          </div>
          <div className="rounded-2xl border overflow-hidden">
            <div className="divide-y">
              {MOCK_USERS.filter((u) => u.role !== "admin").map((user) => (
                <div key={user.id} className="flex items-center justify-between px-4 py-3 hover:bg-muted/20">
                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={user.avatar?.url} alt={user.displayName} className="h-8 w-8 rounded-full object-cover" />
                    <div>
                      <p className="text-sm font-medium">{user.displayName}</p>
                      <p className="text-xs text-muted-foreground">@{user.username} · Joined {new Date(user.joinedAt).getFullYear()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {user.isVerified && <Badge variant="secondary" className="text-[10px]">✓ Verified</Badge>}
                    <Badge variant="outline" className="text-[10px] capitalize">{user.role}</Badge>
                    <Button variant="ghost" size="sm" className="h-7 text-xs">Manage</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Reports */}
        <TabsContent value="reports">
          <div className="space-y-3">
            {MOCK_REPORTS.map((report) => (
              <div key={report.id} className="flex items-start gap-4 p-4 rounded-2xl border bg-card">
                <div className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${report.status === "pending" ? "bg-orange-100 dark:bg-orange-950" : "bg-muted"}`}>
                  <AlertTriangle className={`h-5 w-5 ${report.status === "pending" ? "text-orange-500" : "text-muted-foreground"}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-medium text-sm">{report.title}</p>
                    <Badge variant={report.status === "pending" ? "ending" : "secondary"} className="capitalize text-[10px] shrink-0">{report.status}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">Reported by @{report.reporter} · {new Date(report.createdAt).toLocaleDateString()}</p>
                  {report.status === "pending" && (
                    <div className="flex gap-2 mt-2">
                      <Button size="sm" className="h-7 text-xs gap-1" onClick={() => setReportStatuses((p) => ({ ...p, [report.id]: "resolved" }))}>
                        <CheckCircle className="h-3.5 w-3.5" /> Resolve
                      </Button>
                      <Button variant="outline" size="sm" className="h-7 text-xs gap-1">
                        <Eye className="h-3.5 w-3.5" /> Review
                      </Button>
                      <Button variant="ghost" size="sm" className="h-7 text-xs gap-1">
                        <X className="h-3.5 w-3.5" /> Dismiss
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
