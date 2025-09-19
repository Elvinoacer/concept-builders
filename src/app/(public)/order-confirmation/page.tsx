"use client";
import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ConfirmationHeader from "@/components/order-confirmation/ConfirmationHeader";
import OrderSummary from "@/components/order-confirmation/OrderSummary";
import ItemsPurchased from "@/components/order-confirmation/ItemsPurchased";
import DeliveryDetails from "@/components/order-confirmation/DeliveryDetails";
import ActionButtons from "@/components/order-confirmation/ActionButtons";

const OrderConfirmationPage = () => {
  const order = {
    orderNumber: "123456789",
    orderDate: "July 26, 2024",
    total: 2499.0,
    items: [
      {
        id: 1,
        name: "Modern Farmhouse Design",
        planId: "987654321",
        image: "/images/banner-1.png",
      },
    ],
    delivery: {
      name: "Sophia Carter",
      email: "sophia.carter@email.com",
      address: "123 Oak Street, Anytown, CA 91234",
    },
  };

  return (
    <div
      className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden"
      style={{ fontFamily: '"Work Sans", "Noto Sans", sans-serif' }}
    >
      <div className="layout-container flex h-full grow flex-col">
        <main className="flex flex-1 justify-center py-12 px-4 bg-gray-50 dark:bg-gray-900">
          <div className="layout-content-container flex flex-col w-full max-w-2xl bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <ConfirmationHeader orderNumber={order.orderNumber} />
            <div className="px-8 md:px-12 py-6 border-t border-gray-200 dark:border-gray-700">
              <OrderSummary
                orderDate={order.orderDate}
                total={order.total}
                orderNumber={order.orderNumber}
              />
            </div>
            <div className="px-8 md:px-12 py-6 border-t border-gray-200 dark:border-gray-700">
              <ItemsPurchased items={order.items} />
            </div>
            <div className="px-8 md:px-12 py-6 border-t border-gray-200 dark:border-gray-700">
              <DeliveryDetails delivery={order.delivery} />
            </div>
            <div className="p-8 md:p-12 border-t border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50 rounded-b-lg">
              <ActionButtons />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
