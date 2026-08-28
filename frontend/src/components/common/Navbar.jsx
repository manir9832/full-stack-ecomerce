

import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import BrandLogo from "../logo/BrandLogo";
import OneHourDeliveryBadge from "../badges/OneHourDeliveryBadge";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  // URL থেকে বর্তমান সার্চ কুয়েরি রিড করা
  const querySearch = searchParams.get("search") || "";
  const [searchTerm, setSearchTerm] = useState(querySearch);

  const cartItems = useSelector((state) => state.cart?.items || []);
  const totalCartCount = cartItems.reduce(
    (total, item) => total + (item.quantity || 1),
    0
  );

  const [user, setUser] = useState(null);

  // URL পরিবর্তিত হলে ইনপুট সিঙ্ক রাখা
  useEffect(() => {
    setSearchTerm(searchParams.get("search") || "");
  }, [searchParams]);

  // কাস্টমার ইউজার স্টেট রিড করা
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, [location.pathname]);

  // সার্চ ইনপুট পরিবর্তন হ্যান্ডলার
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim()) {
      navigate(`/?search=${encodeURIComponent(value.trim())}`);
    } else {
      navigate("/");
    }
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    navigate("/");
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("userToken");
    setUser(null);
    navigate("/login");
  };

  // সেলার, ডেলিভারি বা এডমিন প্যানেলে থাকলে কাস্টমার Navbar লুকানো হবে
  const isDashboardRoute =
    location.pathname.startsWith("/seller") ||
    location.pathname.startsWith("/delivery") ||
    location.pathname.startsWith("/admin");

  if (isDashboardRoute) {
    return null;
  }

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* 1. Brand Logo */}
          <Link to="/" className="flex-shrink-0">
            <BrandLogo className="h-10 w-auto" />
          </Link>

          {/* 2. One Hour Delivery Promise Badge */}
          <div className="hidden md:block">
            <OneHourDeliveryBadge />
          </div>

          {/* 3. Global Search Bar (Desktop) */}
          <div className="flex-1 max-w-md hidden sm:block">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Search for rice, lentils, milk, snacks, and more..."
                className="w-full bg-slate-100 border border-slate-200 rounded-full py-2 pl-4 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
              />
              {searchTerm ? (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-700 text-xs font-bold"
                >
                  ✕
                </button>
              ) : (
                <span className="absolute right-3 top-2.5 text-slate-400">
                  🔍
                </span>
              )}
            </div>
          </div>

          {/* 4. Action Buttons (Dynamic Auth, Orders & Cart) */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-full">
                  👤 {user.name || user.phone || "User"}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-xs font-bold text-rose-600 hover:text-rose-700 px-2 py-1 transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="text-sm font-semibold text-slate-700 hover:text-emerald-600 px-3 py-2 rounded-lg transition"
              >
                Login / Register
              </Link>
            )}

            {/* My Orders Button */}
            <Link
              to="/my-orders"
              className="text-xs font-black bg-emerald-50 text-emerald-700 hover:bg-emerald-100 px-3.5 py-2 rounded-xl border border-emerald-200 transition flex items-center gap-1.5"
            >
              📦 My Orders
            </Link>

            {/* Cart Icon Button */}
            <button
              onClick={() => navigate("/checkout")}
              className="relative flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-full font-bold text-sm shadow-md transition active:scale-95"
            >
              <span>🛒</span>
              <span className="hidden sm:inline">Cart</span>
              {totalCartCount > 0 && (
                <span className="bg-amber-400 text-slate-900 text-xs w-5 h-5 flex items-center justify-center rounded-full font-extrabold">
                  {totalCartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile View: Search & Badge Bar */}
        <div className="sm:hidden pb-3 flex flex-col gap-2">
          <div className="flex justify-center">
            <OneHourDeliveryBadge />
          </div>
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search for products..."
              className="w-full bg-slate-100 border border-slate-200 rounded-full py-1.5 pl-4 pr-10 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            {searchTerm ? (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-3 top-2 text-slate-400 hover:text-slate-700 text-xs font-bold"
              >
                ✕
              </button>
            ) : (
              <span className="absolute right-3 top-2 text-slate-400 text-xs">
                🔍
              </span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;