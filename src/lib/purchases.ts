import { designs } from './designs';
import { Purchase } from './types';

export const purchasedDesigns: Purchase[] = [
  {
    id: 1,
    name: designs[0].name,
    purchaseDate: 'July 15, 2023',
    price: designs[0].pricing.pdf,
  },
  {
    id: 2,
    name: designs[1].name,
    purchaseDate: 'August 22, 2023',
    price: designs[1].pricing.pdf,
  },
  {
    id: 3,
    name: designs[2].name,
    purchaseDate: 'September 10, 2023',
    price: designs[2].pricing.pdf,
  },
];
