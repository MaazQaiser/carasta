"use client";

import React from "react";
import { ResponsiveContainer, ComposedChart, Bar, Line, XAxis, YAxis, Tooltip, Legend } from "recharts";

const DATA = [
  { day: "Mon", bids: 8, views: 340, watchers: 42 },
  { day: "Tue", bids: 12, views: 520, watchers: 58 },
  { day: "Wed", bids: 7, views: 290, watchers: 51 },
  { day: "Thu", bids: 18, views: 710, watchers: 87 },
  { day: "Fri", bids: 24, views: 890, watchers: 104 },
  { day: "Sat", bids: 31, views: 1240, watchers: 138 },
  { day: "Sun", bids: 19, views: 780, watchers: 112 },
];

export function SellerAnalyticsChart() {
  return (
    <div className="h-56">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={DATA} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
          <XAxis dataKey="day" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
          <YAxis yAxisId="left" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
          <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
          <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Bar yAxisId="left" dataKey="views" fill="hsl(220 70% 50% / 0.3)" name="Views" radius={[4, 4, 0, 0]} />
          <Line yAxisId="right" type="monotone" dataKey="bids" stroke="hsl(38 92% 50%)" strokeWidth={2} dot={false} name="Bids" />
          <Line yAxisId="right" type="monotone" dataKey="watchers" stroke="hsl(280 65% 60%)" strokeWidth={2} dot={false} name="Watchers" />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
