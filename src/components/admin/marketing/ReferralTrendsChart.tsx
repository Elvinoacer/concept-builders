"use client";

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ReferralTrendData {
  date: string;
  [key: string]: any; // Allows for dynamic source keys
}

interface ReferralTrendsChartProps {
  data: ReferralTrendData[];
}

const ReferralTrendsChart = ({ data }: ReferralTrendsChartProps) => {
  if (!data || data.length === 0) {
    return <div className="text-center text-muted-foreground p-4">No referral data available for this period.</div>;
  }

  // Extract all unique source keys from the data
  const allSources = Array.from(new Set(data.flatMap(item => Object.keys(item).filter(key => key !== 'date'))));

  // Define a color palette for the lines
  const colors = [
    "#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#0088fe", "#00c49f", "#ffbb28", "#a4de6c", "#d0ed57", "#83a6ed"
  ];

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 5, right: 30, left: 20, bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
          <XAxis dataKey="date" stroke="#888" tickFormatter={(tick) => new Date(tick).toLocaleDateString()} />
          <YAxis stroke="#888" />
          <Tooltip />
          <Legend />
          {allSources.map((source, index) => (
            <Line
              key={source}
              type="monotone"
              dataKey={source}
              stroke={colors[index % colors.length]}
              activeDot={{ r: 8 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ReferralTrendsChart;
