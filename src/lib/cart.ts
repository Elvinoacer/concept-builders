import { designs } from './designs';

export const cart = {
  items: [
    {
      ...designs[0],
      quantity: 1,
    },
    {
      ...designs[1],
      quantity: 1,
    },
  ],
};
