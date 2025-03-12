import React from "react";
import Navbar from "../components/Navbar";

const Checkout = () => {
  return (
    <div>
      <Navbar />
      <div className="p-8">
        <h1 className="text-3xl font-bold">Checkout</h1>
        <p>Complete your order by making a payment.</p>
      </div>
    </div>
  );
};

export default Checkout;
