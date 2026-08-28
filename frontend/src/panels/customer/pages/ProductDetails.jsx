

// import React, { useEffect, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { useDispatch } from 'react-redux';
// import { addToCart } from '../../../redux/slices/cartSlice';
// import API from '../../../api/axiosConfig';
// import Loader from '../../../components/common/Loader';
// import OneHourDeliveryBadge from '../../../components/badges/OneHourDeliveryBadge';

// const ProductDetails = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   const [product, setProduct] = useState(null);
//   const [selectedImage, setSelectedImage] = useState('');
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchProduct = async () => {
//       try {
//         setLoading(true);
//         const res = await API.get(`/products/${id}`).catch(() =>
//           API.get(`/product/${id}`)
//         );
//         if (res.data?.product) {
//           setProduct(res.data.product);
//           const imgs = res.data.product.images || [];
//           setSelectedImage(imgs[0] || res.data.product.image || 'https://placehold.co/400x400?text=Product');
//         }
//       } catch (err) {
//         console.error('Failed to fetch product details:', err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchProduct();
//   }, [id]);

//   if (loading) return <Loader text="Loading product details..." />;
//   if (!product) return <div className="p-8 text-center text-slate-500 font-bold">Product not found!</div>;

//   const imagesList =
//     product.images && product.images.length > 0
//       ? product.images
//       : [product.image || 'https://placehold.co/400x400?text=Product'];

//   return (
//     <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
//       <button
//         onClick={() => navigate(-1)}
//         className="text-xs font-bold text-slate-500 hover:text-slate-900 transition"
//       >
//         ← Back to Shopping
//       </button>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-6 sm:p-8 rounded-3xl border shadow-sm">
//         {/* ছবি ও থাম্বনেইল গ্যালারি */}
//         <div className="space-y-4">
//           <div className="w-full h-80 bg-slate-50 border rounded-2xl flex items-center justify-center p-4">
//             <img
//               src={selectedImage}
//               alt={product.productName || product.title}
//               className="max-h-full max-w-full object-contain"
//             />
//           </div>

//           {imagesList.length > 1 && (
//             <div className="flex gap-2 overflow-x-auto pb-2">
//               {imagesList.map((img, idx) => (
//                 <button
//                   key={idx}
//                   onClick={() => setSelectedImage(img)}
//                   className={`w-16 h-16 rounded-xl border p-1 bg-slate-50 transition ${
//                     selectedImage === img
//                       ? 'border-emerald-600 ring-2 ring-emerald-200'
//                       : 'border-slate-200'
//                   }`}
//                 >
//                   <img src={img} alt="" className="w-full h-full object-contain" />
//                 </button>
//               ))}
//             </div>
//           )}
//         </div>

//         {/* পণ্যের বিবরণ ও কার্ট অ্যাকশন */}
//         <div className="space-y-4 flex flex-col justify-center">
//           <OneHourDeliveryBadge />
//           <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
//             {product.productName || product.title}
//           </h1>
//           <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">
//             Category: {product.category}
//           </span>

//           <div className="text-3xl font-black text-emerald-600">
//             ₹{product.price}{' '}
//             <span className="text-xs text-slate-400 font-normal">
//               / {product.unit || 'piece'}
//             </span>
//           </div>

//           <div className="border-t border-b py-3 space-y-1">
//             <h4 className="text-xs font-bold uppercase text-slate-400">Description</h4>
//             <p className="text-slate-600 text-sm leading-relaxed">
//               {product.description || 'Fresh grocery item direct from verified seller.'}
//             </p>
//             {product.sellerId && (
//               <p className="text-xs text-slate-500 pt-2">
//                 🏪 <strong>Store:</strong> {product.sellerId.storeAddress || product.sellerId.name}
//               </p>
//             )}
//           </div>

//           <button
//             onClick={() => dispatch(addToCart(product))}
//             className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3.5 rounded-xl shadow-lg transition active:scale-95 text-sm"
//           >
//             Add to Cart 🛒
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductDetails;

















import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../../redux/slices/cartSlice';
import API from '../../../api/axiosConfig';
import Loader from '../../../components/common/Loader';
import OneHourDeliveryBadge from '../../../components/badges/OneHourDeliveryBadge';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await API.get(`/products/${id}`).catch(() =>
          API.get(`/product/${id}`)
        );
        if (res.data?.product) {
          const prod = res.data.product;
          setProduct(prod);

          // সব ছবির লিস্ট বের করা
          const imgs =
            prod.images && prod.images.length > 0
              ? prod.images
              : [prod.image || 'https://placehold.co/400x400?text=Product'];

          setSelectedImage(imgs[0]);
        }
      } catch (err) {
        console.error('Failed to fetch product details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <Loader text="Loading product details..." />;
  if (!product)
    return (
      <div className="p-12 text-center text-slate-500 font-bold">
        Product not found!
      </div>
    );

  // ছবির তালিকা প্রস্তুত করা
  const rawImages =
    product.images && product.images.length > 0
      ? product.images
      : [product.image || 'https://placehold.co/400x400?text=Product'];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="text-xs font-bold text-slate-500 hover:text-slate-900 transition flex items-center gap-1"
      >
        ← Back to Shopping
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-6 sm:p-8 rounded-3xl border shadow-sm">
        {/* 🖼️ ছবি ও থাম্বনেইল গ্যালারি সেকশন */}
        <div className="space-y-4">
          {/* বড় মেইন ছবি */}
          <div className="w-full h-80 bg-slate-50 border rounded-2xl flex items-center justify-center p-4 overflow-hidden shadow-inner">
            <img
              src={selectedImage || rawImages[0]}
              alt={product.productName || product.title}
              className="max-h-full max-w-full object-contain transition-all duration-300 hover:scale-105"
            />
          </div>

          {/* নিচে ১-৩টি ছবির থাম্বনেইল লিস্ট */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Product Gallery ({rawImages.length} {rawImages.length > 1 ? 'Images' : 'Image'})
            </span>
            <div className="flex gap-3 overflow-x-auto pb-1">
              {rawImages.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-20 rounded-xl border-2 p-1.5 bg-slate-50 transition-all flex items-center justify-center overflow-hidden ${
                    selectedImage === img
                      ? 'border-emerald-600 ring-2 ring-emerald-200 shadow-md scale-105 bg-white'
                      : 'border-slate-200 hover:border-slate-400 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img}
                    alt={`Thumb ${idx + 1}`}
                    className="w-full h-full object-contain"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 📋 পণ্যের বিবরণ ও কার্ট অ্যাকশন */}
        <div className="space-y-4 flex flex-col justify-center">
          <OneHourDeliveryBadge />

          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
            {product.productName || product.title}
          </h1>

          <div>
            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider bg-slate-100 px-2.5 py-1 rounded-lg">
              {product.category || 'Grocery'}
            </span>
          </div>

          <div className="text-3xl font-black text-emerald-600">
            ₹{product.price}{' '}
            <span className="text-xs text-slate-400 font-normal">
              / {product.unit || '1 kg'}
            </span>
          </div>

          <div className="border-t border-b py-3 space-y-1.5">
            <h4 className="text-xs font-bold uppercase text-slate-400">
              Product Description
            </h4>
            <p className="text-slate-600 text-sm leading-relaxed">
              {product.description || 'Fresh grocery item direct from verified seller.'}
            </p>
            {product.sellerId && (
              <p className="text-xs text-slate-500 pt-2">
                🏪 <strong>Store:</strong>{' '}
                {product.sellerId.storeAddress || product.sellerId.name || 'Verified Partner Store'}
              </p>
            )}
          </div>

          <button
            onClick={() => dispatch(addToCart(product))}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3.5 rounded-xl shadow-lg transition active:scale-95 text-sm flex items-center justify-center gap-2"
          >
            <span>Add to Cart</span> 🛒
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;