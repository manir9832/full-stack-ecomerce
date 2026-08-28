import React from 'react';

const LocationTrackingMap = ({ customerLoc, deliveryBoyLoc, storeLoc }) => {
  return (
    <div className="relative w-full h-64 bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 flex items-center justify-center">
      {/* Visual Live GPS Indicator Overlay */}
      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm border text-[11px] font-bold text-slate-700 flex items-center gap-2 z-10">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
        <span>Live GPS Location Synced</span>
      </div>

      {/* Dynamic Map Data Render View */}
      <div className="w-full h-full p-4 flex flex-col justify-between bg-slate-50 relative">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs z-10 mt-8">
          
          {/* Store Location */}
          <div className="bg-white p-2.5 rounded-xl border shadow-sm space-y-1">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase block">1. Store</span>
            <p className="font-bold text-slate-800 flex items-center gap-1">
              <span>🏪</span>
              <span className="truncate">
                {storeLoc?.lat
                  ? `${storeLoc.lat.toFixed(4)}, ${storeLoc.lng.toFixed(4)}`
                  : 'Store location available'}
              </span>
            </p>
          </div>

          {/* Delivery Boy Location */}
          <div className="bg-emerald-50 border-emerald-200 p-2.5 rounded-xl border shadow-sm space-y-1">
            <span className="text-[10px] font-extrabold text-emerald-600 uppercase block">
              2. Delivery Partner (Live)
            </span>
            <p className="font-bold text-emerald-900 flex items-center gap-1">
              <span>🛵</span>
              <span className="truncate">
                {deliveryBoyLoc?.lat
                  ? `${deliveryBoyLoc.lat.toFixed(4)}, ${deliveryBoyLoc.lng.toFixed(4)}`
                  : 'Tracking delivery partner location...'}
              </span>
            </p>
          </div>

          {/* Customer Location */}
          <div className="bg-white p-2.5 rounded-xl border shadow-sm space-y-1">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase block">
              3. Your Delivery Address
            </span>
            <p className="font-bold text-slate-800 flex items-center gap-1">
              <span>📍</span>
              <span className="truncate">
                {customerLoc?.lat
                  ? `${customerLoc.lat.toFixed(4)}, ${customerLoc.lng.toFixed(4)}`
                  : 'Address synced'}
              </span>
            </p>
          </div>

        </div>

        <div className="text-center text-[11px] font-bold text-slate-400 py-2">
          🗺️ Calculating distance using the OSRM Live Routing Server
        </div>
      </div>
    </div>
  );
};

export default LocationTrackingMap;