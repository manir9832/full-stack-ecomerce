import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loadRazorpayScript } from '../../../utils/loadRazorpayScript';
import { createRazorpayOrder, verifyRazorpayPayment } from '../../../api/paymentApi';
import { clearCart } from '../../../redux/slices/cartSlice';

const PaymentGatewayPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { orderId, amount } = location.state || {};
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId || !amount) {
      navigate('/');
      return;
    }

    const initiatePayment = async () => {
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        alert('Failed to load Razorpay SDK! Please check your internet connection.');
        setLoading(false);
        return;
      }

      try {
        // 1. Create Razorpay order from backend
        const res = await createRazorpayOrder(amount);
        const razorpayOrder = res.data;

        // 2. Open Razorpay Modal
        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_dummy_key',
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency || 'INR',
          name: 'grocera',
          description: '1-Hour Guaranteed Grocery Order',
          image: '/assets/images/logo.jpeg',
          order_id: razorpayOrder.id,
          handler: async (response) => {
            try {
              // 3. Verify Payment Signature with backend
              const verifyRes = await verifyRazorpayPayment({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderId,
              });

              if (verifyRes.data?.success) {
                dispatch(clearCart());
                navigate('/payment/success', { state: { orderId } });
              } else {
                navigate('/payment/failed');
              }
            } catch (err) {
              console.error('Signature verification failed:', err);
              navigate('/payment/failed');
            }
          },
          prefill: {
            name: 'grocera User',
            contact: '9876543210',
          },
          theme: {
            color: '#059669',
          },
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
      } catch (err) {
        console.error('Payment initiation error:', err);
        alert('Failed to initiate payment.');
      } finally {
        setLoading(false);
      }
    };

    initiatePayment();
  }, [orderId, amount, navigate, dispatch]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
      <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>

      <h2 className="text-lg font-bold text-slate-800">
        Loading Secure Payment Gateway...
      </h2>

      <p className="text-xs text-slate-400">
        Please do not refresh or close this page.
      </p>
    </div>
  );
};

export default PaymentGatewayPage;