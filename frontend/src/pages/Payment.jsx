import React from "react";
import { useNavigate } from "react-router-dom";

const Payment = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-3xl mx-auto px-4 py-20">

      <div className="bg-white shadow rounded-xl p-8 text-center">

        <h1 className="text-3xl font-bold mb-4">
          Payment
        </h1>

        <p className="text-gray-600 mb-8">
          Payment is processed from the Checkout page using Razorpay.
        </p>

        <button
          onClick={() => navigate("/checkout")}
          className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg"
        >
          Go To Checkout
        </button>

      </div>

    </div>
  );
};

export default Payment;