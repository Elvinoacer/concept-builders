"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import OrdersHeader from "@/components/admin/orders/OrdersHeader";
import OrdersTabs from "@/components/admin/orders/OrdersTabs";
import OrdersTable from "@/components/admin/orders/OrdersTable";

const OrdersPage = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState("All");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch('/api/orders');
        const data = await res.json();
        setOrders(data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
  };

  const handleStartDateChange = (date) => {
    setStartDate(date);
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
  };

  const applyFilters = () => {
    // The filtering logic is already applied on render, so this function can be used to close the filter dropdown
  };

  const filteredOrders = orders
    .filter((order) => {
      if (activeTab === "All") return true;
      if (activeTab === "Pending") return order.status === "PENDING";
      if (activeTab === "Completed") return order.status === "PAID";
      if (activeTab === "Refunds")
        return (
          order.status === "REFUND_REQUESTED" || order.status === "REFUNDED"
        );
      return true;
    })
    .filter((order) => {
      if (searchTerm === "") return true;
      return (
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (order.user &&
          order.user.name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    })
    .filter((order) => {
      if (status === "All") return true;
      return order.status === status.toUpperCase().replace(" ", "_");
    })
    .filter((order) => {
      if (startDate === "" || endDate === "") return true;
      const orderDate = new Date(order.createdAt);
      const start = new Date(startDate);
      const end = new Date(endDate);
      return orderDate >= start && orderDate <= end;
    });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-4 md:p-6"
    >
      <OrdersHeader
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        orders={filteredOrders}
        status={status}
        startDate={startDate}
        endDate={endDate}
        handleStatusChange={handleStatusChange}
        handleStartDateChange={handleStartDateChange}
        handleEndDateChange={handleEndDateChange}
        applyFilters={applyFilters}
      />
      <div className="mt-4 md:mt-6">
        <OrdersTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="mt-4">
          <OrdersTable orders={filteredOrders} />
        </div>
      </div>
    </motion.div>
  );
};

export default OrdersPage;