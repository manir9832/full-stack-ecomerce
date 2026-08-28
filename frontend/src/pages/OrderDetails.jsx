import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';

const OrderDetails = () => {
    const { orderId } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const res = await axios.get('/api/order/my-orders', { withCredentials: true });
                const found = (res.data.orders || []).find(o => o._id === orderId);
                if (found) {
                    setOrder(found);
                } else {
                    setError('Order not found.');
                }
            } catch (err) {
                setError('Failed to fetch order details.');
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [orderId]);

    if (loading) return <div className="text-center p-12">Loading order details...</div>;
    if (error || !order) return <div className="text-center p-12 text-red-600">{error || 'Order not found'}</div>;

    return (
        <div className="max-w-4xl mx-auto p-6 my-8 bg-white rounded-2xl shadow-sm border">
            {/* Header */}
            <div className="flex justify-between items-center border-b pb-4 mb-6">
                <div>
                    <h1 className="text-xl font-bold text-gray-800">Order #{order._id.substring(order._id.length - 8)}</h1>
                    <p className="text-xs text-gray-500 mt-1">
                        Placed on: {new Date(order.createdAt).toLocaleString()}
                    </p>
                </div>
                <Link to="/my-orders" className="text-sm font-semibold text-blue-600 hover:underline">
                    &larr; Back to My Orders
                </Link>
            </div>

            {/* Status & Payment */}
            <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 mb-6 flex justify-between items-center">
                <div>
                    <span className="text-xs font-semibold text-gray-500 uppercase">Current Order Status</span>
                    <p className="text-lg font-bold text-blue-700 capitalize mt-0.5">
                        {order.status.replace(/_/g, ' ')}
                    </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    order.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                }`}>
                    {order.paymentMethod} ({order.paymentStatus})
                </span>
            </div>

            {/* Product Summary */}
            <div className="border-b pb-6 mb-6">
                <h3 className="font-bold text-gray-800 mb-4">Product Details</h3>
                <div className="flex items-center gap-4">
                    <img
                        src={order.productId?.images?.[0] || 'https://via.placeholder.com/80'}
                        alt={order.productName}
                        className="w-20 h-20 object-cover rounded-xl border"
                    />
                    <div className="space-y-1">
                        <h4 className="font-bold text-gray-800">{order.productName}</h4>
                        <p className="text-sm text-gray-500">Quantity: {order.quantity}</p>
                        <p className="text-sm font-semibold text-gray-800">Price: ₹{order.price}</p>
                    </div>
                </div>
            </div>

            {/* Delivery Address & Delivery Partner */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-b pb-6 mb-6">
                <div>
                    <h3 className="font-bold text-gray-800 mb-2">Shipping Address</h3>
                    <p className="text-sm font-semibold text-gray-700">{order.shippingAddress?.name}</p>
                    <p className="text-sm text-gray-600">{order.shippingAddress?.address}</p>
                    <p className="text-sm text-gray-600">
                        {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}
                    </p>
                    <p className="text-sm text-gray-600 mt-1"><strong>Phone:</strong> {order.shippingAddress?.phone}</p>
                </div>

                <div>
                    <h3 className="font-bold text-gray-800 mb-2">Delivery Boy</h3>
                    {order.deliveryBoyId ? (
                        <div className="bg-gray-50 p-3 rounded-xl border text-sm space-y-1">
                            <p className="font-semibold text-gray-800">{order.deliveryBoyId.name}</p>
                            <p className="text-gray-600">Phone: {order.deliveryBoyId.phone}</p>
                        </div>
                    ) : (
                        <p className="text-sm text-gray-500 italic">Delivery partner will be assigned once accepted.</p>
                    )}
                </div>
            </div>

            {/* Total Price Breakdown */}
            <div className="space-y-2 text-sm">
                <h3 className="font-bold text-gray-800 mb-2">Payment Summary</h3>
                <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>₹{order.productTotal}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                    <span>Delivery Fee</span>
                    <span>₹{order.deliveryCharge}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-gray-800 border-t pt-2 mt-2">
                    <span>Total Amount</span>
                    <span>₹{order.totalAmount}</span>
                </div>
            </div>
        </div>
    );
};

export default OrderDetails;