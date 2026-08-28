import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import ProductCard from "../components/ProductCard";

import {
  getAllProducts,
  getProductsByCategory,
  searchProducts,
} from "../services/api";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [keyword, setKeyword] = useState("");

  const [searchParams] = useSearchParams();

  const category = searchParams.get("category");

  // ==========================
  // FETCH PRODUCTS
  // ==========================

  const fetchProducts = async () => {
    try {
      setLoading(true);

      let res;

      if (keyword.trim()) {
        res = await searchProducts(keyword);
      } else if (category) {
        res = await getProductsByCategory(category);
      } else {
        res = await getAllProducts();
      }

      setProducts(res.data.products);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [category]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  return (
    <section className="max-w-7xl mx-auto px-4 py-10">

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-8">

        <div>
          <h1 className="text-3xl font-bold">
            Products
          </h1>

          {category && (
            <p className="text-green-600 mt-2">
              Category : {category}
            </p>
          )}
        </div>

        <form
          onSubmit={handleSearch}
          className="flex gap-3"
        >
          <input
            type="text"
            placeholder="Search product..."
            value={keyword}
            onChange={(e) =>
              setKeyword(e.target.value)
            }
            className="border rounded-lg px-4 py-2 w-full md:w-72 outline-none"
          />

          <button
            className="bg-green-600 text-white px-6 rounded-lg hover:bg-green-700"
          >
            Search
          </button>
        </form>

      </div>

      {loading ? (
        <div className="text-center py-20">
          Loading...
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20">
          No Products Found
        </div>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">

          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
            />
          ))}

        </div>
      )}

    </section>
  );
};

export default Products;