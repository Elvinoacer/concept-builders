
'use client';

import { Analytics } from '@vercel/analytics/react';

export function VercelAnalytics() {
  return (
    <Analytics
      beforeSend={(event) => {
        if (process.env.NODE_ENV !== 'production') {
          return null;
        }
        return event;
      }}
    />
  );
}
