import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const SellerProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchProducts = async () => {
        try {
            const res = await axios.get('/api/seller/product/list', { withCredentials: true });
            setProducts(res.data.products);
        } catch (err) {
            console.error('Error fetching products:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const toggleStatus = async (id) => {
        try {
            await axios.patch(`/api/seller/product/status/${id}`, {}, { withCredentials: true });
            fetchProducts();
        } catch (err) {
            alert('Failed to update status');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await axios.delete(`/api/seller/product/delete/${id}`, { withCredentials: true });
                setProducts(products.filter(p => p._id !== id));
            } catch (err) {
                alert('Failed to delete product');
            }
        }
    };

    if (loading) return <div className="text-center p-8">Loading products...</div>;

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">My Products</h1>
                <Link to="/seller/add-product" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                    + Add New Product
                </Link>
            </div>

            <div className="overflow-x-auto bg-white rounded-lg shadow">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-100 border-b">
                            <th className="p-3">Image</th>
                            <th className="p-3">Name</th>
                            <th className="p-3">Category</th>
                            <th className="p-3">Price</th>
                            <th className="p-3">Stock</th>
                            <th className="p-3">Status</th>
                            <th className="p-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="text-center p-4">No products found.</td>
                            </tr>
                        ) : (
                            products.map(prod => (
                                <tr key={prod._id} className="border-b hover:bg-gray-50">
                                    <td className="p-3">
                                        <img
                                            src={prod.images[0] || 'https://via.placeholder.com/50'}
                                            alt={prod.productName}
                                            className="w-12 h-12 object-cover rounded"
                                        />
                                    </td>
                                    <td className="p-3 font-medium">{prod.productName}</td>
                                    <td className="p-3">{prod.category}</td>
                                    <td className="p-3">
                                        ₹{prod.price} {prod.discountPrice > 0 && <span className="text-xs text-green-600 block">(Disc: ₹{prod.discountPrice})</span>}
                                    </td>
                                    <td className="p-3">{prod.stock} {prod.unit}</td>
                                    <td className="p-3">
                                        <button
                                            onClick={() => toggleStatus(prod._id)}
                                            className={`px-3 py-1 rounded-full text-xs ${
                                                prod.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                            }`}
                                        >
                                            {prod.isActive ? 'Active' : 'Inactive'}
                                        </button>
                                    </td>
                                    <td className="p-3 space-x-2">
                                        <Link to={`/seller/edit-product/${prod._id}`} className="text-blue-600 hover:underline">Edit</Link>
                                        <button onClick={() => handleDelete(prod._id)} className="text-red-600 hover:underline">Delete</button>
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

export default SellerProducts;