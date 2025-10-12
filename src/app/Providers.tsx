'use client';

import { SessionProvider } from 'next-auth/react';
import { Toaster } from 'sonner';
import ImpersonationBanner from '@/components/admin/ImpersonationBanner';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ImpersonationBanner />
      {children}
      <Toaster
        richColors
        toastOptions={{
          style: {
            borderRadius: '8px',
            border: '1px solid #e5e7eb',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          },
          classNames: {
            toast: 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white',
            title: 'text-sm font-semibold',
            description: 'text-sm',
            actionButton: 'bg-blue-500 text-white',
            cancelButton: 'bg-gray-500 text-white',
          },
        }}
      />
    </SessionProvider>
  );
}
