import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const SellerOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [acceptingId, setAcceptingId] = useState(null);

    const fetchOrders = async () => {
        try {
            const res = await axios.get('/api/order/seller-orders', { withCredentials: true });
            setOrders(res.data.orders);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleAcceptOrder = async (orderId) => {
        setAcceptingId(orderId);
        try {
            const res = await axios.patch(
                `/api/order/seller-accept/${orderId}`,
                {},
                { withCredentials: true }
            );
            alert(res.data.message || 'Order accepted successfully');
            fetchOrders();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to accept order');
        } finally {
            setAcceptingId(null);
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'pending':
                return <span className="bg-yellow-100 text-yellow-800 text-xs px-2.5 py-0.5 rounded font-medium">Pending</span>;
            case 'ready_for_shipping':
                return <span className="bg-blue-100 text-blue-800 text-xs px-2.5 py-0.5 rounded font-medium">Ready for Shipping</span>;
            case 'assigned':
                return <span className="bg-indigo-100 text-indigo-800 text-xs px-2.5 py-0.5 rounded font-medium">Delivery Boy Assigned</span>;
            case 'delivered':
                return <span className="bg-green-100 text-green-800 text-xs px-2.5 py-0.5 rounded font-medium">Delivered</span>;
            case 'cancelled':
                return <span className="bg-red-100 text-red-800 text-xs px-2.5 py-0.5 rounded font-medium">Cancelled</span>;
            default:
                return <span className="bg-gray-100 text-gray-800 text-xs px-2.5 py-0.5 rounded font-medium">{status}</span>;
        }
    };

    if (loading) return <div className="text-center p-8">Loading seller orders...</div>;

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Seller Orders</h1>

            {error && <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">{error}</div>}

            <div className="overflow-x-auto bg-white rounded-lg shadow">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-100 border-b text-sm font-semibold text-gray-700">
                            <th className="p-3">Order ID</th>
                            <th className="p-3">Product</th>
                            <th className="p-3">Customer</th>
                            <th className="p-3">Total Amount</th>
                            <th className="p-3">Payment</th>
                            <th className="p-3">Status</th>
                            <th className="p-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 text-sm">
                        {orders.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="text-center p-6 text-gray-500">No orders received yet.</td>
                            </tr>
                        ) : (
                            orders.map((order) => (
                                <tr key={order._id} className="hover:bg-gray-50">
                                    <td className="p-3 font-mono text-xs text-gray-600">
                                        #{order._id.substring(order._id.length - 8)}
                                    </td>
                                    <td className="p-3 font-medium text-gray-800">
                                        {order.productName} <span className="text-xs text-gray-500">(x{order.quantity})</span>
                                    </td>
                                    <td className="p-3">
                                        <div>{order.customerId?.name || order.shippingAddress?.name}</div>
                                        <div className="text-xs text-gray-500">{order.shippingAddress?.phone}</div>
                                    </td>
                                    <td className="p-3 font-semibold text-gray-800">
                                        ₹{order.totalAmount}
                                    </td>
                                    <td className="p-3">
                                        <span className={`text-xs px-2 py-0.5 rounded font-medium ${
                                            order.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                                        }`}>
                                            {order.paymentMethod} ({order.paymentStatus})
                                        </span>
                                    </td>
                                    <td className="p-3">
                                        {getStatusBadge(order.status)}
                                    </td>
                                    <td className="p-3 space-x-2">
                                        {order.status === 'pending' && (
                                            <button
                                                onClick={() => handleAcceptOrder(order._id)}
                                                disabled={acceptingId === order._id}
                                                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs font-medium transition"
                                            >
                                                {acceptingId === order._id ? 'Accepting...' : 'Accept Order'}
                                            </button>
                                        )}
                                        <Link
                                            to={`/seller/order/${order._id}`}
                                            className="text-blue-600 hover:underline text-xs font-medium"
                                        >
                                            View Details
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SellerOrders;