import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const SellerDashboard = () => {
    const [seller, setSeller] = useState(null);
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updatingLocation, setUpdatingLocation] = useState(false);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // ১. সেলারের প্রোফাইল ডেটা আনা
                const sellerRes = await axios.get('/api/seller/isAuth', { withCredentials: true });
                setSeller(sellerRes.data.seller);

                // ২. সেলারের প্রোডাক্টের তালিকা আনা
                const productRes = await axios.get('/api/seller/product/list', { withCredentials: true });
                setProducts(productRes.data.products || []);

                // ৩. সেলারের অর্ডারের তালিকা আনা
                const orderRes = await axios.get('/api/order/seller-orders', { withCredentials: true });
                setOrders(orderRes.data.orders || []);
            } catch (err) {
                console.error('Dashboard Data Error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    // স্টোর লোকেশন আপডেট করার ফাংশন (Browser Geolocation API)
    const handleUpdateLocation = () => {
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by your browser.');
            return;
        }

        setUpdatingLocation(true);
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                try {
                    const res = await axios.put(
                        '/api/seller/location',
                        { latitude, longitude },
                        { withCredentials: true }
                    );
                    alert(res.data.message || 'Location updated successfully!');
                    setSeller((prev) => ({ ...prev, location: { latitude, longitude } }));
                } catch (err) {
                    alert('Failed to update location.');
                } finally {
                    setUpdatingLocation(false);
                }
            },
            (err) => {
                alert('Permission denied or unable to fetch location.');
                setUpdatingLocation(false);
            }
        );
    };

    if (loading) {
        return <div className="text-center p-12 text-lg font-medium">Loading Dashboard...</div>;
    }

    // গণনাকৃত পরিসংখ্যান (Calculated Metrics)
    const totalOrdersCount = orders.length;
    const pendingOrdersCount = orders.filter(o => o.status === 'pending').length;
    const totalEarnings = orders
        .filter(o => o.status !== 'cancelled')
        .reduce((sum, o) => sum + (o.productTotal || 0), 0);
    const totalProductsCount = products.length;

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-xl shadow-sm border">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">
                        Welcome, {seller?.name || 'Seller'} 👋
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">Phone: {seller?.phone}</p>
                </div>
                <div>
                    <button
                        onClick={handleUpdateLocation}
                        disabled={updatingLocation}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition shadow-sm"
                    >
                        {updatingLocation ? 'Updating Location...' : '📍 Update Store Location'}
                    </button>
                </div>
            </div>

            {/* Location Missing Alert */}
            {(!seller?.location?.latitude || !seller?.location?.longitude) && (
                <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg">
                    <div className="flex items-center">
                        <span className="text-amber-800 text-sm font-medium">
                            ⚠️ Store location is missing! Please click on <strong>"Update Store Location"</strong> to enable order deliveries.
                        </span>
                    </div>
                </div>
            )}

            {/* Metrics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Total Revenue</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">₹{totalEarnings}</p>
                </div>

                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Total Orders</p>
                    <p className="text-2xl font-bold text-blue-600 mt-2">{totalOrdersCount}</p>
                </div>

                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Pending Orders</p>
                    <p className="text-2xl font-bold text-amber-600 mt-2">{pendingOrdersCount}</p>
                </div>

                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Active Products</p>
                    <p className="text-2xl font-bold text-emerald-600 mt-2">{totalProductsCount}</p>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-4">
                <Link
                    to="/seller/add-product"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
                >
                    + Add New Product
                </Link>
                <Link
                    to="/seller/products"
                    className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition"
                >
                    Manage Products
                </Link>
                <Link
                    to="/seller/orders"
                    className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition"
                >
                    View All Orders
                </Link>
            </div>

            {/* Recent Orders Section */}
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <div className="p-5 border-b flex justify-between items-center">
                    <h2 className="text-lg font-bold text-gray-800">Recent Orders</h2>
                    <Link to="/seller/orders" className="text-sm text-blue-600 hover:underline font-medium">
                        View All
                    </Link>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 border-b text-gray-600">
                            <tr>
                                <th className="p-3">Order ID</th>
                                <th className="p-3">Product</th>
                                <th className="p-3">Amount</th>
                                <th className="p-3">Payment</th>
                                <th className="p-3">Status</th>
                                <th className="p-3">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {orders.slice(0, 5).length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center p-6 text-gray-500">
                                        No recent orders found.
                                    </td>
                                </tr>
                            ) : (
                                orders.slice(0, 5).map((ord) => (
                                    <tr key={ord._id} className="hover:bg-gray-50">
                                        <td className="p-3 font-mono text-xs text-gray-500">
                                            #{ord._id.substring(ord._id.length - 8)}
                                        </td>
                                        <td className="p-3 font-medium text-gray-800">{ord.productName}</td>
                                        <td className="p-3 font-semibold">₹{ord.totalAmount}</td>
                                        <td className="p-3">
                                            <span className="text-xs uppercase px-2 py-0.5 rounded bg-gray-100 font-medium">
                                                {ord.paymentMethod}
                                            </span>
                                        </td>
                                        <td className="p-3">
                                            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                                                ord.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                                                ord.status === 'delivered' ? 'bg-emerald-100 text-emerald-800' :
                                                'bg-blue-100 text-blue-800'
                                            }`}>
                                                {ord.status}
                                            </span>
                                        </td>
                                        <td className="p-3">
                                            <Link
                                                to={`/seller/order/${ord._id}`}
                                                className="text-blue-600 hover:underline text-xs font-medium"
                                            >
                                                Details
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default SellerDashboard;