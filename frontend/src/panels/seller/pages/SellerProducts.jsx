// import React, { useEffect, useState } from 'react';
// import { getSellerProducts } from '../../../api/sellerProductApi';
// import AddProductModal from '../components/AddProductModal';

// const SellerProducts = () => {
//   const [products, setProducts] = useState([]);
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   const loadData = async () => {
//     const res = await getSellerProducts();
//     if (res.data?.products) setProducts(res.data.products);
//   };

//   useEffect(() => {
//     loadData();
//   }, []);

//   return (
//     <div className="p-6 space-y-6">
//       <div className="flex justify-between items-center">
//         <h1 className="text-2xl font-black text-slate-900">
//           Inventory Products
//         </h1>

//         <button
//           onClick={() => setIsModalOpen(true)}
//           className="bg-emerald-600 text-white font-bold text-xs px-4 py-2 rounded-xl shadow"
//         >
//           + Add New Product
//         </button>
//       </div>

//       <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//         {products.map((item) => (
//           <div
//             key={item._id}
//             className="bg-white border p-3 rounded-xl space-y-2"
//           >
//             <img
//               src={item.image}
//               alt={item.title}
//               className="w-full h-28 object-contain bg-slate-50 rounded-lg"
//             />

//             <h4 className="font-bold text-xs text-slate-800 truncate">
//               {item.title}
//             </h4>

//             <p className="font-black text-emerald-600 text-sm">
//               ₹{item.price}
//             </p>
//           </div>
//         ))}
//       </div>

//       <AddProductModal
//         isOpen={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//         onProductAdded={loadData}
//       />
//     </div>
//   );
// };

// export default SellerProducts;












import React, { useEffect, useState } from 'react';
import { getSellerProducts } from '../../../api/sellerProductApi';
import AddProductModal from '../components/AddProductModal';

const SellerProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await getSellerProducts();
      if (res.data?.products) {
        setProducts(res.data.products);
      }
    } catch (err) {
      console.error('Error fetching inventory products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-slate-900">
            Inventory Products
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage your listed items and stock prices
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md transition"
        >
          + Add New Product
        </button>
      </div>

      {loading ? (
        <div className="text-center py-16 text-slate-400 font-semibold text-sm">
          Loading inventory items...
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white border rounded-2xl p-12 text-center space-y-3">
          <div className="text-4xl">📦</div>
          <p className="text-slate-600 font-bold text-sm">
            No products found in your inventory.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="text-xs font-black text-emerald-600 hover:underline"
          >
            Click here to add your first item
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {products.map((item) => (
            <div
              key={item._id}
              className="bg-white border border-slate-200 p-3 rounded-2xl space-y-2 shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div className="space-y-2">
                <img
                  src={item.image || item.images?.[0] || 'https://placehold.co/150'}
                  alt={item.title || item.productName || item.name}
                  className="w-full h-32 object-contain bg-slate-50 rounded-xl p-1"
                />

                <div>
                  <h4 className="font-bold text-xs text-slate-800 line-clamp-1">
                    {item.title || item.productName || item.name}
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    {item.unit || item.category || 'General'}
                  </p>
                </div>
              </div>

              <div className="flex justify-between items-center pt-1 border-t border-slate-100">
                <p className="font-black text-emerald-600 text-sm">
                  ₹{item.price}
                </p>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                  Active
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      <AddProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onProductAdded={loadData}
      />
    </div>
  );
};

export default SellerProducts;