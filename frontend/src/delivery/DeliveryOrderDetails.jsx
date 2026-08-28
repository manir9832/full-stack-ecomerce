import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DeliveryOrderDetails = () => {
    const [myOrders, setMyOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState(null);

    const fetchMyOrders = async () => {
        try {
            const res = await axios.get('/api/delivery/orders', { withCredentials: true });
            setMyOrders(res.data.orders || []);
        } catch (err) {
            console.error('Error fetching my orders:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyOrders();
    }, []);

    const updateStatus = async (orderId, endpoint) => {
        setUpdatingId(orderId);
        try {
            const res = await axios.patch(`/api/delivery/${endpoint}/${orderId}`, {}, { withCredentials: true });
            alert(res.data.message || 'Status updated');
            fetchMyOrders();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to update status');
        } finally {
            setUpdatingId(null);
        }
    };

    if (loading) return <div className="text-center p-8">Loading your deliveries...</div>;

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">My Assigned Deliveries</h1>

            {myOrders.length === 0 ? (
                <div className="bg-white p-6 rounded-xl shadow text-center text-gray-500">
                    You have no active or previous delivery orders.
                </div>
            ) : (
                <div className="space-y-4">
                    {myOrders.map((order) => (
                        <div key={order._id} className="bg-white p-5 rounded-xl shadow-sm border space-y-4">
                            <div className="flex flex-wrap justify-between items-center border-b pb-3">
                                <div>
                                    <span className="text-xs text-gray-500 font-mono">Order #{order._id}</span>
                                    <h3 className="font-bold text-gray-800 text-lg">{order.productName} (x{order.quantity})</h3>
                                </div>
                                <span className="text-sm font-semibold px-3 py-1 bg-blue-100 text-blue-800 rounded-full uppercase">
                                    {order.status}
                                </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <p className="font-semibold text-gray-700">Pickup Store:</p>
                                    <p>{order.sellerId?.name}</p>
                                    <p className="text-xs text-gray-500">Phone: {order.sellerId?.phone}</p>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <p className="font-semibold text-gray-700">Customer Address:</p>
                                    <p>{order.shippingAddress?.name}</p>
                                    <p>{order.shippingAddress?.address}, {order.shippingAddress?.city}</p>
                                    <p className="text-xs text-gray-500">Phone: {order.shippingAddress?.phone}</p>
                                </div>
                            </div>

                            <div className="flex justify-between items-center text-sm font-medium">
                                <span>Collect Amount: <strong>₹{order.totalAmount} ({order.paymentMethod})</strong></span>
                                <span className="text-emerald-600">Your Earning: ₹{order.deliveryBoyEarning}</span>
                            </div>

                            {/* Actions according to Order Status */}
                            <div className="pt-2">
                                {order.status === 'assigned' && (
                                    <button
                                        onClick={() => updateStatus(order._id, 'picked-up')}
                                        disabled={updatingId === order._id}
                                        className="w-full bg-amber-600 hover:bg-amber-700 text-white font-medium py-2 rounded-lg transition"
                                    >
                                        Mark as Picked Up
                                    </button>
                                )}

                                {order.status === 'picked_up' && (
                                    <button
                                        onClick={() => updateStatus(order._id, 'out-for-delivery')}
                                        disabled={updatingId === order._id}
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition"
                                    >
                                        Mark Out for Delivery
                                    </button>
                                )}

                                {order.status === 'out_for_delivery' && (
                                    <button
                                        onClick={() => updateStatus(order._id, 'delivered')}
                                        disabled={updatingId === order._id}
                                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 rounded-lg transition"
                                    >
                                        Mark Delivered
                                    </button>
                                )}

                                {order.status === 'delivered' && (
                                    <p className="text-center text-sm text-green-600 font-semibold">
                                        ✓ Delivered at {order.deliveredAt ? new Date(order.deliveredAt).toLocaleString() : ''}
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default DeliveryOrderDetails;