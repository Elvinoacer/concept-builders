import OrdersHeader from "@/components/admin/orders/OrdersHeader";
import OrdersTable from "@/components/admin/orders/OrdersTable";
import OrdersTabs from "@/components/admin/orders/OrdersTabs";

const OrdersPage = () => {
  return (
    <div className="flex flex-col flex-1 dark:bg-gray-900">
      <OrdersHeader />
      <main className="flex-1 p-6 dark:bg-gray-900">
        <OrdersTabs />
        <OrdersTable />
      </main>
    </div>
  );
};

export default OrdersPage;
