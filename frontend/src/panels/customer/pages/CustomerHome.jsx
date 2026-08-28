


import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import CartDrawer from '../components/CartDrawer';
import ProductCard from '../components/ProductCard';
import CategoryList from '../components/CategoryList';
import OneHourDeliveryBadge from '../../../components/badges/OneHourDeliveryBadge';
import Loader from '../../../components/common/Loader';
import { getAllProducts, getProductsByCategory } from '../../../api/productApi';

const CustomerHome = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search')?.toLowerCase().trim() || '';

  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      let response;
      if (selectedCategory) {
        response = await getProductsByCategory(selectedCategory);
      } else {
        response = await getAllProducts();
      }

      if (response.data?.products) {
        setProducts(response.data.products);
      } else if (Array.isArray(response.data)) {
        setProducts(response.data);
      } else {
        setProducts([]);
      }
    } catch (err) {
      console.error('Failed to fetch products:', err);
      setError('Could not load products. Please check server connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory]);

  const filteredProducts = useMemo(() => {
    if (!searchQuery) return products;
    return products.filter((product) => {
      const nameMatch = product.productName?.toLowerCase().includes(searchQuery);
      const categoryMatch = product.category?.toLowerCase().includes(searchQuery);
      const descMatch = product.description?.toLowerCase().includes(searchQuery);
      return Boolean(nameMatch || categoryMatch || descMatch);
    });
  }, [products, searchQuery]);

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        <div className="relative rounded-3xl bg-gradient-to-r from-emerald-700 via-teal-800 to-emerald-900 text-white p-6 sm:p-10 overflow-hidden shadow-xl">
          <div className="relative z-10 max-w-xl space-y-3">
            <OneHourDeliveryBadge />
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Fresh Groceries from Nearby Stores, <br />
              <span className="text-amber-300">Delivered Within 1 Hour!</span>
            </h1>
            <p className="text-slate-200 text-sm sm:text-base">
              Order groceries with live GPS tracking on <strong>Grocera</strong>.
            </p>
          </div>
        </div>

        <CategoryList selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-slate-900">
              {searchQuery
                ? `Search results for "${searchQuery}" (${filteredProducts.length})`
                : selectedCategory
                ? `${selectedCategory} (${filteredProducts.length})`
                : `Available Products (${filteredProducts.length})`}
            </h2>

            <div className="flex items-center gap-3">
              {searchQuery && (
                <button onClick={() => navigate('/')} className="text-xs font-bold text-rose-600 hover:underline">
                  Clear Search ✕
                </button>
              )}
              <button
                onClick={fetchProducts}
                className="text-xs font-bold text-emerald-600 hover:text-emerald-700 underline"
              >
                Refresh 🔄
              </button>
            </div>
          </div>

          {loading && <Loader text="Loading fresh groceries..." />}

          {error && !loading && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl text-center">
              {error}
            </div>
          )}

          {!loading && !error && filteredProducts.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredProducts.map((item) => (
                <div
                  key={item._id}
                  onClick={() => navigate(`/product/${item._id}`)}
                  className="cursor-pointer transition hover:scale-[1.02]"
                >
                  <ProductCard product={item} />
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CustomerHome;