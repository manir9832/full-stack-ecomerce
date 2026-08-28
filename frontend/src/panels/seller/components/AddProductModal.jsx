
// import React, { useState } from 'react';
// import { addProduct } from '../../../api/sellerProductApi';

// const AddProductModal = ({ isOpen, onClose, onProductAdded }) => {
//   const [formData, setFormData] = useState({
//     title: '',
//     description: '',
//     price: '',
//     discountPrice: '',
//     stock: '',
//     category: 'Grocery',
//     unit: '1 kg',
//   });
//   const [imageFiles, setImageFiles] = useState([]);
//   const [loading, setLoading] = useState(false);

//   if (!isOpen) return null;

//   const handleFileChange = (e) => {
//     const files = Array.from(e.target.files);
//     if (files.length > 3) {
//       alert('You can select up to 3 images only');
//       return;
//     }
//     setImageFiles(files);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!formData.title || !formData.price || !formData.stock || imageFiles.length === 0) {
//       alert('Please fill in Product Name, Price, Stock, and select at least 1 image!');
//       return;
//     }

//     try {
//       setLoading(true);
//       const data = new FormData();
//       data.append('productName', formData.title.trim());
//       data.append('title', formData.title.trim());
//       data.append('description', formData.description.trim() || `${formData.title.trim()} - Fresh grocery item`);
//       data.append('category', formData.category);
//       data.append('price', String(formData.price));
//       data.append('discountPrice', String(formData.discountPrice || 0));
//       data.append('stock', String(formData.stock));
//       data.append('unit', formData.unit || '1 kg');

//       // ফাইল অ্যাপেন্ড
//       imageFiles.forEach((file) => {
//         data.append('images', file);
//       });

//       const res = await addProduct(data);
//       if (res.data?.success || res.status === 201) {
//         alert('✅ Product added successfully!');
//         if (onProductAdded) onProductAdded();
//         onClose();
//         setFormData({
//           title: '',
//           description: '',
//           price: '',
//           discountPrice: '',
//           stock: '',
//           category: 'Grocery',
//           unit: '1 kg',
//         });
//         setImageFiles([]);
//       }
//     } catch (err) {
//       console.error('Failed to add product:', err);
//       alert(err.response?.data?.message || 'Failed to add product.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
//       <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
//         <div className="flex justify-between items-center border-b pb-3">
//           <h3 className="font-black text-slate-900 text-lg">Add New Product</h3>
//           <button onClick={onClose} className="text-slate-400 hover:text-slate-700 text-lg font-bold">
//             ✕
//           </button>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-3.5">
//           <div>
//             <label className="text-xs font-bold text-slate-700">Product Name / Title *</label>
//             <input
//               type="text"
//               value={formData.title}
//               onChange={(e) => setFormData({ ...formData, title: e.target.value })}
//               className="w-full border rounded-xl p-2.5 text-xs font-bold outline-none focus:ring-2 focus:ring-emerald-500"
//               placeholder="e.g. Miniket Premium Rice"
//               required
//             />
//           </div>

//           <div>
//             <label className="text-xs font-bold text-slate-700">Product Description</label>
//             <textarea
//               value={formData.description}
//               onChange={(e) => setFormData({ ...formData, description: e.target.value })}
//               className="w-full border rounded-xl p-2.5 text-xs outline-none focus:ring-2 focus:ring-emerald-500"
//               placeholder="Write product quality, fresh origins, package details..."
//               rows={3}
//             />
//           </div>

//           <div className="grid grid-cols-2 gap-3">
//             <div>
//               <label className="text-xs font-bold text-slate-700">Category</label>
//               <select
//                 value={formData.category}
//                 onChange={(e) => setFormData({ ...formData, category: e.target.value })}
//                 className="w-full border rounded-xl p-2.5 text-xs font-bold outline-none"
//               >
//                 <option value="Grocery">Grocery (Rice, Lentils, Oil)</option>
//                 <option value="Dairy">Dairy (Milk, Ghee, Paneer)</option>
//                 <option value="Snacks">Snacks & Beverages</option>
//                 <option value="Meat & Fish">Meat & Fish</option>
//                 <option value="Vegetables">Vegetables & Fruits</option>
//               </select>
//             </div>

//             <div>
//               <label className="text-xs font-bold text-slate-700">Unit *</label>
//               <input
//                 type="text"
//                 value={formData.unit}
//                 onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
//                 className="w-full border rounded-xl p-2.5 text-xs font-bold outline-none"
//                 placeholder="1 kg / 500 ml / 1 packet"
//                 required
//               />
//             </div>
//           </div>

//           <div className="grid grid-cols-3 gap-2">
//             <div>
//               <label className="text-xs font-bold text-slate-700">Price (₹) *</label>
//               <input
//                 type="number"
//                 value={formData.price}
//                 onChange={(e) => setFormData({ ...formData, price: e.target.value })}
//                 className="w-full border rounded-xl p-2.5 text-xs font-bold outline-none focus:ring-2 focus:ring-emerald-500"
//                 placeholder="65"
//                 required
//               />
//             </div>

//             <div>
//               <label className="text-xs font-bold text-slate-700">Discount Price (₹)</label>
//               <input
//                 type="number"
//                 value={formData.discountPrice}
//                 onChange={(e) => setFormData({ ...formData, discountPrice: e.target.value })}
//                 className="w-full border rounded-xl p-2.5 text-xs font-bold outline-none"
//                 placeholder="60"
//               />
//             </div>

//             <div>
//               <label className="text-xs font-bold text-slate-700">Stock Count *</label>
//               <input
//                 type="number"
//                 value={formData.stock}
//                 onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
//                 className="w-full border rounded-xl p-2.5 text-xs font-bold outline-none focus:ring-2 focus:ring-emerald-500"
//                 placeholder="50"
//                 required
//               />
//             </div>
//           </div>

//           <div>
//             <label className="text-xs font-bold text-slate-700">
//               Product Images (Select 1 to 3 images) *
//             </label>
//             <input
//               type="file"
//               accept="image/*"
//               multiple
//               onChange={handleFileChange}
//               className="w-full border rounded-xl p-2 text-xs text-slate-600 mt-1 file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-emerald-50 file:text-emerald-700"
//               required
//             />
//             <span className="text-[11px] text-slate-400">
//               {imageFiles.length > 0 ? `${imageFiles.length} images selected` : 'Max 3 images'}
//             </span>
//           </div>

//           <div className="flex gap-3 pt-2">
//             <button
//               type="submit"
//               disabled={loading}
//               className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3 rounded-xl shadow-md transition disabled:bg-slate-400 text-xs"
//             >
//               {loading ? 'Uploading Images...' : 'Save Product'}
//             </button>
//             <button
//               type="button"
//               onClick={onClose}
//               className="px-5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-xl text-xs"
//             >
//               Cancel
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AddProductModal;






















import React, { useState } from 'react';
import { addProduct } from '../../../api/sellerProductApi';

const AddProductModal = ({ isOpen, onClose, onProductAdded }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    discountPrice: '',
    stock: '',
    category: 'Grocery',
    unit: '1 kg',
  });

  // ৩টি আলাদা স্লটের জন্য স্টেট
  const [slot1, setSlot1] = useState(null);
  const [slot2, setSlot2] = useState(null);
  const [slot3, setSlot3] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.price || !formData.stock || !slot1) {
      alert('Please provide Product Name, Price, Stock, and at least the Main Image (Slot 1)!');
      return;
    }

    try {
      setLoading(true);
      const data = new FormData();
      data.append('productName', formData.title.trim());
      data.append('title', formData.title.trim());
      data.append('description', formData.description.trim() || `${formData.title.trim()} - Fresh grocery item`);
      data.append('category', formData.category);
      data.append('price', String(formData.price));
      data.append('discountPrice', String(formData.discountPrice || 0));
      data.append('stock', String(formData.stock));
      data.append('unit', formData.unit || '1 kg');

      // ৩টি স্লট থেকে ফাইল অ্যাপেন্ড করা
      if (slot1) data.append('images', slot1);
      if (slot2) data.append('images', slot2);
      if (slot3) data.append('images', slot3);

      const res = await addProduct(data);
      if (res.data?.success || res.status === 201) {
        alert('✅ Product with multiple images added successfully!');
        if (onProductAdded) onProductAdded();
        onClose();
        setFormData({
          title: '',
          description: '',
          price: '',
          discountPrice: '',
          stock: '',
          category: 'Grocery',
          unit: '1 kg',
        });
        setSlot1(null);
        setSlot2(null);
        setSlot3(null);
      }
    } catch (err) {
      console.error('Failed to add product:', err);
      alert(err.response?.data?.message || 'Failed to add product.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center border-b pb-3">
          <h3 className="font-black text-slate-900 text-lg">Add New Product</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 text-lg font-bold">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="text-xs font-bold text-slate-700">Product Name / Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full border rounded-xl p-2.5 text-xs font-bold outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="e.g. Fresh Red Apple"
              required
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700">Product Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full border rounded-xl p-2.5 text-xs outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Write fresh details, quality, farm origins..."
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full border rounded-xl p-2.5 text-xs font-bold outline-none"
              >
                <option value="Grocery">Grocery</option>
                <option value="Dairy">Dairy</option>
                <option value="Snacks">Snacks</option>
                <option value="Vegetables">Vegetables & Fruits</option>
                <option value="Meat & Fish">Meat & Fish</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700">Unit *</label>
              <input
                type="text"
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                className="w-full border rounded-xl p-2.5 text-xs font-bold outline-none"
                placeholder="1 kg / 1 pack"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-xs font-bold text-slate-700">Price (₹) *</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full border rounded-xl p-2.5 text-xs font-bold outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="100"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700">Discount (₹)</label>
              <input
                type="number"
                value={formData.discountPrice}
                onChange={(e) => setFormData({ ...formData, discountPrice: e.target.value })}
                className="w-full border rounded-xl p-2.5 text-xs font-bold outline-none"
                placeholder="90"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700">Stock *</label>
              <input
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                className="w-full border rounded-xl p-2.5 text-xs font-bold outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="25"
                required
              />
            </div>
          </div>

          {/* 🖼️ ৩টি স্পষ্ট ফটো আপলোড স্লট */}
          <div className="border rounded-2xl p-3 bg-slate-50 space-y-2">
            <label className="text-xs font-extrabold text-slate-800 block">
              Product Images (Upload up to 3 Photos)
            </label>

            <div className="grid grid-cols-3 gap-2">
              {/* Slot 1 */}
              <div className="relative h-24 rounded-xl border-2 border-dashed border-slate-300 bg-white flex flex-col items-center justify-center overflow-hidden">
                {slot1 ? (
                  <>
                    <img src={URL.createObjectURL(slot1)} alt="Slot 1" className="w-full h-full object-contain p-1" />
                    <button
                      type="button"
                      onClick={() => setSlot1(null)}
                      className="absolute top-1 right-1 bg-rose-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold"
                    >
                      ✕
                    </button>
                    <span className="absolute bottom-1 left-1 bg-black/70 text-white text-[8px] px-1 rounded">Main</span>
                  </>
                ) : (
                  <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-slate-100 transition">
                    <span className="text-lg">📷</span>
                    <span className="text-[10px] text-slate-500 font-bold">Image 1 *</span>
                    <input type="file" accept="image/*" onChange={(e) => setSlot1(e.target.files[0])} className="hidden" />
                  </label>
                )}
              </div>

              {/* Slot 2 */}
              <div className="relative h-24 rounded-xl border-2 border-dashed border-slate-300 bg-white flex flex-col items-center justify-center overflow-hidden">
                {slot2 ? (
                  <>
                    <img src={URL.createObjectURL(slot2)} alt="Slot 2" className="w-full h-full object-contain p-1" />
                    <button
                      type="button"
                      onClick={() => setSlot2(null)}
                      className="absolute top-1 right-1 bg-rose-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold"
                    >
                      ✕
                    </button>
                    <span className="absolute bottom-1 left-1 bg-black/70 text-white text-[8px] px-1 rounded">Side</span>
                  </>
                ) : (
                  <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-slate-100 transition">
                    <span className="text-lg">📷</span>
                    <span className="text-[10px] text-slate-500 font-bold">Image 2</span>
                    <input type="file" accept="image/*" onChange={(e) => setSlot2(e.target.files[0])} className="hidden" />
                  </label>
                )}
              </div>

              {/* Slot 3 */}
              <div className="relative h-24 rounded-xl border-2 border-dashed border-slate-300 bg-white flex flex-col items-center justify-center overflow-hidden">
                {slot3 ? (
                  <>
                    <img src={URL.createObjectURL(slot3)} alt="Slot 3" className="w-full h-full object-contain p-1" />
                    <button
                      type="button"
                      onClick={() => setSlot3(null)}
                      className="absolute top-1 right-1 bg-rose-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold"
                    >
                      ✕
                    </button>
                    <span className="absolute bottom-1 left-1 bg-black/70 text-white text-[8px] px-1 rounded">Back</span>
                  </>
                ) : (
                  <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-slate-100 transition">
                    <span className="text-lg">📷</span>
                    <span className="text-[10px] text-slate-500 font-bold">Image 3</span>
                    <input type="file" accept="image/*" onChange={(e) => setSlot3(e.target.files[0])} className="hidden" />
                  </label>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3 rounded-xl shadow-md transition disabled:bg-slate-400 text-xs"
            >
              {loading ? 'Uploading Images...' : 'Save Product'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-xl text-xs"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;