import React from "react";
import Navbar from "../components/Navbar";

const Cart = () => {
  return (
    <div>
      <Navbar />
      <div className="p-8">
        <h1 className="text-3xl font-bold">Cart</h1>
        <p>Your cart is empty.</p>
      </div>
    </div>
  );
};

export default Cart;
