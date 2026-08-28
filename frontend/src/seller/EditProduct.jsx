import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const EditProduct = () => {
    const { productId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
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

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await axios.get(`/api/seller/product/${productId}`, { withCredentials: true });
                const prod = res.data.product;
                setFormData({
                    productName: prod.productName,
                    description: prod.description,
                    category: prod.category,
                    price: prod.price,
                    discountPrice: prod.discountPrice,
                    stock: prod.stock,
                    unit: prod.unit,
                    images: prod.images ? prod.images.join(', ') : ''
                });
            } catch (err) {
                alert('Failed to load product details');
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [productId]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUpdating(true);

        const imageArray = formData.images
            ? formData.images.split(',').map(url => url.trim())
            : [];

        try {
            await axios.put(
                `/api/seller/product/update/${productId}`,
                {
                    ...formData,
                    price: Number(formData.price),
                    discountPrice: Number(formData.discountPrice),
                    stock: Number(formData.stock),
                    images: imageArray
                },
                { withCredentials: true }
            );
            navigate('/seller/products');
        } catch (err) {
            alert(err.response?.data?.message || 'Update failed');
        } finally {
            setUpdating(false);
        }
    };

    if (loading) return <div className="text-center p-8">Loading product details...</div>;

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md my-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Edit Product</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium">Product Name</label>
                    <input type="text" name="productName" value={formData.productName} onChange={handleChange} required className="w-full p-2 border rounded" />
                </div>
                <div>
                    <label className="block text-sm font-medium">Description</label>
                    <textarea name="description" value={formData.description} onChange={handleChange} required rows="3" className="w-full p-2 border rounded" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium">Category</label>
                        <input type="text" name="category" value={formData.category} onChange={handleChange} required className="w-full p-2 border rounded" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Unit</label>
                        <input type="text" name="unit" value={formData.unit} onChange={handleChange} className="w-full p-2 border rounded" />
                    </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium">Price (₹)</label>
                        <input type="number" name="price" value={formData.price} onChange={handleChange} required className="w-full p-2 border rounded" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Discount Price (₹)</label>
                        <input type="number" name="discountPrice" value={formData.discountPrice} onChange={handleChange} className="w-full p-2 border rounded" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Stock</label>
                        <input type="number" name="stock" value={formData.stock} onChange={handleChange} required className="w-full p-2 border rounded" />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium">Image URLs</label>
                    <input type="text" name="images" value={formData.images} onChange={handleChange} className="w-full p-2 border rounded" />
                </div>
                <button type="submit" disabled={updating} className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700">
                    {updating ? 'Updating...' : 'Update Product'}
                </button>
            </form>
        </div>
    );
};

export default EditProduct;