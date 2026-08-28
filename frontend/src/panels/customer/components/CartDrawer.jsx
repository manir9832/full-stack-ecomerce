import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { removeFromCart, updateQuantity } from '../../../redux/slices/cartSlice';

const CartDrawer = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart?.items || []);
  const totalAmount = cartItems.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex justify-end">
      <div className="bg-white w-full max-w-md h-full shadow-2xl p-6 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-center border-b pb-4">
            <h3 className="font-extrabold text-slate-900 text-lg">
              Your Cart ({cartItems.length})
            </h3>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-700 font-bold text-lg p-1"
            >
              ✕
            </button>
          </div>

          <div className="divide-y max-h-[65vh] overflow-y-auto mt-4">
            {cartItems.length === 0 ? (
              <p className="text-center text-slate-400 py-10">Your cart is empty</p>
            ) : (
              cartItems.map((item) => (
                <div
                  key={item._id}
                  className="py-3 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image || 'https://via.placeholder.com/150'}
                      alt={item.title}
                      className="w-12 h-12 object-contain rounded-lg bg-slate-50 border"
                    />
                    <div>
                      <h4 className="font-bold text-xs text-slate-800 line-clamp-1">
                        {item.title}
                      </h4>
                      <p className="text-xs font-black text-emerald-600">
                        ₹{item.price}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center border rounded-lg bg-slate-50 text-xs">
                      <button
                        onClick={() =>
                          dispatch(
                            updateQuantity({
                              id: item._id,
                              quantity: item.quantity - 1,
                            })
                          )
                        }
                        className="px-2 py-1 font-bold hover:bg-slate-200"
                      >
                        -
                      </button>
                      <span className="px-2 font-bold">{item.quantity}</span>
                      <button
                        onClick={() =>
                          dispatch(
                            updateQuantity({
                              id: item._id,
                              quantity: item.quantity + 1,
                            })
                          )
                        }
                        className="px-2 py-1 font-bold hover:bg-slate-200"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => dispatch(removeFromCart(item._id))}
                      className="text-red-500 hover:text-red-700 font-bold text-sm px-1"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="border-t pt-4 space-y-3">
          <div className="flex justify-between font-black text-slate-900 text-base">
            <span>Total Amount:</span>
            <span className="text-emerald-600">₹{totalAmount}</span>
          </div>

          <button
            disabled={cartItems.length === 0}
            onClick={() => {
              onClose();
              navigate('/checkout');
            }}
            className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-400 text-white font-extrabold py-3 rounded-xl shadow-lg transition"
          >
            Proceed to Checkout →
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;