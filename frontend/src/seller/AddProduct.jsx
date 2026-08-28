import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddProduct = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        productName: '',
        description: '',
        category: '',
        price: '',
        discountPrice: '',
        stock: '',
        unit: 'piece',
        images: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // ইমেজ ইউআরএলগুলোকে অ্যারেইতে কনভার্ট করা
        const imageArray = formData.images
            ? formData.images.split(',').map(url => url.trim())
            : [];

        try {
            const res = await axios.post(
                '/api/seller/product/add',
                {
                    ...formData,
                    price: Number(formData.price),
                    discountPrice: Number(formData.discountPrice) || 0,
                    stock: Number(formData.stock),
                    images: imageArray
                },
                { withCredentials: true }
            );

            if (res.status === 201) {
                navigate('/seller/products');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add product');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md my-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Add New Product</h2>

            {error && <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Product Name</label>
                    <input
                        type="text"
                        name="productName"
                        required
                        value={formData.productName}
                        onChange={handleChange}
                        className="w-full mt-1 p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                        name="description"
                        required
                        rows="3"
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full mt-1 p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                    ></textarea>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Category</label>
                        <input
                            type="text"
                            name="category"
                            required
                            value={formData.category}
                            onChange={handleChange}
                            className="w-full mt-1 p-2 border rounded-md"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Unit</label>
                        <select
                            name="unit"
                            value={formData.unit}
                            onChange={handleChange}
                            className="w-full mt-1 p-2 border rounded-md"
                        >
                            <option value="piece">Piece</option>
                            <option value="kg">KG</option>
                            <option value="gram">Gram</option>
                            <option value="liter">Liter</option>
                            <option value="packet">Packet</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Price (₹)</label>
                        <input
                            type="number"
                            name="price"
                            required
                            min="0"
                            value={formData.price}
                            onChange={handleChange}
                            className="w-full mt-1 p-2 border rounded-md"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Discount Price (₹)</label>
                        <input
                            type="number"
                            name="discountPrice"
                            min="0"
                            value={formData.discountPrice}
                            onChange={handleChange}
                            className="w-full mt-1 p-2 border rounded-md"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Stock</label>
                        <input
                            type="number"
                            name="stock"
                            required
                            min="0"
                            value={formData.stock}
                            onChange={handleChange}
                            className="w-full mt-1 p-2 border rounded-md"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Image URLs (comma separated)</label>
                    <input
                        type="text"
                        name="images"
                        placeholder="https://example.com/img1.png, https://example.com/img2.png"
                        value={formData.images}
                        onChange={handleChange}
                        className="w-full mt-1 p-2 border rounded-md"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition"
                >
                    {loading ? 'Adding Product...' : 'Add Product'}
                </button>
            </form>
        </div>
    );
};

export default AddProduct;