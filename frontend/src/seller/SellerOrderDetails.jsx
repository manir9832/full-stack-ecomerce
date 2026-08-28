import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';

const SellerOrderDetails = () => {
    const { orderId } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                const res = await axios.get('/api/order/seller-orders', { withCredentials: true });
                const foundOrder = res.data.orders.find(o => o._id === orderId);
                if (foundOrder) {
                    setOrder(foundOrder);
                } else {
                    setError('Order not found');
                }
            } catch (err) {
                setError('Failed to fetch order details');
            } finally {
                setLoading(false);
            }
        };
        fetchOrderDetails();
    }, [orderId]);

    if (loading) return <div className="text-center p-8">Loading order details...</div>;
    if (error || !order) return <div className="text-center p-8 text-red-600">{error || 'Order not found'}</div>;

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg my-8">
            <div className="flex justify-between items-center border-b pb-4 mb-6">
                <div>
                    <h1 className="text-xl font-bold text-gray-800">Order #{order._id}</h1>
                    <p className="text-sm text-gray-500">Placed on: {new Date(order.createdAt).toLocaleString()}</p>
                </div>
                <Link to="/seller/orders" className="text-blue-600 hover:underline text-sm font-medium">
                    &larr; Back to Orders
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Product Summary */}
                <div className="border p-4 rounded-lg bg-gray-50">
                    <h2 className="font-semibold text-gray-700 mb-3 border-b pb-2">Product Details</h2>
                    <div className="flex items-center space-x-4">
                        {order.productId?.images?.[0] && (
                            <img src={order.productId.images[0]} alt={order.productName} className="w-16 h-16 object-cover rounded" />
                        )}
                        <div>
                            <p className="font-medium text-gray-800">{order.productName}</p>
                            <p className="text-sm text-gray-600">Quantity: {order.quantity}</p>
                            <p className="text-sm text-gray-600">Price per unit: ₹{order.price}</p>
                        </div>
                    </div>
                </div>

                {/* Shipping Address */}
                <div className="border p-4 rounded-lg bg-gray-50">
                    <h2 className="font-semibold text-gray-700 mb-3 border-b pb-2">Customer Address</h2>
                    <p className="font-medium text-gray-800">{order.shippingAddress?.name}</p>
                    <p className="text-sm text-gray-600">{order.shippingAddress?.address}</p>
                    <p className="text-sm text-gray-600">{order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}</p>
                    <p className="text-sm text-gray-600 mt-2"><strong>Phone:</strong> {order.shippingAddress?.phone}</p>
                </div>

                {/* Bill Breakdown */}
                <div className="border p-4 rounded-lg bg-gray-50">
                    <h2 className="font-semibold text-gray-700 mb-3 border-b pb-2">Payment Breakdown</h2>
                    <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                            <span>Product Total:</span>
                            <span>₹{order.productTotal}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Delivery Charge:</span>
                            <span>₹{order.deliveryCharge}</span>
                        </div>
                        <div className="flex justify-between font-bold text-base border-t pt-2 mt-2">
                            <span>Total Amount:</span>
                            <span>₹{order.totalAmount}</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                            Payment Method: <strong>{order.paymentMethod}</strong> ({order.paymentStatus})
                        </p>
                    </div>
                </div>

                {/* Delivery Boy Info */}
                <div className="border p-4 rounded-lg bg-gray-50">
                    <h2 className="font-semibold text-gray-700 mb-3 border-b pb-2">Delivery Boy Status</h2>
                    {order.deliveryBoyId ? (
                        <div>
                            <p className="font-medium text-gray-800">{order.deliveryBoyId.name}</p>
                            <p className="text-sm text-gray-600">Phone: {order.deliveryBoyId.phone}</p>
                            <p className="text-xs text-gray-500 mt-1">
                                Assigned At: {order.deliveryAcceptedAt ? new Date(order.deliveryAcceptedAt).toLocaleString() : 'N/A'}
                            </p>
                        </div>
                    ) : (
                        <p className="text-sm text-yellow-700 bg-yellow-50 p-2 rounded">
                            {order.status === 'pending'
                                ? 'Accept order to assign delivery boy.'
                                : 'Waiting for a delivery boy to accept...'}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SellerOrderDetails;