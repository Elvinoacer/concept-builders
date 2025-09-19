'use client';
import React from 'react';
import KPIs from '@/components/admin/dashboard/KPIs';
import Charts from '@/components/admin/dashboard/Charts';

const AdminDashboardPage = () => {
  return (
    <>
      <KPIs />
      <Charts />
    </>
  );
};

export default AdminDashboardPage;
