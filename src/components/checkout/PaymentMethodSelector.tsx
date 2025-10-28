'use client';
import React from "react";
import { motion } from "framer-motion";

const paymentMethods = [
  {
    id: "paypal",
    name: "PayPal",
    icon: "fab fa-paypal",
    description: "Pay with your PayPal account",
  },
  {
    id: "credit-card",
    name: "Credit Card",
    icon: "far fa-credit-card",
    description: "Pay with Visa, Mastercard, or Amex",
  },
  {
    id: "mpesa",
    name: "M-Pesa",
    icon: "fas fa-mobile-alt",
    description: "Pay with your M-Pesa account",
  },
  {
    id: "secure-url",
    name: "Secure Checkout URL",
    icon: "fas fa-link",
    description: "Get a secure payment link",
  },
];

const PaymentMethodSelector = ({ selectedMethod, onSelect }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Choose Payment Method
      </h2>
      <div className="grid grid-cols-1 gap-4">
        {paymentMethods.map((method) => (
          <motion.div
            key={method.id}
            onClick={() => onSelect(method.id)}
            className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${selectedMethod === method.id ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" : "border-gray-300 dark:border-gray-700 hover:border-blue-400"}`}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <div className={`w-10 h-10 flex items-center justify-center rounded-md text-white text-xl ${method.id === 'paypal' ? 'bg-[#003087]' : method.id === 'credit-card' ? 'bg-gray-800' : method.id === 'mpesa' ? 'bg-[#00A650]' : 'bg-red-500'}`}>
              <i className={method.icon}></i>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{method.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{method.description}</p>
            </div>
            {selectedMethod === method.id && (
              <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-white">
                <i className="fas fa-check text-xs"></i>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default PaymentMethodSelector;