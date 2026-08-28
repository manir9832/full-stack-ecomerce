 

import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { removeFromCart, updateQuantity, clearCart } from '../../../redux/slices/cartSlice';
import OneHourDeliveryBadge from '../../../components/badges/OneHourDeliveryBadge';
import { createOrder, createRazorpayOrder, verifyRazorpayPayment } from '../../../api/orderApi';
import { useSocketContext } from '../../../context/SocketContext';

export const ALLOWED_PINCODES = ['743424'];

const ZONE_COORDINATES = {
  latitude: 22.64,
  longitude: 88.68,
};

const CartCheckout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart?.items || []);
  const { socket } = useSocketContext();

  const [pincode, setPincode] = useState('743424');
  const [streetAddress, setStreetAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [loading, setLoading] = useState(false);
  const [customerLocation, setCustomerLocation] = useState(ZONE_COORDINATES);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCustomerLocation({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          });
        },
        () => {
          setCustomerLocation(ZONE_COORDINATES);
        }
      );
    }
  }, []);

  const isServiceable = ALLOWED_PINCODES.includes(pincode.trim());

  const subTotal = cartItems.reduce((acc, item) => acc + (item.price || 0) * (item.quantity || 1), 0);
  const deliveryCharge = subTotal > 0 ? (subTotal > 500 ? 0 : 25) : 0;
  const grandTotal = subTotal + deliveryCharge;

  const handleRazorpayFlow = async (orderId, amount) => {
    try {
      const { data } = await createRazorpayOrder({ amount });

      const options = {
        key: data.key,
        amount: data.order.amount,
        currency: 'INR',
        name: 'Grocera',
        description: 'Grocery Delivery Payment',
        order_id: data.order.id,
        handler: async (response) => {
          try {
            const verifyRes = await verifyRazorpayPayment({
              ...response,
              orderId,
            });
            if (verifyRes.data?.success) {
              dispatch(clearCart());
              navigate(`/order-tracking/${orderId}`);
            }
          } catch (err) {
            alert('Payment verification failed');
          }
        },
        theme: { color: '#059669' },
      };

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.open();
    } catch (err) {
      console.error('Razorpay init failed:', err);
      alert('Failed to initialize online payment.');
    }
  };

  const handlePlaceOrder = async () => {
    const token = localStorage.getItem('token') || localStorage.getItem('userToken');

    if (!token) {
      alert('Please login to complete your order.');
      navigate('/login');
      return;
    }

    if (!isServiceable) {
      alert(`Delivery is currently unavailable at this pin code: ${ALLOWED_PINCODES.join(', ')}`);
      return;
    }

    if (!streetAddress.trim()) {
      alert('Please enter your complete street address & landmark.');
      return;
    }

    if (cartItems.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    try {
      setLoading(true);

      const firstItem = cartItems[0];
      const selectedProductId = firstItem._id || firstItem.productId || firstItem.id;
      const selectedSellerId = firstItem.sellerId || firstItem.seller?._id || firstItem.seller;

      if (!selectedProductId) {
        alert('Invalid product details in cart.');
        return;
      }

      const fullShippingAddress = `${streetAddress.trim()}, Pin: ${pincode.trim()}, West Bengal`;

      const orderPayload = {
        productId: selectedProductId,
        sellerId: selectedSellerId,
        quantity: Number(firstItem.quantity) || 1,
        shippingAddress: fullShippingAddress,
        paymentMethod: paymentMethod,
        customerLocation: {
          latitude: Number(customerLocation.latitude) || ZONE_COORDINATES.latitude,
          longitude: Number(customerLocation.longitude) || ZONE_COORDINATES.longitude,
        },
      };

      const response = await createOrder(orderPayload);

      if (response.data?.order) {
        const createdOrder = response.data.order;

        // ইনস্ট্যান্ট সকেট ট্রিগার পাঠানো
        if (socket) {
          socket.emit('orderPlacedTrigger', {
            orderId: String(createdOrder._id),
            sellerId: String(createdOrder.sellerId),
            productName: createdOrder.productName,
            quantity: createdOrder.quantity,
            productTotal: createdOrder.productTotal,
          });
        }

        if (paymentMethod === 'ONLINE') {
          await handleRazorpayFlow(createdOrder._id, grandTotal);
        } else {
          dispatch(clearCart());
          alert('✅ Order placed successfully!');
          navigate(`/order-tracking/${createdOrder._id}`);
        }
      }
    } catch (err) {
      console.error('Order creation failed:', err);
      if (err.response?.status === 401) {
        alert('Your session has expired. Please login again.');
        navigate('/login');
      } else {
        alert(err.response?.data?.message || 'Failed to place the order.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="text-6xl">🛒</div>
        <h2 className="text-2xl font-black text-slate-800">Your Cart is Empty!</h2>
        <button
          onClick={() => navigate('/')}
          className="bg-emerald-600 text-white px-6 py-2.5 rounded-full font-bold text-sm shadow-md hover:bg-emerald-700 transition"
        >
          Start Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex items-center justify-between border-b pb-4">
        <h1 className="text-2xl font-black text-slate-900">Checkout & Order Summary</h1>
        <OneHourDeliveryBadge />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div
            className={`p-4 rounded-2xl border text-sm font-semibold flex items-center gap-3 ${
              isServiceable
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-rose-50 border-rose-200 text-rose-800'
            }`}
          >
            <span className="text-xl">{isServiceable ? '⚡' : '🚫'}</span>
            <div>
              {isServiceable ? (
                <span>1-Hour Express Delivery is active for pin code: <strong>{pincode}</strong></span>
              ) : (
                <span>Delivery is currently unavailable at pin code <strong>{pincode}</strong>. (Available: {ALLOWED_PINCODES.join(', ')})</span>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl border p-4 shadow-sm space-y-4">
            <h3 className="font-extrabold text-slate-800 border-b pb-2">Selected Products</h3>
            {cartItems.map((item) => {
              const displayImage =
                (Array.isArray(item.images) && item.images[0]) ||
                item.image ||
                'https://placehold.co/150x150?text=Item';
              const displayName = item.productName || item.title || 'Grocery Item';
              const itemKey = item._id || item.productId || item.id;

              return (
                <div key={itemKey} className="flex items-center justify-between gap-4 border-b pb-3 last:border-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <img src={displayImage} alt={displayName} className="w-14 h-14 object-contain rounded-lg bg-slate-50 border p-1" />
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm">{displayName}</h4>
                      <p className="text-xs text-slate-400">₹{item.price} / unit</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center border rounded-lg bg-slate-50">
                      <button
                        onClick={() => dispatch(updateQuantity({ id: itemKey, quantity: (item.quantity || 1) - 1 }))}
                        className="px-2.5 py-1 font-bold text-slate-600 hover:bg-slate-200 rounded-l-lg"
                      >
                        -
                      </button>
                      <span className="px-3 font-extrabold text-sm">{item.quantity || 1}</span>
                      <button
                        onClick={() => dispatch(updateQuantity({ id: itemKey, quantity: (item.quantity || 1) + 1 }))}
                        className="px-2.5 py-1 font-bold text-slate-600 hover:bg-slate-200 rounded-r-lg"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => dispatch(removeFromCart(itemKey))}
                      className="text-red-500 hover:text-red-700 text-sm font-bold p-1"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-white rounded-2xl border p-5 shadow-sm space-y-4">
            <h3 className="font-extrabold text-slate-800">Delivery Address</h3>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Postal Pincode</label>
              <input
                type="text"
                maxLength={6}
                value={pincode}
                onChange={(e) => setPincode(e.target.value.trim())}
                placeholder="Enter 6-digit pincode (e.g. 743424)"
                className="w-full sm:w-1/2 border rounded-xl px-3 py-2 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Full Street Address & Landmark</label>
              <textarea
                value={streetAddress}
                onChange={(e) => setStreetAddress(e.target.value)}
                placeholder="House no, Village / Street name, Landmark, Mobile number..."
                className="w-full border rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                rows={3}
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl border p-5 shadow-sm space-y-4">
            <h3 className="font-extrabold text-slate-900 border-b pb-2">Bill Details</h3>
            <div className="space-y-2 text-sm text-slate-600">
              <div className="flex justify-between">
                <span>Items Total</span>
                <span className="font-bold text-slate-900">₹{subTotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Charge (1-Hour)</span>
                <span className="font-bold text-emerald-600">{deliveryCharge === 0 ? 'Free' : `₹${deliveryCharge}`}</span>
              </div>
              <div className="border-t pt-2 flex justify-between text-base font-black text-slate-900">
                <span>Grand Total</span>
                <span className="text-emerald-600">₹{grandTotal}</span>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Payment Option</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('COD')}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition ${
                    paymentMethod === 'COD' ? 'border-emerald-600 bg-emerald-50 text-emerald-700' : 'border-slate-200 text-slate-600'
                  }`}
                >
                  💵 Cash (COD)
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('ONLINE')}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition ${
                    paymentMethod === 'ONLINE' ? 'border-emerald-600 bg-emerald-50 text-emerald-700' : 'border-slate-200 text-slate-600'
                  }`}
                >
                  💳 Online
                </button>
              </div>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={loading || !isServiceable}
              className={`w-full font-extrabold py-3 rounded-xl shadow-lg transition ${
                isServiceable && !loading
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white active:scale-95'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              {loading ? 'Processing Order...' : !isServiceable ? 'Delivery Unavailable' : 'Confirm Order →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartCheckout;