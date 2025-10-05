import { useState } from "react";
import OrderForm from "../Features/OrderForm.jsx";
import OrderHistory from "../Features/OrderHistory.jsx";
import OrderModal from "../Features/OrderModal.jsx";

export default function Orders({ items, setItems }) {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const addNewOrder = (order) => setOrders([order, ...orders]);

  const restockOrder = (order) => {
    const updatedItems = [...items];
    order.items.forEach((oi) => {
      const item = updatedItems.find((i) => i.name === oi.name);
      if (item) item.quantity += Number(oi.qty);
    });
    setItems(updatedItems);
  };

  const deleteOrder = (order) => {
    restockOrder(order);
    setOrders(orders.filter((o) => o !== order));
    if (selectedOrder === order) setSelectedOrder(null);
  };

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <OrderForm items={items} setItems={setItems} addNewOrder={addNewOrder} />
      <OrderHistory orders={orders} setOrders={setOrders} setSelectedOrder={setSelectedOrder} restockOrder={restockOrder} />
      {selectedOrder && <OrderModal order={selectedOrder} closeModal={() => setSelectedOrder(null)} deleteOrder={deleteOrder} restockOrder={restockOrder} />}
    </div>
  );
}


