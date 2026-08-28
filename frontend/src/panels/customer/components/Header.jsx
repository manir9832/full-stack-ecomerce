
// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import BrandLogo from '../../../components/logo/BrandLogo';
// import OneHourDeliveryBadge from '../../../components/badges/OneHourDeliveryBadge';
// import API from '../../../api/axiosConfig';

// const Header = ({ onCartClick, cartCount = 0 }) => {
//   const [user, setUser] = useState(null);
//   const [locationName, setLocationName] = useState('Select Location');
//   const [locLoading, setLocLoading] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const storedUser = localStorage.getItem('user');
//     if (storedUser) {
//       setUser(JSON.parse(storedUser));
//     }
//   }, []);

//   // ব্রাউজার থেকে লাইভ লোকেশন নিয়ে ব্যাকএন্ডে সেভ করা
//   const handleGetLocation = () => {
//     if (!navigator.geolocation) {
//       return alert('Geolocation is not supported by your browser');
//     }

//     setLocLoading(true);
//     navigator.geolocation.getCurrentPosition(
//       async (position) => {
//         const { latitude, longitude } = position.coords;
//         try {
//           // ব্যাকএন্ডে লোকেশন আপডেট (PUT /api/user/location)
//           await API.put('/user/location', { latitude, longitude });
//           setLocationName(`Lat: ${latitude.toFixed(2)}, Lng: ${longitude.toFixed(2)}`);
//           alert('Location updated successfully!');
//         } catch (err) {
//           console.error('Location update error:', err);
//           setLocationName('Location updated locally');
//         } finally {
//           setLocLoading(false);
//         }
//       },
//       (error) => {
//         console.error('GPS error:', error);
//         alert('Please allow location permission in your browser.');
//         setLocLoading(false);
//       }
//     );
//   };

//   const handleLogout = async () => {
//     try {
//       await API.post('/user/logout');
//     } catch (e) {
//       console.error(e);
//     }
//     localStorage.removeItem('user');
//     setUser(null);
//     navigate('/login');
//   };

//   return (
//     <div className="bg-white border-b py-3 px-4 sm:px-8 flex items-center justify-between gap-4 shadow-sm sticky top-0 z-40">
//       <div className="flex items-center gap-4">
//         <div onClick={() => navigate('/')} className="cursor-pointer">
//           <BrandLogo className="h-9 w-auto" />
//         </div>
        
//         {/* লোকেশন বাটন */}
//         <button
//           onClick={handleGetLocation}
//           disabled={locLoading}
//           className="flex items-center gap-1.5 text-xs text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-full transition max-w-xs truncate font-medium"
//         >
//           <span>📍</span>
//           <span className="truncate">
//             {locLoading ? 'Fetching GPS...' : locationName}
//           </span>
//         </button>
//       </div>

//       <div className="flex items-center gap-3">
//         <div className="hidden sm:block">
//           <OneHourDeliveryBadge />
//         </div>

//         {/* কার্ট বাটন */}
//         <button
//           onClick={onCartClick}
//           className="relative bg-emerald-50 text-emerald-700 border border-emerald-200 p-2 rounded-xl flex items-center gap-2 font-bold text-xs hover:bg-emerald-100 transition"
//         >
//           <span>🛒</span>
//           <span>Cart</span>
//           {cartCount > 0 && (
//             <span className="bg-emerald-600 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center">
//               {cartCount}
//             </span>
//           )}
//         </button>

//         {/* প্রোফাইল আইকন অথবা লগইন বাটন */}
//         {user ? (
//           <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5">
//             <div className="w-7 h-7 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold text-xs uppercase">
//               {user.name ? user.name.charAt(0) : 'U'}
//             </div>
//             <div className="text-left hidden md:block">
//               <p className="text-xs font-bold text-slate-800 leading-tight">{user.name}</p>
//               <p className="text-[10px] text-slate-500">{user.phone}</p>
//             </div>
//             <button
//               onClick={handleLogout}
//               title="Logout"
//               className="text-xs text-red-500 hover:text-red-700 font-bold ml-1"
//             >
//               ✕
//             </button>
//           </div>
//         ) : (
//           <button
//             onClick={() => navigate('/login')}
//             className="text-xs font-bold text-slate-700 hover:text-emerald-600 px-2 py-1"
//           >
//             Login / Register
//           </button>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Header;





















import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BrandLogo from '../../../components/logo/BrandLogo';
import OneHourDeliveryBadge from '../../../components/badges/OneHourDeliveryBadge';
import API from '../../../api/axiosConfig';

const Header = ({ onCartClick, cartCount = 0 }) => {
  const [user, setUser] = useState(null);
  const [locationName, setLocationName] = useState('743424 (West Bengal)');
  const [locLoading, setLocLoading] = useState(false);
  const navigate = useNavigate();

  // ইউজার ডেটা লোড
  useEffect(() => {
    const checkUser = () => {
      try {
        const rawUser = localStorage.getItem('user');
        if (rawUser && rawUser !== 'undefined') {
          setUser(JSON.parse(rawUser));
        } else {
          setUser(null);
        }
      } catch (e) {
        setUser(null);
      }
    };

    checkUser();
    window.addEventListener('storage', checkUser);
    return () => window.removeEventListener('storage', checkUser);
  }, []);

  // ব্রাউজার থেকে লাইভ GPS কোঅর্ডিনেট নেওয়া
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      return alert('Geolocation is not supported by your browser');
    }

    setLocLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          await API.put('/user/location', { latitude, longitude });
          setLocationName(`GPS: ${latitude.toFixed(2)}, ${longitude.toFixed(2)}`);
          alert('Store delivery location synced successfully!');
        } catch (err) {
          console.error('Location sync error:', err);
          setLocationName('Location updated locally');
        } finally {
          setLocLoading(false);
        }
      },
      (error) => {
        console.error('GPS error:', error);
        alert('Please allow location permission in your browser.');
        setLocLoading(false);
      }
    );
  };

  const handleLogout = async () => {
    try {
      await API.post('/user/logout');
    } catch (e) {
      console.error(e);
    }
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('userToken');
    setUser(null);
    navigate('/login');
  };

  return (
    <div className="bg-white border-b py-3 px-4 sm:px-8 flex items-center justify-between gap-4 shadow-sm sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <div onClick={() => navigate('/')} className="cursor-pointer">
          <BrandLogo className="h-9 w-auto" />
        </div>
        
        {/* লোকেশন বাটন */}
        <button
          onClick={handleGetLocation}
          disabled={locLoading}
          className="flex items-center gap-1.5 text-xs text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-full transition max-w-xs truncate font-medium"
        >
          <span>📍</span>
          <span className="truncate">
            {locLoading ? 'Fetching GPS...' : locationName}
          </span>
        </button>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden sm:block">
          <OneHourDeliveryBadge />
        </div>

        {/* কার্ট বাটন */}
        <button
          onClick={onCartClick}
          className="relative bg-emerald-50 text-emerald-700 border border-emerald-200 p-2 rounded-xl flex items-center gap-2 font-bold text-xs hover:bg-emerald-100 transition"
        >
          <span>🛒</span>
          <span>Cart</span>
          {cartCount > 0 && (
            <span className="bg-emerald-600 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-black">
              {cartCount}
            </span>
          )}
        </button>

        {/* ইউজার প্রোফাইল অথবা লগইন অপশন */}
        {user ? (
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5">
            <div className="w-7 h-7 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold text-xs uppercase shadow-sm">
              {user.name ? user.name.charAt(0) : 'U'}
            </div>
            <div className="text-left hidden md:block">
              <p className="text-xs font-bold text-slate-800 leading-tight">{user.name}</p>
              <p className="text-[10px] text-slate-500">{user.phone}</p>
            </div>
            <button
              onClick={handleLogout}
              title="Logout"
              className="text-xs text-red-500 hover:text-red-700 font-bold ml-1"
            >
              ✕
            </button>
          </div>
        ) : (
          <button
            onClick={() => navigate('/login')}
            className="text-xs font-bold text-slate-700 hover:text-emerald-600 px-2 py-1"
          >
            Login / Register
          </button>
        )}
      </div>
    </div>
  );
};

export default Header;