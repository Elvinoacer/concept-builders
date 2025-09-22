import { designs } from './designs';

export const cart = {
  items: [
    {
      ...designs[0],
      price: designs[0].pricing.pdf,
      quantity: 1,
    },
    {
      ...designs[1],
      price: designs[1].pricing.pdf,
      quantity: 1,
    },
  ],
};
