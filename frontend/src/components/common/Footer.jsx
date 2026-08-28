
// import React from 'react';
// import { Link } from 'react-router-dom';

// const Footer = () => {
//   return (
//     <footer className="bg-slate-950 text-slate-400 text-sm mt-auto border-t border-slate-800">
//       {/* Top Main Section */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          
//           {/* Col 1: Brand & About */}
//           <div className="space-y-4">
//             <div className="flex items-center gap-2">
//               <span className="text-2xl font-black text-emerald-400 tracking-tight">Grocera</span>
//               <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/20">
//                 1-Hour Delivery
//               </span>
//             </div>
//             <p className="text-xs text-slate-400 leading-relaxed">
//               Your trusted local grocery and fresh delivery network. Fastest delivery to your doorstep with live GPS order tracking.
//             </p>
//             <div className="pt-2 text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
//               <span>⚡ Fast • Fresh • Reliable</span>
//             </div>
//           </div>

//           {/* Col 2: Quick Links */}
//           <div>
//             <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
//               Quick Links
//             </h4>
//             <ul className="space-y-2.5 text-xs">
//               <li>
//                 <Link to="/" className="hover:text-emerald-400 transition-colors">Home Page</Link>
//               </li>
//               <li>
//                 <Link to="/checkout" className="hover:text-emerald-400 transition-colors">My Cart & Checkout</Link>
//               </li>
//               <li>
//                 <Link to="/login" className="hover:text-emerald-400 transition-colors">Customer Login / Account</Link>
//               </li>
//               <li>
//                    <Link to="/about" className="hover:text-emerald-400 transition-colors">About of Grocera pvt. ltd.</Link>
//             </li>
//             </ul>
//           </div>

//           {/* Col 3: Partner Portal */}
//           <div>
//             <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
//               Partner Portal
//             </h4>
//             <ul className="space-y-2.5 text-xs">
//               <li>
//                 <Link to="/seller/auth" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
//                   <span>🏪</span> Seller Registration & Login
//                 </Link>
//               </li>
//               <li>
//                 <Link to="/delivery/auth" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
//                   <span>🛵</span> Join as Delivery Partner
//                 </Link>
//               </li>
//               <li>
//                 <Link to="/admin/login" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
//                   <span>👑</span> Admin Panel
//                 </Link>
//               </li>
//             </ul>
//           </div>

//           {/* Col 4: Contact with Platform Owner */}
//           <div className="space-y-3">
//             <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
//               Contact Platform Owner
//             </h4>
            
//             {/* Email Support */}
//             <div className="space-y-1.5">
//               <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Email Support</span>
              
//               <a 
//                 href="mailto:skyrani40@gmail.com" 
//                 className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold block transition break-all"
//               >
//                 ✉️ skyrani40@gmail.com
//               </a>

//               <a 
//                 href="mailto:sksadikul676@gmail.com" 
//                 className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold block transition break-all"
//               >
//                 ✉️ sksadikul676@gmail.com
//               </a>
//             </div>

//             {/* Direct Phone Numbers */}
//             <div className="pt-2 space-y-1.5">
//               <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Direct Contact</span>
              
//               <div className="flex items-center justify-between text-xs bg-slate-900/80 p-2 rounded-lg border border-slate-800/80">
//                 <span className="text-slate-300 font-medium">Manir:</span>
//                 <a href="tel:9832413545" className="text-emerald-400 hover:underline font-bold">
//                   📞 9832413545
//                 </a>
//               </div>

//               <div className="flex items-center justify-between text-xs bg-slate-900/80 p-2 rounded-lg border border-slate-800/80">
//                 <span className="text-slate-300 font-medium">Sadikul:</span>
//                 <a href="tel:7364922797" className="text-emerald-400 hover:underline font-bold">
//                   📞 7364922797
//                 </a>
//               </div>
//             </div>
//           </div>

//         </div>
//       </div>

//       {/* Bottom Copyright Strip */}
//       <div className="border-t border-slate-900 bg-black/40 py-4">
//         <div className="max-w-7xl mx-auto px-4 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
//           <p>© 2026 Grocera. All rights reserved.</p>
//           <p className="flex items-center gap-1">
//             Built with <span className="text-emerald-500 font-bold">MERN Stack</span> & Tailwind CSS
//           </p>
//         </div>
//       </div>
//     </footer>
//   );
// };

// export default Footer;











import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-slate-950 text-slate-400 text-sm mt-auto border-t border-slate-800">
      {/* Top Main Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Col 1: Brand & About */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black text-emerald-400 tracking-tight">Grocera</span>
              <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/20">
                1-Hour Delivery
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Your trusted local grocery and fresh delivery network. Fastest delivery to your doorstep with live GPS order tracking.
            </p>
            <div className="pt-2 text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
              <span>⚡ Fast • Fresh • Reliable</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/" className="hover:text-emerald-400 transition-colors">Home Page</Link>
              </li>
              <li>
                <Link to="/checkout" className="hover:text-emerald-400 transition-colors">My Cart & Checkout</Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-emerald-400 transition-colors">Customer Login / Account</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-emerald-400 transition-colors">About Grocera Pvt. Ltd.</Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Partner Portal */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
              Partner Portal
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/seller/auth" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <span>🏪</span> Seller Registration & Login
                </Link>
              </li>
              <li>
                <Link to="/delivery/auth" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <span>🛵</span> Join as Delivery Partner
                </Link>
              </li>
              <li>
                <Link to="/admin/login" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <span>👑</span> Admin Panel
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact with Platform Owner */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
              Contact Platform Owner
            </h4>
            
            {/* Email Support */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Email Support</span>
              
              <a 
                href="mailto:skyrani40@gmail.com" 
                className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold block transition break-all"
              >
                ✉️ skyrani40@gmail.com
              </a>

              <a 
                href="mailto:sksadikul676@gmail.com" 
                className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold block transition break-all"
              >
                ✉️ sksadikul676@gmail.com
              </a>
            </div>

            {/* Direct Phone Numbers */}
            <div className="pt-2 space-y-1.5">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Direct Contact</span>
              
              <div className="flex items-center justify-between text-xs bg-slate-900/80 p-2 rounded-lg border border-slate-800/80">
                <span className="text-slate-300 font-medium">Manir:</span>
                <a href="tel:9832413545" className="text-emerald-400 hover:underline font-bold">
                  📞 9832413545
                </a>
              </div>

              <div className="flex items-center justify-between text-xs bg-slate-900/80 p-2 rounded-lg border border-slate-800/80">
                <span className="text-slate-300 font-medium">Sadikul:</span>
                <a href="tel:7364922797" className="text-emerald-400 hover:underline font-bold">
                  📞 7364922797
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Copyright Strip */}
      <div className="border-t border-slate-900 bg-black/40 py-4">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© 2026 Grocera. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            <span>Designed & Developed by</span>
            <span className="text-emerald-400 font-bold hover:text-emerald-300 transition-colors">
              Manir Hassan Molla
            </span>
            <span className="text-slate-600">•</span>
            <span>Built with <strong className="text-emerald-500 font-bold">MERN TECHNOLOGIES</strong></span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;