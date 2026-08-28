import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const SellerSignup = () => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        password: '',
        aadhaarNumber: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        try {
            const res = await axios.post('/api/seller/register', formData);

            if (res.status === 201) {
                setMessage(res.data.message);
                setTimeout(() => {
                    navigate('/seller/login');
                }, 3000);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-md">
                <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
                    Seller Registration
                </h2>

                {message && (
                    <div className="bg-green-100 text-green-700 p-3 rounded mb-4 text-sm">
                        {message}
                    </div>
                )}

                {error && (
                    <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Full Name / Store Name</label>
                        <input
                            type="text"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full border px-3 py-2 rounded-lg focus:outline-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Phone Number</label>
                        <input
                            type="text"
                            name="phone"
                            required
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full border px-3 py-2 rounded-lg focus:outline-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Govt ID / Aadhaar Number</label>
                        <input
                            type="text"
                            name="aadhaarNumber"
                            required
                            value={formData.aadhaarNumber}
                            onChange={handleChange}
                            className="w-full border px-3 py-2 rounded-lg focus:outline-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Password</label>
                        <input
                            type="password"
                            name="password"
                            required
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full border px-3 py-2 rounded-lg focus:outline-blue-500"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                        {loading ? 'Submitting...' : 'Register'}
                    </button>
                </form>

                <p className="mt-4 text-center text-sm text-gray-600">
                    Already registered?{' '}
                    <Link to="/seller/login" className="text-blue-600 font-semibold">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default SellerSignup;