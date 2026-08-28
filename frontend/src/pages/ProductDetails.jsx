import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import {
  getSingleProduct,
  addToCart,
} from "../services/api";

import QuantitySelector from "../components/QuantitySelector";

const ProductDetails = () => {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState("");

  // ===========================
  // GET PRODUCT
  // ===========================

  const fetchProduct = async () => {
    try {
      setLoading(true);

      const res = await getSingleProduct(productId);

      setProduct(res.data.product);

      if (
        res.data.product.images &&
        res.data.product.images.length > 0
      ) {
        setSelectedImage(
          res.data.product.images[0]
        );
      }

    } catch (error) {

      toast.error(
        error?.response?.data?.message ||
        "Failed to fetch product"
      );

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  // ===========================
  // ADD TO CART
  // ===========================

  const handleAddToCart = async () => {

    try {

      await addToCart({
        productId,
        quantity,
      });

      toast.success(
        "Product added to cart successfully"
      );

      navigate("/cart");

    } catch (error) {

      toast.error(
        error?.response?.data?.message ||
        "Failed to add product"
      );
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20 text-xl">
        Loading...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-20 text-xl">
        Product not found
      </div>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 py-10">

      <div className="grid lg:grid-cols-2 gap-10">

        {/* Left */}

        <div>

          <div className="border rounded-xl overflow-hidden">

            <img
              src={selectedImage}
              alt={product.productName}
              className="w-full h-[450px] object-cover"
            />

          </div>

          {product.images?.length > 1 && (

            <div className="flex gap-3 mt-4 flex-wrap">

              {product.images.map((image, index) => (

                <img
                  key={index}
                  src={image}
                  alt=""
                  onClick={() =>
                    setSelectedImage(image)
                  }
                  className={`w-20 h-20 rounded-lg cursor-pointer object-cover border ${
                    selectedImage === image
                      ? "border-green-600"
                      : "border-gray-300"
                  }`}
                />

              ))}

            </div>

          )}

        </div>

        {/* Right */}

        <div>

          <h1 className="text-4xl font-bold">
            {product.productName}
          </h1>

          <p className="text-gray-600 mt-5">
            {product.description}
          </p>

          <div className="space-y-3 mt-6">

            <p>
              <strong>Category :</strong>{" "}
              {product.category}
            </p>

            <p>
              <strong>Unit :</strong>{" "}
              {product.unit}
            </p>

            <p>
              <strong>Stock :</strong>{" "}
              {product.stock}
            </p>

            <p>
              <strong>Seller :</strong>{" "}
              {product.sellerId?.name}
            </p>

          </div>

          <div className="mt-8">

            {product.discountPrice > 0 ? (

              <div className="flex items-center gap-4">

                <span className="text-3xl font-bold text-green-600">
                  ₹{product.discountPrice}
                </span>

                <span className="line-through text-gray-500">
                  ₹{product.price}
                </span>

              </div>

            ) : (

              <span className="text-3xl font-bold text-green-600">
                ₹{product.price}
              </span>

            )}

          </div>

          <div className="mt-8">

            <QuantitySelector
              quantity={quantity}
              setQuantity={setQuantity}
              stock={product.stock}
            />

          </div>

          <button
            onClick={handleAddToCart}
            className="mt-8 bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold transition"
          >
            Add To Cart
          </button>

        </div>

      </div>

    </section>
  );
};

export default ProductDetails;