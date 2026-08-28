


// import React from 'react';
// import { useDispatch } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// import { addToCart } from '../../../redux/slices/cartSlice';

// const ProductCard = ({ product }) => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const handleAddToCart = (e) => {
//     e.stopPropagation();
//     dispatch(addToCart(product));
//   };

//   // ✅ ব্যাকএন্ডের images array অথবা image string থেকে URL নেওয়া
//   const displayImage =
//     (Array.isArray(product?.images) && product.images.length > 0 && product.images[0]) ||
//     product?.image ||
//     'https://placehold.co/300x300?text=No+Image';

//   // ✅ productName অথবা title সঠিকভাবে নেওয়া
//   const displayName = product?.productName || product?.title || 'Fresh Product';

//   return (
//     <div 
//       onClick={() => navigate(`/product/${product._id}`)}
//       className="bg-white rounded-2xl border border-slate-200 p-3 flex flex-col justify-between shadow-sm hover:shadow-md transition cursor-pointer group"
//     >
//       <div className="relative w-full h-36 rounded-xl overflow-hidden bg-slate-50 mb-3 flex items-center justify-center p-2">
//         <img
//           src={displayImage}
//           alt={displayName}
//           onError={(e) => {
//             e.target.onerror = null;
//             e.target.src = 'https://placehold.co/300x300?text=Groceries';
//           }}
//           className="w-full h-full object-contain group-hover:scale-105 transition duration-300"
//         />
//         {product.discountPrice > 0 && (
//           <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
//             SALE
//           </span>
//         )}
//       </div>

//       <div className="flex-1">
//         <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">
//           {product.category || 'Grocery'}
//         </span>
//         <h3 className="text-sm font-semibold text-slate-800 line-clamp-2 mt-0.5 leading-snug">
//           {displayName}
//         </h3>
//         <p className="text-xs text-slate-400 mt-1">{product.unit || '1 kg'}</p>
//       </div>

//       <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100">
//         <div>
//           <span className="text-base font-black text-slate-900">₹{product.price}</span>
//           {product.discountPrice > 0 && (
//             <span className="text-xs text-slate-400 line-through ml-1.5">
//               ₹{product.discountPrice}
//             </span>
//           )}
//         </div>

//         <button
//           onClick={handleAddToCart}
//           className="bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white border border-emerald-200 font-extrabold text-xs px-3 py-1.5 rounded-lg transition active:scale-95"
//         >
//           + Add
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ProductCard;






















import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addToCart } from '../../../redux/slices/cartSlice';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleAddToCart = (e) => {
    e.stopPropagation();
    dispatch(addToCart(product));
  };

  // ✅ ব্যাকএন্ডের images array অথবা image string থেকে URL নেওয়া
  const displayImage =
    (Array.isArray(product?.images) && product.images.length > 0 && product.images[0]) ||
    product?.image ||
    'https://placehold.co/300x300?text=No+Image';

  // ✅ productName অথবা title সঠিকভাবে নেওয়া
  const displayName = product?.productName || product?.title || 'Fresh Product';

  // ডিসকাউন্ট আছে কিনা এবং ডিসকাউন্ট প্রাইস মূল দামের চেয়ে কম কিনা যাচাই
  const hasValidDiscount =
    product?.discountPrice > 0 && product?.discountPrice < product?.price;

  return (
    <div
      onClick={() => navigate(`/product/${product._id}`)}
      className="bg-white rounded-2xl border border-slate-200 p-3 flex flex-col justify-between shadow-sm hover:shadow-md transition cursor-pointer group"
    >
      <div className="relative w-full h-36 rounded-xl overflow-hidden bg-slate-50 mb-3 flex items-center justify-center p-2">
        <img
          src={displayImage}
          alt={displayName}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://placehold.co/300x300?text=Groceries';
          }}
          className="w-full h-full object-contain group-hover:scale-105 transition duration-300"
        />
        {hasValidDiscount && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
            SALE
          </span>
        )}
      </div>

      <div className="flex-1">
        <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">
          {product.category || 'Grocery'}
        </span>
        <h3 className="text-sm font-semibold text-slate-800 line-clamp-2 mt-0.5 leading-snug">
          {displayName}
        </h3>
        <p className="text-xs text-slate-400 mt-1">{product.unit || '1 kg'}</p>
      </div>

      <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100">
        <div className="flex items-baseline">
          {hasValidDiscount ? (
            <>
              {/* বিক্রয় মূল্য (কম দামটি বোল্ড থাকবে) */}
              <span className="text-base font-black text-slate-900">
                ₹{product.discountPrice}
              </span>
              {/* মূল দামটি কেটে দেওয়া থাকবে */}
              <span className="text-xs text-slate-400 line-through ml-1.5 font-semibold">
                ₹{product.price}
              </span>
            </>
          ) : (
            <span className="text-base font-black text-slate-900">
              ₹{product.price}
            </span>
          )}
        </div>

        <button
          onClick={handleAddToCart}
          className="bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white border border-emerald-200 font-extrabold text-xs px-3 py-1.5 rounded-lg transition active:scale-95"
        >
          + Add
        </button>
      </div>
    </div>
  );
};

export default ProductCard;