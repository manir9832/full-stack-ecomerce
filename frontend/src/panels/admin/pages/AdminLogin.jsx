import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    localStorage.setItem('token', 'admin-token');
    localStorage.setItem('role', 'admin');

    navigate('/admin/dashboard');
  };

  return (
    <div className="max-w-md mx-auto my-16 p-6 bg-white border rounded-2xl shadow-sm space-y-4">
      <h2 className="text-xl font-black text-slate-800 text-center">
        Super Admin Login
      </h2>

      <form onSubmit={handleLogin} className="space-y-3">
        <input
          type="email"
          placeholder="Admin Email"
          className="w-full border rounded-xl p-2.5 text-sm"
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border rounded-xl p-2.5 text-sm"
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full bg-slate-900 text-white font-extrabold py-2.5 rounded-xl"
        >
          Login to Dashboard
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;