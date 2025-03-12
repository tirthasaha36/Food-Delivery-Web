import React from "react";
import Navbar from "../components/Navbar";

const Orders = () => {
  return (
    <div>
      <Navbar />
      <div className="p-8">
        <h1 className="text-3xl font-bold">Orders</h1>
        <p>No orders placed yet.</p>
      </div>
    </div>
  );
};

export default Orders;
