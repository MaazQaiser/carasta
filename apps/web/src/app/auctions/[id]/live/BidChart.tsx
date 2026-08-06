"use client";

import React from "react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";
import { formatPrice } from "@/lib/utils";

interface BidChartProps {
  data: { time: string; amount: number }[];
  currentBid: number;
}

export function BidChart({ data, currentBid }: BidChartProps) {
  return (
    <div className="h-40">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="bidGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(38 92% 50%)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="hsl(38 92% 50%)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="time" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
          <YAxis
            tick={{ fontSize: 10 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`}
            width={50}
          />
          <Tooltip
            formatter={(value: number) => [formatPrice(value), "Bid"]}
            contentStyle={{ fontSize: 12, borderRadius: 8 }}
          />
          <Area
            type="monotone"
            dataKey="amount"
            stroke="hsl(38 92% 50%)"
            strokeWidth={2}
            fill="url(#bidGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
