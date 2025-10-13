'use client';

import React, { useState, useEffect } from 'react';
import KPIs from '@/components/admin/dashboard/KPIs';
import Charts from '@/components/admin/dashboard/Charts';

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [monthlySales, setMonthlySales] = useState(null);
  const [clientAcquisition, setClientAcquisition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [statsRes, monthlySalesRes, clientAcquisitionRes] = await Promise.all([
          fetch('/api/admin/stats'),
          fetch('/api/admin/monthly-sales'),
          fetch('/api/admin/client-acquisition'),
        ]);

        if (!statsRes.ok || !monthlySalesRes.ok || !clientAcquisitionRes.ok) {
            throw new Error('Failed to fetch all admin data');
        }

        const statsData = await statsRes.json();
        const monthlySalesData = await monthlySalesRes.json();
        const clientAcquisitionData = await clientAcquisitionRes.json();

        setStats(statsData);
        setMonthlySales(monthlySalesData);
        setClientAcquisition(clientAcquisitionData);
      } catch (error) {
        console.error('Error fetching admin data:', error);
        setError(error.message || 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
        <>
            <KPIs stats={null} />
            <Charts stats={null} monthlySales={null} clientAcquisition={null} />
        </>
    );
  }

  if (error) {
    return (
        <div className="flex items-center justify-center h-64 rounded-lg border border-dashed border-red-500 bg-red-50 dark:bg-red-900/20 p-4">
            <div className="text-center">
                <h3 className="text-lg font-semibold text-red-700 dark:text-red-400">Failed to load dashboard</h3>
                <p className="text-sm text-red-600 dark:text-red-500 mt-2">{error}</p>
                <button onClick={() => window.location.reload()} className="mt-4 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700">
                    Try Again
                </button>
            </div>
        </div>
    )
  }

  return (
    <>
      <KPIs stats={stats} />
      <Charts stats={stats} monthlySales={monthlySales} clientAcquisition={clientAcquisition} />
    </>
  );
};

export default AdminDashboardPage;
