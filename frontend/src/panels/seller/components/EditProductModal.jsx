import React, { useState, useEffect } from 'react';
import API from '../../../api/axiosConfig';

const EditProductModal = ({ isOpen, onClose, product, onProductUpdated }) => {
  const [formData, setFormData] = useState({
    productName: '',
    category: '',
    price: '',
    unit: '',
    stock: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData({
        productName: product.productName || product.title || '',
        category: product.category || 'Dairy',
        price: product.price || '',
        unit: product.unit || '1 kg',
        stock: product.stock ?? 50,
      });
      setPreviewUrl(product.images?.[0] || product.image || '');
      setImageFile(null);
    }
  }, [product]);

  if (!isOpen || !product) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setUpdating(true);

      const data = new FormData();
      data.append('productName', formData.productName);
      data.append('category', formData.category);
      data.append('price', formData.price);
      data.append('unit', formData.unit);
      data.append('stock', formData.stock);

      if (imageFile) {
        data.append('image', imageFile);
      }

      await API.put(`/seller/products/update/${product._id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      alert('Product updated successfully!');
      onProductUpdated();
      onClose();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update product');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl space-y-4">
        <div className="flex justify-between items-center border-b pb-3">
          <h3 className="font-extrabold text-slate-800 text-base">Edit Product</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 font-bold text-lg">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Product Name</label>
            <input
              type="text"
              name="productName"
              value={formData.productName}
              onChange={handleChange}
              required
              className="w-full text-xs px-3 py-2 border rounded-lg focus:outline-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Price (₹)</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                className="w-full text-xs px-3 py-2 border rounded-lg focus:outline-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Unit</label>
              <input
                type="text"
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                placeholder="e.g. 1 kg, 500 ml"
                className="w-full text-xs px-3 py-2 border rounded-lg focus:outline-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full text-xs px-3 py-2 border rounded-lg focus:outline-emerald-500"
              >
                <option value="Dairy">Dairy</option>
                <option value="Vegetables">Vegetables</option>
                <option value="Fruits">Fruits</option>
                <option value="Groceries">Groceries</option>
                <option value="Snacks">Snacks</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Stock</label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                className="w-full text-xs px-3 py-2 border rounded-lg focus:outline-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Update Image (Optional)</label>
            <div className="flex items-center gap-3">
              {previewUrl && (
                <img src={previewUrl} alt="Preview" className="w-12 h-12 rounded-lg border object-cover" />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="text-xs text-slate-500 file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:bg-slate-100 file:font-bold hover:file:bg-slate-200"
              />
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="w-1/2 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-lg hover:bg-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={updating}
              className="w-1/2 py-2 bg-emerald-600 text-white text-xs font-bold rounded-lg hover:bg-emerald-700 disabled:opacity-50"
            >
              {updating ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductModal;