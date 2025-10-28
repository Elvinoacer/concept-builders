import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ChartDataPoint {
  date: string;
  spending: number;
  orders: number;
  designViews: number;
  logins: number;
}

interface UserAnalyticsChartsProps {
  data: ChartDataPoint[];
}

const UserAnalyticsCharts = ({ data }: UserAnalyticsChartsProps) => {
  if (!data || data.length === 0) {
    return <div className="text-center text-muted-foreground p-4">No data available for charts in this period.</div>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Spending & Orders Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Spending & Orders Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
            <XAxis dataKey="date" stroke="#888" />
            <YAxis yAxisId="left" stroke="#8884d8" label={{ value: 'Spending ($)', angle: -90, position: 'insideLeft' }} />
            <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" label={{ value: 'Orders', angle: 90, position: 'insideRight' }} />
            <Tooltip />
            <Legend />
            <Line yAxisId="left" type="monotone" dataKey="spending" stroke="#8884d8" activeDot={{ r: 8 }} name="Spending" />
            <Line yAxisId="right" type="monotone" dataKey="orders" stroke="#82ca9d" activeDot={{ r: 8 }} name="Orders" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Design Views Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Design Views Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
            <XAxis dataKey="date" stroke="#888" />
            <YAxis stroke="#888" label={{ value: 'Views', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="designViews" stroke="#ffc658" activeDot={{ r: 8 }} name="Design Views" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Login Activity Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 lg:col-span-2">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Login Activity Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
            <XAxis dataKey="date" stroke="#888" />
            <YAxis stroke="#888" label={{ value: 'Logins', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="logins" stroke="#ff7300" activeDot={{ r: 8 }} name="Logins" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default UserAnalyticsCharts;
