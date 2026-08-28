

// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import API from '../../../api/axiosConfig';
// import BrandLogo from '../../../components/logo/BrandLogo';

// const CustomerLogin = () => {
//   const [mode, setMode] = useState('login'); // 'login' | 'register' | 'otp'
//   const [formData, setFormData] = useState({
//     name: '',
//     phone: '',
//     password: '',
//     otp: '',
//   });
//   const [loading, setLoading] = useState(false);
//   const [errorMsg, setErrorMsg] = useState('');
//   const [successMsg, setSuccessMsg] = useState('');
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//     setErrorMsg('');
//   };

//   // ১. Password-based Login (POST /api/user/login)
//   const handleLogin = async (e) => {
//     e.preventDefault();
//     if (!formData.phone || !formData.password) {
//       return setErrorMsg('Phone number and password are required.');
//     }
//     try {
//       setLoading(true);
//       setErrorMsg('');
//       const res = await API.post('/user/login', {
//         phone: formData.phone,
//         password: formData.password,
//       });

//       if (res.data?.user) {
//         localStorage.setItem('user', JSON.stringify(res.data.user));
//         navigate('/');
//       }
//     } catch (err) {
//       console.error('Login error:', err);
//       const message = err.response?.data?.message || err.message || 'Login failed. Please try again.';
//       setErrorMsg(message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ২. User Registration (POST /api/user/register)
//   const handleRegister = async (e) => {
//     e.preventDefault();
//     if (!formData.name || !formData.phone || !formData.password) {
//       return setErrorMsg('All fields are required.');
//     }
//     try {
//       setLoading(true);
//       setErrorMsg('');
//       const res = await API.post('/user/register', {
//         name: formData.name,
//         phone: formData.phone,
//         password: formData.password,
//       });

//       setSuccessMsg(res.data?.message || 'OTP sent successfully to your phone.');
//       setMode('otp');
//     } catch (err) {
//       console.error('Registration error:', err);
//       const message = err.response?.data?.message || err.message || 'Registration failed. Please check server connection.';
//       setErrorMsg(message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ৩. Verify OTP (POST /api/user/verify-otp)
//   const handleVerifyOtp = async (e) => {
//     e.preventDefault();
//     if (!formData.otp) {
//       return setErrorMsg('Please enter the OTP code.');
//     }
//     try {
//       setLoading(true);
//       setErrorMsg('');
//       const res = await API.post('/user/verify-otp', {
//         phone: formData.phone,
//         otp: formData.otp,
//       });

//       if (res.data?.user) {
//         localStorage.setItem('user', JSON.stringify(res.data.user));
//         navigate('/');
//       }
//     } catch (err) {
//       console.error('Verify OTP error:', err);
//       const message = err.response?.data?.message || err.message || 'Invalid or expired OTP.';
//       setErrorMsg(message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ৪. Resend OTP (POST /api/user/resend-otp)
//   const handleResendOtp = async () => {
//     try {
//       setLoading(true);
//       setErrorMsg('');
//       const res = await API.post('/user/resend-otp', { phone: formData.phone });
//       setSuccessMsg(res.data?.message || 'A new OTP has been sent.');
//     } catch (err) {
//       console.error('Resend OTP error:', err);
//       const message = err.response?.data?.message || err.message || 'Failed to resend OTP.';
//       setErrorMsg(message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto my-12 p-6 bg-white border border-slate-200 rounded-3xl shadow-sm space-y-6">
//       <div className="text-center space-y-2">
//         <BrandLogo className="h-10 w-auto mx-auto" />
//         <h2 className="text-xl font-black text-slate-800">
//           {mode === 'login' && 'Customer Login'}
//           {mode === 'register' && 'Create an Account'}
//           {mode === 'otp' && 'Verify Phone Number'}
//         </h2>
//         <p className="text-xs text-slate-500">
//           {mode === 'otp'
//             ? `Enter the OTP sent to ${formData.phone}`
//             : 'Fastest grocery delivery in your area within 1 hour!'}
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

//       {/* 1. Login Form */}
//       {mode === 'login' && (
//         <form onSubmit={handleLogin} className="space-y-4">
//           <div>
//             <label className="text-xs font-bold text-slate-700">Phone Number</label>
//             <input
//               type="text"
//               name="phone"
//               value={formData.phone}
//               onChange={handleChange}
//               placeholder="e.g., 9832413545"
//               className="w-full border rounded-xl p-3 text-sm mt-1 outline-none focus:ring-2 focus:ring-emerald-500"
//               required
//             />
//           </div>

//           <div>
//             <label className="text-xs font-bold text-slate-700">Password</label>
//             <input
//               type="password"
//               name="password"
//               value={formData.password}
//               onChange={handleChange}
//               placeholder="Enter your password"
//               className="w-full border rounded-xl p-3 text-sm mt-1 outline-none focus:ring-2 focus:ring-emerald-500"
//               required
//             />
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3 rounded-xl shadow-md transition disabled:opacity-50"
//           >
//             {loading ? 'Logging in...' : 'Login →'}
//           </button>

//           <div className="text-center pt-2">
//             <button
//               type="button"
//               onClick={() => {
//                 setMode('register');
//                 setErrorMsg('');
//                 setSuccessMsg('');
//               }}
//               className="text-xs font-bold text-emerald-600 hover:underline"
//             >
//               Don't have an account? Register here
//             </button>
//           </div>
//         </form>
//       )}

//       {/* 2. Registration Form */}
//       {mode === 'register' && (
//         <form onSubmit={handleRegister} className="space-y-4">
//           <div>
//             <label className="text-xs font-bold text-slate-700">Full Name</label>
//             <input
//               type="text"
//               name="name"
//               value={formData.name}
//               onChange={handleChange}
//               placeholder="e.g., John Doe"
//               className="w-full border rounded-xl p-3 text-sm mt-1 outline-none focus:ring-2 focus:ring-emerald-500"
//               required
//             />
//           </div>

//           <div>
//             <label className="text-xs font-bold text-slate-700">Phone Number</label>
//             <input
//               type="text"
//               name="phone"
//               value={formData.phone}
//               onChange={handleChange}
//               placeholder="e.g., 9832413545"
//               className="w-full border rounded-xl p-3 text-sm mt-1 outline-none focus:ring-2 focus:ring-emerald-500"
//               required
//             />
//           </div>

//           <div>
//             <label className="text-xs font-bold text-slate-700">Password</label>
//             <input
//               type="password"
//               name="password"
//               value={formData.password}
//               onChange={handleChange}
//               placeholder="Minimum 6 characters"
//               className="w-full border rounded-xl p-3 text-sm mt-1 outline-none focus:ring-2 focus:ring-emerald-500"
//               required
//             />
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3 rounded-xl shadow-md transition disabled:opacity-50"
//           >
//             {loading ? 'Processing...' : 'Send OTP & Continue →'}
//           </button>

//           <div className="text-center pt-2">
//             <button
//               type="button"
//               onClick={() => {
//                 setMode('login');
//                 setErrorMsg('');
//                 setSuccessMsg('');
//               }}
//               className="text-xs font-bold text-slate-600 hover:text-slate-900"
//             >
//               Already have an account? <span className="text-emerald-600 font-bold">Login here</span>
//             </button>
//           </div>
//         </form>
//       )}

//       {/* 3. OTP Verification Form */}
//       {mode === 'otp' && (
//         <form onSubmit={handleVerifyOtp} className="space-y-4">
//           <div>
//             <label className="text-xs font-bold text-slate-700">Enter OTP</label>
//             <input
//               type="text"
//               name="otp"
//               value={formData.otp}
//               onChange={handleChange}
//               placeholder="e.g., 123456"
//               maxLength="6"
//               className="w-full border rounded-xl p-3 text-center tracking-widest text-lg font-black mt-1 outline-none focus:ring-2 focus:ring-emerald-500"
//               required
//             />
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3 rounded-xl shadow-md transition disabled:opacity-50"
//           >
//             {loading ? 'Verifying...' : 'Verify & Enter'}
//           </button>

//           <div className="flex justify-between items-center text-xs pt-2">
//             <button
//               type="button"
//               onClick={handleResendOtp}
//               className="text-emerald-600 font-bold hover:underline"
//             >
//               Resend OTP
//             </button>
//             <button
//               type="button"
//               onClick={() => setMode('register')}
//               className="text-slate-500 hover:underline"
//             >
//               Change Phone Number
//             </button>
//           </div>
//         </form>
//       )}
//     </div>
//   );
// };

// export default CustomerLogin;































import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../../api/axiosConfig';
import BrandLogo from '../../../components/logo/BrandLogo';

const CustomerLogin = () => {
  const [mode, setMode] = useState('login'); // 'login' | 'register' | 'otp'
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    password: '',
    otp: '',
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMsg('');
  };

  // ১. Password-based Login (POST /api/user/login)
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!formData.phone || !formData.password) {
      return setErrorMsg('Phone number and password are required.');
    }
    try {
      setLoading(true);
      setErrorMsg('');
      const res = await API.post('/user/login', {
        phone: formData.phone,
        password: formData.password,
      });

      // Token এবং User দুটিই লোকাল স্টোরেজে সংরক্ষণ করা হলো
      if (res.data?.token || res.data?.userToken) {
        const token = res.data.token || res.data.userToken;
        localStorage.setItem('token', token);
        localStorage.setItem('userToken', token);
      }
      
      if (res.data?.user) {
        localStorage.setItem('user', JSON.stringify(res.data.user));
      }

      window.location.href = '/checkout'; // সেশন আপডেট হয়ে সরাসরি চেকআউটে নিয়ে যাবে
    } catch (err) {
      console.error('Login error:', err);
      const message = err.response?.data?.message || err.message || 'Login failed. Please try again.';
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  // ২. User Registration (POST /api/user/register)
  const handleRegister = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.password) {
      return setErrorMsg('All fields are required.');
    }
    try {
      setLoading(true);
      setErrorMsg('');
      const res = await API.post('/user/register', {
        name: formData.name,
        phone: formData.phone,
        password: formData.password,
      });

      setSuccessMsg(res.data?.message || 'OTP sent successfully to your phone.');
      setMode('otp');
    } catch (err) {
      console.error('Registration error:', err);
      const message = err.response?.data?.message || err.message || 'Registration failed. Please check server connection.';
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  // ৩. Verify OTP (POST /api/user/verify-otp)
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!formData.otp) {
      return setErrorMsg('Please enter the OTP code.');
    }
    try {
      setLoading(true);
      setErrorMsg('');
      const res = await API.post('/user/verify-otp', {
        phone: formData.phone,
        otp: formData.otp,
      });

      if (res.data?.token || res.data?.userToken) {
        const token = res.data.token || res.data.userToken;
        localStorage.setItem('token', token);
        localStorage.setItem('userToken', token);
      }

      if (res.data?.user) {
        localStorage.setItem('user', JSON.stringify(res.data.user));
      }

      window.location.href = '/';
    } catch (err) {
      console.error('Verify OTP error:', err);
      const message = err.response?.data?.message || err.message || 'Invalid or expired OTP.';
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  // ৪. Resend OTP (POST /api/user/resend-otp)
  const handleResendOtp = async () => {
    try {
      setLoading(true);
      setErrorMsg('');
      const res = await API.post('/user/resend-otp', { phone: formData.phone });
      setSuccessMsg(res.data?.message || 'A new OTP has been sent.');
    } catch (err) {
      console.error('Resend OTP error:', err);
      const message = err.response?.data?.message || err.message || 'Failed to resend OTP.';
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-12 p-6 bg-white border border-slate-200 rounded-3xl shadow-sm space-y-6">
      <div className="text-center space-y-2">
        <BrandLogo className="h-10 w-auto mx-auto" />
        <h2 className="text-xl font-black text-slate-800">
          {mode === 'login' && 'Customer Login'}
          {mode === 'register' && 'Create an Account'}
          {mode === 'otp' && 'Verify Phone Number'}
        </h2>
        <p className="text-xs text-slate-500">
          {mode === 'otp'
            ? `Enter the OTP sent to ${formData.phone}`
            : 'Fastest grocery delivery in your area within 1 hour!'}
        </p>
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

      {/* 1. Login Form */}
      {mode === 'login' && (
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700">Phone Number</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="e.g., 9832413545"
              className="w-full border rounded-xl p-3 text-sm mt-1 outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full border rounded-xl p-3 text-sm mt-1 outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3 rounded-xl shadow-md transition disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login →'}
          </button>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => {
                setMode('register');
                setErrorMsg('');
                setSuccessMsg('');
              }}
              className="text-xs font-bold text-emerald-600 hover:underline"
            >
              Don't have an account? Register here
            </button>
          </div>
        </form>
      )}

      {/* 2. Registration Form */}
      {mode === 'register' && (
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., John Doe"
              className="w-full border rounded-xl p-3 text-sm mt-1 outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700">Phone Number</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="e.g., 9832413545"
              className="w-full border rounded-xl p-3 text-sm mt-1 outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Minimum 6 characters"
              className="w-full border rounded-xl p-3 text-sm mt-1 outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3 rounded-xl shadow-md transition disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Send OTP & Continue →'}
          </button>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setErrorMsg('');
                setSuccessMsg('');
              }}
              className="text-xs font-bold text-slate-600 hover:text-slate-900"
            >
              Already have an account? <span className="text-emerald-600 font-bold">Login here</span>
            </button>
          </div>
        </form>
      )}

      {/* 3. OTP Verification Form */}
      {mode === 'otp' && (
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700">Enter OTP</label>
            <input
              type="text"
              name="otp"
              value={formData.otp}
              onChange={handleChange}
              placeholder="e.g., 123456"
              maxLength="6"
              className="w-full border rounded-xl p-3 text-center tracking-widest text-lg font-black mt-1 outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3 rounded-xl shadow-md transition disabled:opacity-50"
          >
            {loading ? 'Verifying...' : 'Verify & Enter'}
          </button>

          <div className="flex justify-between items-center text-xs pt-2">
            <button
              type="button"
              onClick={handleResendOtp}
              className="text-emerald-600 font-bold hover:underline"
            >
              Resend OTP
            </button>
            <button
              type="button"
              onClick={() => setMode('register')}
              className="text-slate-500 hover:underline"
            >
              Change Phone Number
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default CustomerLogin;