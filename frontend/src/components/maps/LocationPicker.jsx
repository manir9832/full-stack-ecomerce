import React from 'react';

const LocationPicker = ({ onSelectLocation }) => {
  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        onSelectLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      });
    }
  };

  return (
    <div className="p-4 bg-slate-50 border rounded-xl flex items-center justify-between">
      <span className="text-xs font-bold text-slate-700">
        📍 Use Your Current GPS Location
      </span>
      <button
        onClick={handleGetLocation}
        className="bg-emerald-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow"
      >
        Set GPS
      </button>
    </div>
  );
};

export default LocationPicker;