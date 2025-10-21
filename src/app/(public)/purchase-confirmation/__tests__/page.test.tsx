import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import PurchaseConfirmationPage from '../page';

jest.mock('next/navigation', () => ({
  useSearchParams: () => ({
    get: () => '12345',
  }),
}));

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ id: '12345', createdAt: new Date(), amount: 100, items: [] }),
  })
);

describe('PurchaseConfirmationPage', () => {
  it('renders the purchase confirmation page', async () => {
    render(<PurchaseConfirmationPage />);

    await waitFor(() => {
      expect(screen.getByText(/Purchase #[0-9]+/)).toBeInTheDocument();
    });
  });
});
