// import { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import { toast } from "react-toastify";

// import {
//   getCart,
//   updateCartQuantity,
//   removeFromCart,
//   clearCart,
// } from "../services/api";

// import CartItem from "../components/CartItem";
// import EmptyState from "../components/EmptyState";

// const Cart = () => {
//   const [cartProducts, setCartProducts] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // ==========================
//   // GET CART
//   // ==========================

//   const fetchCart = async () => {
//     try {
//       setLoading(true);

//       const res = await getCart();

//       setCartProducts(res.data.products);

//     } catch (error) {

//       toast.error(
//         error?.response?.data?.message ||
//           "Failed to load cart"
//       );

//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchCart();
//   }, []);

//   // ==========================
//   // UPDATE QUANTITY
//   // ==========================

//   const increaseQuantity = async (
//     productId
//   ) => {
//     const item = cartProducts.find(
//       (p) => p.product._id === productId
//     );

//     if (!item) return;

//     try {
//       await updateCartQuantity(
//         productId,
//         item.quantity + 1
//       );

//       fetchCart();

//     } catch (error) {

//       toast.error(
//         error?.response?.data?.message
//       );
//     }
//   };

//   const decreaseQuantity = async (
//     productId
//   ) => {

//     const item = cartProducts.find(
//       (p) => p.product._id === productId
//     );

//     if (!item) return;

//     if (item.quantity === 1) return;

//     try {

//       await updateCartQuantity(
//         productId,
//         item.quantity - 1
//       );

//       fetchCart();

//     } catch (error) {

//       toast.error(
//         error?.response?.data?.message
//       );

//     }
//   };

//   // ==========================
//   // REMOVE
//   // ==========================

//   const removeItem = async (
//     productId
//   ) => {

//     try {

//       await removeFromCart(productId);

//       toast.success(
//         "Removed successfully"
//       );

//       fetchCart();

//     } catch (error) {

//       toast.error(
//         error?.response?.data?.message
//       );

//     }
//   };

//   // ==========================
//   // CLEAR CART
//   // ==========================

//   const handleClearCart =
//     async () => {

//       try {

//         await clearCart();

//         toast.success(
//           "Cart cleared"
//         );

//         fetchCart();

//       } catch (error) {

//         toast.error(
//           error?.response?.data?.message
//         );
//       }
//     };

//   // ==========================
//   // TOTAL
//   // ==========================

//   const total = cartProducts.reduce(
//     (sum, item) => {

//       const price =
//         item.product.discountPrice > 0
//           ? item.product.discountPrice
//           : item.product.price;

//       return (
//         sum +
//         price * item.quantity
//       );

//     },
//     0
//   );

//   if (loading) {
//     return (
//       <div className="text-center py-20">
//         Loading...
//       </div>
//     );
//   }

//   if (cartProducts.length === 0) {
//     return (
//       <EmptyState
//         title="Your cart is empty"
//         description="Add products to continue shopping."
//       />
//     );
//   }

//   return (
//     <section className="max-w-7xl mx-auto px-4 py-10">

//       <div className="flex justify-between items-center mb-8">

//         <h1 className="text-3xl font-bold">
//           Shopping Cart
//         </h1>

//         <button
//           onClick={handleClearCart}
//           className="bg-red-600 text-white px-4 py-2 rounded-lg"
//         >
//           Clear Cart
//         </button>

//       </div>

//       <div className="grid lg:grid-cols-3 gap-10">

//         <div className="lg:col-span-2 space-y-5">

//           {cartProducts.map((item) => (

//             <CartItem
//               key={item.product._id}
//               item={item}
//               onIncrease={
//                 increaseQuantity
//               }
//               onDecrease={
//                 decreaseQuantity
//               }
//               onRemove={removeItem}
//             />

//           ))}

//         </div>

//         <div className="border rounded-xl p-6 h-fit shadow">

//           <h2 className="text-2xl font-bold mb-6">
//             Order Summary
//           </h2>

//           <div className="flex justify-between mb-4">

//             <span>Total</span>

//             <span className="font-bold">
//               ₹{total}
//             </span>

//           </div>

//           <Link
//             to="/checkout"
//             className="block text-center bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold"
//           >
//             Proceed To Checkout
//           </Link>

//         </div>

//       </div>

//     </section>
//   );
// };

// export default Cart;






import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import {
  getCart,
  updateCartQuantity,
  removeFromCart,
  clearCart,
} from "../services/api";

import CartItem from "../components/CartItem";
import EmptyState from "../components/EmptyState";
import Loader from "../components/Loader";

const Cart = () => {
  const [cartProducts, setCartProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // ==========================
  // GET CART
  // ==========================

  const fetchCart = async () => {
    try {
      setLoading(true);

      const res = await getCart();

      setCartProducts(res.data.products || []);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to load cart"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // ==========================
  // INCREASE QUANTITY
  // ==========================

  const increaseQuantity = async (productId) => {
    const item = cartProducts.find(
      (p) => p.product._id === productId
    );

    if (!item) return;

    try {
      const res = await updateCartQuantity(
        productId,
        item.quantity + 1
      );

      toast.success(res.data.message);

      fetchCart();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to update quantity"
      );
    }
  };

  // ==========================
  // DECREASE QUANTITY
  // ==========================

  const decreaseQuantity = async (productId) => {
    const item = cartProducts.find(
      (p) => p.product._id === productId
    );

    if (!item) return;

    if (item.quantity <= 1) return;

    try {
      const res = await updateCartQuantity(
        productId,
        item.quantity - 1
      );

      toast.success(res.data.message);

      fetchCart();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to update quantity"
      );
    }
  };

  // ==========================
  // REMOVE ITEM
  // ==========================

  const removeItem = async (productId) => {
    try {
      const res = await removeFromCart(productId);

      toast.success(res.data.message);

      fetchCart();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to remove product"
      );
    }
  };

  // ==========================
  // CLEAR CART
  // ==========================

  const handleClearCart = async () => {
    try {
      const res = await clearCart();

      toast.success(res.data.message);

      setCartProducts([]);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to clear cart"
      );
    }
  };

  // ==========================
  // TOTAL PRICE
  // ==========================

  const total = cartProducts.reduce((sum, item) => {
    const price =
      item.product.discountPrice > 0
        ? item.product.discountPrice
        : item.product.price;

    return sum + price * item.quantity;
  }, 0);

  // ==========================
  // LOADING
  // ==========================

  if (loading) {
    return <Loader />;
  }

  // ==========================
  // EMPTY CART
  // ==========================

  if (cartProducts.length === 0) {
    return (
      <EmptyState
        title="Your cart is empty"
        description="Add products to continue shopping."
      />
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 py-10">

      <div className="flex justify-between items-center mb-8">

        <h1 className="text-3xl font-bold">
          Shopping Cart
        </h1>

        <button
          onClick={handleClearCart}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
        >
          Clear Cart
        </button>

      </div>

      <div className="grid lg:grid-cols-3 gap-10">

        {/* Cart Items */}

        <div className="lg:col-span-2 space-y-5">

          {cartProducts.map((item) => (
            <CartItem
              key={item.product._id}
              item={item}
              onIncrease={increaseQuantity}
              onDecrease={decreaseQuantity}
              onRemove={removeItem}
            />
          ))}

        </div>

        {/* Summary */}

        <div className="border rounded-xl p-6 shadow h-fit">

          <h2 className="text-2xl font-bold mb-6">
            Order Summary
          </h2>

          <div className="flex justify-between mb-3">
            <span>Subtotal</span>
            <span>₹{total}</span>
          </div>

          <div className="flex justify-between mb-3">
            <span>Delivery</span>
            <span>Calculated at checkout</span>
          </div>

          <hr className="my-4" />

          <div className="flex justify-between text-xl font-bold mb-6">
            <span>Total</span>
            <span>₹{total}</span>
          </div>

          <Link
            to="/checkout"
            className="block text-center bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold"
          >
            Proceed To Checkout
          </Link>

        </div>

      </div>

    </section>
  );
};

export default Cart;