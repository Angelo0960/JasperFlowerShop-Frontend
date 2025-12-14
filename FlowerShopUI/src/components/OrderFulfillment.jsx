// File: OrderFullfilment.jsx
import OrderFulfillmentTab from "./OrderFulfillmentTab";

export default function OrderFulfillment() {
  return (
    <div className="p-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Order Fulfillment</h1>
        <p className="text-gray-600">Track and manage order status updates</p>
      </div>
      <OrderFulfillmentTab />
    </div>
  );
}