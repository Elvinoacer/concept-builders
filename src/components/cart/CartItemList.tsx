'use client';
import React from 'react';
import CartItem from './CartItem';

const CartItemList = ({ items, onRemove, onQuantityChange }) => {
  return (
    <ul className="divide-y divide-slate-200 border-y border-slate-200 dark:divide-gray-700 dark:border-gray-700" role="list">
      {items.map((item) => (
        <CartItem
          key={item.id}
          item={item}
          onRemove={onRemove}
          onQuantityChange={onQuantityChange}
        />
      ))}
    </ul>
  );
};

export default CartItemList;
