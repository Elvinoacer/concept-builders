'use client';

import React, { useState, useEffect } from 'react';
import KPIs from '@/components/admin/dashboard/KPIs';
import Charts from '@/components/admin/dashboard/Charts';

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [monthlySales, setMonthlySales] = useState(null);
  const [clientAcquisition, setClientAcquisition] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, monthlySalesRes, clientAcquisitionRes] = await Promise.all([
          fetch('/api/admin/stats'),
          fetch('/api/admin/monthly-sales'),
          fetch('/api/admin/client-acquisition'),
        ]);

        const statsData = await statsRes.json();
        const monthlySalesData = await monthlySalesRes.json();
        const clientAcquisitionData = await clientAcquisitionRes.json();

        setStats(statsData);
        setMonthlySales(monthlySalesData);
        setClientAcquisition(clientAcquisitionData);
      } catch (error) {
        console.error('Error fetching admin data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <KPIs stats={stats} />
      <Charts stats={stats} monthlySales={monthlySales} clientAcquisition={clientAcquisition} />
    </>
  );
};

export default AdminDashboardPage;
