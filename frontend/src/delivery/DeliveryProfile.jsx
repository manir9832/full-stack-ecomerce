import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const DeliveryProfile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await axios.get('/api/delivery/is-auth', { withCredentials: true });
                setProfile(res.data.deliveryBoy);
            } catch (err) {
                console.error('Profile load error:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleLogout = async () => {
        try {
            await axios.post('/api/delivery/logout', {}, { withCredentials: true });
            navigate('/delivery/login');
        } catch (err) {
            alert('Failed to logout');
        }
    };

    if (loading) return <div className="text-center p-8">Loading profile...</div>;

    return (
        <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-xl my-8 space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 text-center border-b pb-4">
                Partner Profile
            </h2>

            <div className="space-y-3 text-gray-700 text-sm">
                <div className="flex justify-between py-2 border-b">
                    <span className="font-semibold">Name:</span>
                    <span>{profile?.name}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                    <span className="font-semibold">Phone:</span>
                    <span>{profile?.phone}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                    <span className="font-semibold">Role:</span>
                    <span className="capitalize">{profile?.role}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                    <span className="font-semibold">Approval Status:</span>
                    <span className={profile?.isApproved ? 'text-green-600 font-bold' : 'text-amber-600 font-bold'}>
                        {profile?.isApproved ? 'Approved' : 'Pending Approval'}
                    </span>
                </div>
            </div>

            <button
                onClick={handleLogout}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 rounded-lg transition"
            >
                Logout
            </button>
        </div>
    );
};

export default DeliveryProfile;