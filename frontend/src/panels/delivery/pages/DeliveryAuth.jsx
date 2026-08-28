
// import React, { useState } from 'react';
// import { registerDeliveryBoy } from '../../../api/deliveryApi';

// const DeliveryAuth = () => {
//   const [formData, setFormData] = useState({
//     name: '',
//     phone: '',
//     password: '',
//     aadhaarNumber: '',
//   });
//   const [loading, setLoading] = useState(false);
//   const [errorMsg, setErrorMsg] = useState('');
//   const [successMsg, setSuccessMsg] = useState('');

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//     setErrorMsg('');
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setErrorMsg('');
//     setSuccessMsg('');

//     // ফ্রন্টএন্ড ভ্যালিডেশন
//     if (!formData.name || !formData.phone || !formData.password || !formData.aadhaarNumber) {
//       return setErrorMsg('Please fill in all required fields (Name, Phone, Password, Aadhaar).');
//     }

//     try {
//       setLoading(true);
      
//       // ব্যাকএন্ডের ডেলিভারি বয় রেজিস্টার API কল
//       const res = await registerDeliveryBoy({
//         name: formData.name,
//         phone: formData.phone,
//         password: formData.password,
//         aadhaarNumber: formData.aadhaarNumber,
//       });

//       setSuccessMsg(res.data?.message || 'Application submitted! Please wait for admin approval.');
//       setFormData({
//         name: '',
//         phone: '',
//         password: '',
//         aadhaarNumber: '',
//       });
//     } catch (err) {
//       console.error('Delivery Partner Register Error:', err);
//       setErrorMsg(
//         err.response?.data?.message || 
//         'Failed to submit the application. Please try again.'
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto my-12 p-6 bg-white border border-slate-200 rounded-3xl shadow-sm space-y-4">
//       <div className="text-center space-y-1">
//         <h2 className="text-xl font-black text-slate-800">
//           Delivery Partner Registration 🛵
//         </h2>
//         <p className="text-xs text-slate-500">
//           Join Grocera delivery network and earn with every delivery
//         </p>
//       </div>

//       {errorMsg && (
//         <div className="p-3 text-xs bg-red-50 text-red-600 rounded-xl border border-red-200 font-semibold">
//           {errorMsg}
//         </div>
//       )}

//       {successMsg && (
//         <div className="p-3 text-xs bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-200 font-semibold">
//           {successMsg}
//         </div>
//       )}

//       <form onSubmit={handleSubmit} className="space-y-3">
//         <div>
//           <label className="text-xs font-bold text-slate-700">Full Name</label>
//           <input
//             type="text"
//             name="name"
//             value={formData.name}
//             onChange={handleChange}
//             placeholder="e.g. Sadikul"
//             className="w-full border rounded-xl p-2.5 text-sm mt-1 outline-none focus:ring-2 focus:ring-emerald-500"
//             required
//           />
//         </div>

//         <div>
//           <label className="text-xs font-bold text-slate-700">Phone Number</label>
//           <input
//             type="text"
//             name="phone"
//             value={formData.phone}
//             onChange={handleChange}
//             placeholder="e.g. 9832413545"
//             className="w-full border rounded-xl p-2.5 text-sm mt-1 outline-none focus:ring-2 focus:ring-emerald-500"
//             required
//           />
//         </div>

//         <div>
//           <label className="text-xs font-bold text-slate-700">Aadhaar Number</label>
//           <input
//             type="text"
//             name="aadhaarNumber"
//             value={formData.aadhaarNumber}
//             onChange={handleChange}
//             placeholder="12-digit Aadhaar Number"
//             className="w-full border rounded-xl p-2.5 text-sm mt-1 outline-none focus:ring-2 focus:ring-emerald-500"
//             required
//           />
//         </div>

//         <div>
//           <label className="text-xs font-bold text-slate-700">Password</label>
//           <input
//             type="password"
//             name="password"
//             value={formData.password}
//             onChange={handleChange}
//             placeholder="Set your account password"
//             className="w-full border rounded-xl p-2.5 text-sm mt-1 outline-none focus:ring-2 focus:ring-emerald-500"
//             required
//           />
//         </div>

//         <button
//           type="submit"
//           disabled={loading}
//           className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold py-3 rounded-xl shadow-md transition disabled:opacity-50 mt-2"
//         >
//           {loading ? 'Submitting Application...' : 'Register'}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default DeliveryAuth;



















import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerDeliveryBoy, loginDeliveryBoy } from '../../../api/deliveryApi';
import { useSocketContext } from '../../../context/SocketContext';

const DeliveryAuth = () => {
  const navigate = useNavigate();
  const { socket, joinDeliveryRoom } = useSocketContext();

  const [isLoginTab, setIsLoginTab] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    password: '',
    aadhaarNumber: '',
  });

  // রিয়েল-টাইম অ্যাডমিন অ্যাপ্রুভাল লিসেনার
  useEffect(() => {
    if (!socket) return;

    socket.on('deliveryBoyApproved', (data) => {
      setSuccessMsg(data.message || '🎉 Your account has been approved! Please log in now.');
      setIsLoginTab(true);
    });

    return () => {
      socket.off('deliveryBoyApproved');
    };
  }, [socket]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    try {
      setLoading(true);

      if (isLoginTab) {
        // 👉 ডেলিভারি পার্টনার লগইন
        if (!formData.phone || !formData.password) {
          return setErrorMsg('Please enter your phone number and password.');
        }

        const res = await loginDeliveryBoy({
          phone: formData.phone,
          password: formData.password,
        });

        if (res.data?.deliveryBoy?.id) {
          localStorage.setItem('deliveryBoyId', res.data.deliveryBoy.id);
          joinDeliveryRoom(res.data.deliveryBoy.id);
        }

        navigate('/delivery/dashboard');
      } else {
        // 👉 ডেলিভারি পার্টনার রেজিস্ট্রেশন
        if (!formData.name || !formData.phone || !formData.password || !formData.aadhaarNumber) {
          return setErrorMsg('Please fill in all required fields (Name, Phone, Password, Aadhaar).');
        }

        const res = await registerDeliveryBoy({
          name: formData.name,
          phone: formData.phone,
          password: formData.password,
          aadhaarNumber: formData.aadhaarNumber,
        });

        if (res.data?.deliveryBoyId) {
          joinDeliveryRoom(res.data.deliveryBoyId);
        }

        setSuccessMsg(res.data?.message || 'Application submitted! Please wait for admin approval.');
        setFormData({ name: '', phone: '', password: '', aadhaarNumber: '' });
      }
    } catch (err) {
      console.error('Auth Error:', err);
      setErrorMsg(err.response?.data?.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-12 p-6 bg-white border border-slate-200 rounded-3xl shadow-sm space-y-5">
      <div className="text-center space-y-1">
        <h2 className="text-xl font-black text-slate-800">
          Delivery Partner Portal 🛵
        </h2>
        <p className="text-xs text-slate-500">
          {isLoginTab ? 'Access your active delivery panel' : 'Join Grocera delivery network and earn'}
        </p>
      </div>

      {/* Auth Mode Toggle Tabs */}
      <div className="flex bg-slate-100 p-1 rounded-2xl">
        <button
          type="button"
          onClick={() => { setIsLoginTab(false); setErrorMsg(''); setSuccessMsg(''); }}
          className={`flex-1 py-2 text-xs font-black rounded-xl transition ${
            !isLoginTab ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500'
          }`}
        >
          Register
        </button>
        <button
          type="button"
          onClick={() => { setIsLoginTab(true); setErrorMsg(''); setSuccessMsg(''); }}
          className={`flex-1 py-2 text-xs font-black rounded-xl transition ${
            isLoginTab ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500'
          }`}
        >
          Login
        </button>
      </div>

      {errorMsg && (
        <div className="p-3 text-xs bg-red-50 text-red-600 rounded-xl border border-red-200 font-semibold">
          {errorMsg}
        </div>
      )}

      {successMsg && (
        <div className="p-3 text-xs bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-200 font-semibold">
          {successMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        {!isLoginTab && (
          <div>
            <label className="text-xs font-bold text-slate-700">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Sadikul"
              className="w-full border rounded-xl p-2.5 text-sm mt-1 outline-none focus:ring-2 focus:ring-emerald-500"
              required={!isLoginTab}
            />
          </div>
        )}

        <div>
          <label className="text-xs font-bold text-slate-700">Phone Number</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="e.g. 9832413545"
            className="w-full border rounded-xl p-2.5 text-sm mt-1 outline-none focus:ring-2 focus:ring-emerald-500"
            required
          />
        </div>

        {!isLoginTab && (
          <div>
            <label className="text-xs font-bold text-slate-700">Aadhaar Number</label>
            <input
              type="text"
              name="aadhaarNumber"
              value={formData.aadhaarNumber}
              onChange={handleChange}
              placeholder="12-digit Aadhaar Number"
              className="w-full border rounded-xl p-2.5 text-sm mt-1 outline-none focus:ring-2 focus:ring-emerald-500"
              required={!isLoginTab}
            />
          </div>
        )}

        <div>
          <label className="text-xs font-bold text-slate-700">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Account password"
            className="w-full border rounded-xl p-2.5 text-sm mt-1 outline-none focus:ring-2 focus:ring-emerald-500"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold py-3 rounded-xl shadow-md transition disabled:opacity-50 mt-2"
        >
          {loading 
            ? 'Processing...' 
            : isLoginTab 
              ? 'Login to Dashboard' 
              : 'Submit Application'}
        </button>
      </form>
    </div>
  );
};

export default DeliveryAuth;