import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";

import { searchProducts } from "../services/api";

import ProductCard from "../components/ProductCard";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";

const Search = () => {
  const [searchParams] = useSearchParams();

  const keyword =
    searchParams.get("keyword") || "";

  const [products, setProducts] = useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    fetchProducts();
  }, [keyword]);

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const res =
        await searchProducts(keyword);

      setProducts(
        res.data.products || []
      );
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to search products"
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (products.length === 0) {
    return (
      <EmptyState
        title="No Products Found"
        description={`No result found for "${keyword}"`}
        buttonText="Back Home"
        buttonLink="/"
      />
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">

      <h2 className="text-3xl font-bold mb-8">
        Search Result :
        <span className="text-green-600">
          {" "}
          {keyword}
        </span>
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">

        {products.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
          />
        ))}

      </div>

    </div>
  );
};

export default Search;