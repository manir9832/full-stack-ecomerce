import React from 'react';
import { Link } from 'react-router-dom';

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      
      {/* 🌟 HERO SECTION */}
      <section className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-slate-900 text-white py-20 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        <div className="max-w-4xl mx-auto space-y-6 relative z-10">
          <span className="inline-block bg-emerald-500/20 text-emerald-300 text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full border border-emerald-400/30">
            About Grocera Pvt Ltd
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
            Empowering Local Commerce, <br />
            <span className="text-emerald-400">Delivered Within 1 Hour.</span>
          </h1>
          <p className="text-base sm:text-lg text-emerald-100/80 max-w-2xl mx-auto font-medium leading-relaxed">
            Grocera is a next-generation hyper-local grocery delivery network bridging the gap between local retail sellers and modern consumers with lightning-fast logistics and live GPS tracking.
          </p>
        </div>
      </section>

      {/* 🎯 MISSION & VISION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition space-y-4">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center text-2xl font-black">
              🎯
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900">Our Mission</h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              At Grocera Pvt Ltd, our mission is to empower neighborhood grocery stores by digitizing their inventory and connecting them with nearby customers. We ensure fresh, authentic daily essentials reach household doorsteps in record time without compromising quality.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition space-y-4">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center text-2xl font-black">
              🚀
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900">Our Vision</h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              To build the most trusted and efficient hyper-local micro-logistics infrastructure across West Bengal and beyond, transforming everyday grocery shopping through instant convenience, sustainable partner earnings, and transparent technology.
            </p>
          </div>

        </div>
      </section>

      {/* ⚡ WHY CHOOSE GROCERA */}
      <section className="bg-white py-16 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <h3 className="text-xs font-black text-emerald-600 uppercase tracking-widest">Why Choose Us</h3>
            <h2 className="text-3xl font-black text-slate-900">Built For Speed, Freshness & Trust</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
              <span className="text-3xl">⏱️</span>
              <h4 className="font-bold text-slate-900 text-base">1-Hour Express Delivery</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Hyper-local routing algorithms ensure your order is packed and delivered in under 60 minutes.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
              <span className="text-3xl">📍</span>
              <h4 className="font-bold text-slate-900 text-base">Live GPS Order Tracking</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Track your delivery partner in real-time from the store directly to your doorstep.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
              <span className="text-3xl">🏪</span>
              <h4 className="font-bold text-slate-900 text-base">Support Local Sellers</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Directly helping local neighborhood merchants expand their businesses in the digital era.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
              <span className="text-3xl">💳</span>
              <h4 className="font-bold text-slate-900 text-base">Secure & Easy Payments</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Seamless Cash on Delivery (COD) and encrypted online payments via Razorpay.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 👥 LEADERSHIP / PLATFORM OWNERS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <h3 className="text-xs font-black text-emerald-600 uppercase tracking-widest">Leadership Team</h3>
          <h2 className="text-3xl font-black text-slate-900">Meet the Founders</h2>
          <p className="text-xs text-slate-500">Driving technology, product development, and operations at Grocera Pvt Ltd.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-3xl mx-auto">
          
          {/* Founder 1 */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center text-center space-y-4 hover:border-emerald-500 transition">
            <div className="w-20 h-20 bg-emerald-600 text-white rounded-full flex items-center justify-center text-2xl font-black shadow-lg">
              M
            </div>
            <div>
              <h4 className="text-lg font-black text-slate-900">Manir Hassan</h4>
              <p className="text-xs font-bold text-emerald-600">Co-Founder & Lead Architect</p>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Spearheading full-stack software architecture, cloud scalability, and location-based delivery algorithms.
            </p>
            <div className="pt-2 flex flex-col gap-1 text-xs">
              <a href="tel:9832413545" className="text-slate-700 hover:text-emerald-600 font-bold">
                📞 +91 9832413545
              </a>
              <a href="mailto:skyrani40@gmail.com" className="text-slate-500 hover:text-emerald-600 font-medium">
                ✉️ skyrani40@gmail.com
              </a>
            </div>
          </div>

          {/* Founder 2 */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center text-center space-y-4 hover:border-emerald-500 transition">
            <div className="w-20 h-20 bg-slate-900 text-white rounded-full flex items-center justify-center text-2xl font-black shadow-lg">
              S
            </div>
            <div>
              <h4 className="text-lg font-black text-slate-900">Sadikul</h4>
              <p className="text-xs font-bold text-emerald-600">Co-Founder & Operations Lead</p>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Managing merchant onboarding, hyper-local logistics operations, and partner network expansions.
            </p>
            <div className="pt-2 flex flex-col gap-1 text-xs">
              <a href="tel:7364922797" className="text-slate-700 hover:text-emerald-600 font-bold">
                📞 +91 7364922797
              </a>
              <a href="mailto:sksadikul676@gmail.com" className="text-slate-500 hover:text-emerald-600 font-medium">
                ✉️ sksadikul676@gmail.com
              </a>
            </div>
          </div>

        </div>
      </section>

      {/* 📞 CONTACT & REGISTRATION DETAILS */}
      <section className="bg-slate-900 text-white py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-2xl sm:text-3xl font-black">Ready to experience 1-Hour Grocery Delivery?</h2>
          <p className="text-slate-400 text-xs sm:text-sm max-w-xl mx-auto">
            Order fresh daily groceries right to your doorstep or partner with us as a verified seller or delivery hero.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <Link
              to="/"
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl font-extrabold text-xs shadow-lg transition active:scale-95"
            >
              Start Shopping Now
            </Link>
            <Link
              to="/seller/auth"
              className="bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 px-6 py-3 rounded-xl font-extrabold text-xs transition active:scale-95"
            >
              Become a Seller
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default AboutUs;