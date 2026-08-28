import { useContext, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import CheckoutSummary from "../components/CheckoutSummary";
import PaymentMethod from "../components/PaymentMethod";

import {
  createOrder,
  verifyPayment,
} from "../services/api";

import AppContext from "../context/AppContext";

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { fetchCart } = useContext(AppContext);

  const {
    product,
    quantity = 1,
  } = location.state || {};

  const [loading, setLoading] = useState(false);

  const [paymentMethod, setPaymentMethod] =
    useState("COD");

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const productPrice = useMemo(() => {
    if (!product) return 0;

    return product.discountPrice > 0
      ? product.discountPrice
      : product.price;
  }, [product]);

  const productTotal = productPrice * quantity;

  const deliveryCharge = 0;
  const platformCharge = 0;

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleCheckout = async () => {
    if (!product) {
      toast.error("Product not found");
      return;
    }

    if (
      !form.name ||
      !form.phone ||
      !form.address ||
      !form.city ||
      !form.state ||
      !form.pincode
    ) {
      toast.error("Please fill all fields");
      return;
    }

    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported");
      return;
    }

    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const body = {
            productId: product._id,
            quantity,

            paymentMethod,

            shippingAddress: {
              name: form.name,
              phone: form.phone,
              address: form.address,
              city: form.city,
              state: form.state,
              pincode: form.pincode,
            },

            customerLocation: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            },
          };

          const orderRes = await createOrder(body);

          if (paymentMethod === "COD") {
            toast.success(
              orderRes.data.message ||
                "Order placed successfully"
            );

            await fetchCart();

            navigate("/my-orders");

            return;
          }

          const options = {
            key: orderRes.data.razorpayKey,

            amount:
              orderRes.data.razorpayOrder.amount,

            currency:
              orderRes.data.razorpayOrder.currency,

            order_id:
              orderRes.data.razorpayOrder.id,

            name: "Sky Grocery",

            description: "Online Payment",

            handler: async (response) => {
              try {
                await verifyPayment(response);

                toast.success(
                  "Payment Successful"
                );

                await fetchCart();

                navigate("/my-orders");
              } catch (err) {
                toast.error(
                  err.response?.data?.message ||
                    "Payment verification failed"
                );
              }
            },

            theme: {
              color: "#16a34a",
            },
          };

          const razorpay = new window.Razorpay(
            options
          );

          razorpay.open();
        } catch (error) {
          toast.error(
            error.response?.data?.message ||
              "Checkout failed"
          );
        } finally {
          setLoading(false);
        }
      },
      () => {
        toast.error(
          "Location permission denied"
        );

        setLoading(false);
      }
    );
  };

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20">
        <h2 className="text-2xl font-bold">
          No Product Selected
        </h2>
      </div>
    );
  }

    return (
    <div className="max-w-7xl mx-auto px-4 py-10 grid lg:grid-cols-2 gap-10">

      {/* Left Side */}

      <div className="space-y-6">

        <div className="bg-white border rounded-xl p-6 shadow">

          <h2 className="text-2xl font-bold mb-6">
            Shipping Address
          </h2>

          <div className="grid gap-4">

            <input
              type="text"
              name="name"
              placeholder="Full Name"
              className="border rounded-lg p-3 outline-none focus:ring-2 focus:ring-green-500"
              value={form.name}
              onChange={handleChange}
            />

            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              className="border rounded-lg p-3 outline-none focus:ring-2 focus:ring-green-500"
              value={form.phone}
              onChange={handleChange}
            />

            <textarea
              name="address"
              rows="3"
              placeholder="Full Address"
              className="border rounded-lg p-3 outline-none focus:ring-2 focus:ring-green-500"
              value={form.address}
              onChange={handleChange}
            />

            <input
              type="text"
              name="city"
              placeholder="City"
              className="border rounded-lg p-3 outline-none focus:ring-2 focus:ring-green-500"
              value={form.city}
              onChange={handleChange}
            />

            <input
              type="text"
              name="state"
              placeholder="State"
              className="border rounded-lg p-3 outline-none focus:ring-2 focus:ring-green-500"
              value={form.state}
              onChange={handleChange}
            />

            <input
              type="text"
              name="pincode"
              placeholder="Pincode"
              className="border rounded-lg p-3 outline-none focus:ring-2 focus:ring-green-500"
              value={form.pincode}
              onChange={handleChange}
            />

          </div>

        </div>

        <PaymentMethod
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
        />

      </div>

      {/* Right Side */}

      <div>

        <CheckoutSummary
          product={product}
          quantity={quantity}
          productTotal={productTotal}
          deliveryCharge={deliveryCharge}
          platformCharge={platformCharge}
        />

        <button
          onClick={handleCheckout}
          disabled={loading}
          className={`w-full mt-6 py-4 rounded-lg text-white font-semibold transition ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {loading
            ? "Processing..."
            : paymentMethod === "COD"
            ? "Place Order"
            : "Pay Now"}
        </button>

      </div>

    </div>
  );
};

export default Checkout;