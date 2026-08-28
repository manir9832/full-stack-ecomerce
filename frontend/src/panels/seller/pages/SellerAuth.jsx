
// import React, { useState } from 'react';
// import API from '../../../api/axiosConfig';

// const SellerAuth = () => {
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

//     if (!formData.name || !formData.phone || !formData.password || !formData.aadhaarNumber) {
//       return setErrorMsg('সকল তথ্য পূরণ করা বাধ্যতামূলক।');
//     }

//     try {
//       setLoading(true);
//       // ব্যাকএন্ডে POST /api/seller/register কল হবে
//       const res = await API.post('/seller/register', {
//         name: formData.name,
//         phone: formData.phone,
//         password: formData.password,
//         aadhaarNumber: formData.aadhaarNumber,
//       });

//       setSuccessMsg(res.data?.message || 'Seller registered successfully! Please wait for admin approval.');
//       setFormData({
//         name: '',
//         phone: '',
//         password: '',
//         aadhaarNumber: '',
//       });
//     } catch (err) {
//       console.error('Seller Register Error:', err);
//       setErrorMsg(
//         err.response?.data?.message || 
//         err.message || 
//         'Registration failed. Please check server logs.'
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto my-12 p-6 bg-white border border-slate-200 rounded-3xl shadow-sm space-y-4">
//       <div className="text-center space-y-1">
//         <h2 className="text-xl font-black text-slate-800">
//           Grocera Seller Registration
//         </h2>
//         <p className="text-xs text-slate-500">
//           Register your store and start selling with fast delivery
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
//           <label className="text-xs font-bold text-slate-700">Owner / Store Name</label>
//           <input
//             type="text"
//             name="name"
//             value={formData.name}
//             onChange={handleChange}
//             placeholder="e.g. John Doe / Fresh Store"
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
//             placeholder="Enter 12-digit Aadhaar number"
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
//             placeholder="Enter a secure password"
//             className="w-full border rounded-xl p-2.5 text-sm mt-1 outline-none focus:ring-2 focus:ring-emerald-500"
//             required
//           />
//         </div>

//         <button
//           type="submit"
//           disabled={loading}
//           className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3 rounded-xl shadow-md transition disabled:opacity-50 mt-2"
//         >
//           {loading ? 'Submitting Application...' : 'Submit Application'}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default SellerAuth;
















import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../../api/axiosConfig';
import { useSocketContext } from '../../../context/SocketContext';

const SellerAuth = () => {
  const navigate = useNavigate();
  const { socket, joinSellerRoom } = useSocketContext();

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

    socket.on('sellerApproved', (data) => {
      setSuccessMsg(data.message || '🎉 Your store has been approved! Please log in now.');
      setIsLoginTab(true);
    });

    return () => {
      socket.off('sellerApproved');
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
        // 👉 সেলার লগইন কল
        if (!formData.phone || !formData.password) {
          return setErrorMsg('Please provide phone number and password.');
        }

        const res = await API.post('/seller/login', {
          phone: formData.phone,
          password: formData.password,
        });

        if (res.data?.seller?.id) {
          localStorage.setItem('sellerId', res.data.seller.id);
          joinSellerRoom(res.data.seller.id);
        }

        navigate('/seller/dashboard');
      } else {
        // 👉 সেলার রেজিস্ট্রেশন কল
        if (!formData.name || !formData.phone || !formData.password || !formData.aadhaarNumber) {
          return setErrorMsg('সকল তথ্য পূরণ করা বাধ্যতামূলক।');
        }

        const res = await API.post('/seller/register', {
          name: formData.name,
          phone: formData.phone,
          password: formData.password,
          aadhaarNumber: formData.aadhaarNumber,
        });

        if (res.data?.sellerId) {
          joinSellerRoom(res.data.sellerId);
        }

        setSuccessMsg(res.data?.message || 'Seller registered successfully! Please wait for admin approval.');
        setFormData({ name: '', phone: '', password: '', aadhaarNumber: '' });
      }
    } catch (err) {
      console.error('Seller Auth Error:', err);
      setErrorMsg(err.response?.data?.message || 'Operation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-12 p-6 bg-white border border-slate-200 rounded-3xl shadow-sm space-y-5">
      <div className="text-center space-y-1">
        <h2 className="text-xl font-black text-slate-800">
          Grocera Seller Portal 🏪
        </h2>
        <p className="text-xs text-slate-500">
          {isLoginTab ? 'Log in to manage your grocery store & products' : 'Register your store and start selling'}
        </p>
      </div>

      {/* Auth Toggle Tabs */}
      <div className="flex bg-slate-100 p-1 rounded-2xl">
        <button
          type="button"
          onClick={() => { setIsLoginTab(false); setErrorMsg(''); setSuccessMsg(''); }}
          className={`flex-1 py-2 text-xs font-black rounded-xl transition ${
            !isLoginTab ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500'
          }`}
        >
          Register Store
        </button>
        <button
          type="button"
          onClick={() => { setIsLoginTab(true); setErrorMsg(''); setSuccessMsg(''); }}
          className={`flex-1 py-2 text-xs font-black rounded-xl transition ${
            isLoginTab ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500'
          }`}
        >
          Seller Login
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
            <label className="text-xs font-bold text-slate-700">Owner / Store Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. John Doe / Fresh Store"
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
              placeholder="Enter 12-digit Aadhaar number"
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
            placeholder="Enter password"
            className="w-full border rounded-xl p-2.5 text-sm mt-1 outline-none focus:ring-2 focus:ring-emerald-500"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3 rounded-xl shadow-md transition disabled:opacity-50 mt-2"
        >
          {loading 
            ? 'Processing...' 
            : isLoginTab 
              ? 'Login to Store' 
              : 'Submit Application'}
        </button>
      </form>
    </div>
  );
};

export default SellerAuth;