import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AvailableOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [acceptingId, setAcceptingId] = useState(null);

    const fetchAvailableOrders = async () => {
        try {
            // সমস্ত অর্ডার এনে "ready_for_shipping" গুলো ফিল্টার করা
            const res = await axios.get('/api/delivery/orders', { withCredentials: true });
            const readyOrders = (res.data.orders || []).filter(o => o.status === 'ready_for_shipping' && !o.deliveryBoyId);
            setOrders(readyOrders);
        } catch (err) {
            console.error('Fetch available orders error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAvailableOrders();
    }, []);

    const handleAcceptDelivery = async (orderId) => {
        setAcceptingId(orderId);
        try {
            const res = await axios.patch(`/api/delivery/accept/${orderId}`, {}, { withCredentials: true });
            alert(res.data.message || 'Delivery accepted successfully!');
            fetchAvailableOrders();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to accept delivery.');
        } finally {
            setAcceptingId(null);
        }
    };

    if (loading) return <div className="text-center p-8">Checking available orders...</div>;

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Available Delivery Requests</h1>

            {orders.length === 0 ? (
                <div className="bg-white p-8 rounded-xl shadow text-center text-gray-500">
                    No available orders right now. Make sure you are <strong>Online</strong> to receive requests.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {orders.map((order) => (
                        <div key={order._id} className="bg-white p-5 rounded-xl shadow-sm border space-y-3">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-bold text-gray-800">{order.productName}</h3>
                                    <p className="text-xs text-gray-500">Quantity: {order.quantity}</p>
                                </div>
                                <span className="bg-emerald-100 text-emerald-800 text-xs px-2.5 py-1 rounded font-bold">
                                    Earning: ₹{order.deliveryBoyEarning}
                                </span>
                            </div>

                            <div className="text-sm space-y-1 text-gray-600 bg-gray-50 p-3 rounded-lg">
                                <p><strong>Pickup:</strong> {order.sellerId?.name || 'Seller Store'}</p>
                                <p><strong>Drop:</strong> {order.shippingAddress?.address}, {order.shippingAddress?.city}</p>
                                <p><strong>Distance:</strong> {order.distanceKm} KM</p>
                            </div>

                            <button
                                onClick={() => handleAcceptDelivery(order._id)}
                                disabled={acceptingId === order._id}
                                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 rounded-lg transition"
                            >
                                {acceptingId === order._id ? 'Accepting...' : 'Accept Order'}
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AvailableOrders;