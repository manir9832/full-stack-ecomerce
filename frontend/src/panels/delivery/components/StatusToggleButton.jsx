import React from 'react';

const StatusToggleButton = ({ isOnline, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className={`w-full py-3 rounded-xl font-black text-xs transition shadow-md ${
        isOnline
          ? 'bg-emerald-600 text-white shadow-emerald-200'
          : 'bg-slate-200 text-slate-700'
      }`}
    >
      {isOnline
        ? '🟢 You are On Duty (Online)'
        : '🔴 Off Duty (Offline)'}
    </button>
  );
};

export default StatusToggleButton;