import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import {
  verifyOTP,
  resendOTP,
} from "../services/api";

const VerifyOTP = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const phone = location.state?.phone || "";

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();

    if (!phone) {
      toast.error("Phone number not found");
      return;
    }

    if (otp.trim().length !== 6) {
      toast.error("Enter 6 digit OTP");
      return;
    }

    try {
      setLoading(true);

      const res = await verifyOTP({
        phone,
        otp,
      });

      toast.success(res.data.message);

      navigate("/login");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "OTP verification failed"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      const res = await resendOTP({
        phone,
      });

      toast.success(res.data.message);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to resend OTP"
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">

      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">

        <h1 className="text-3xl font-bold text-center">
          Verify OTP
        </h1>

        <p className="text-center text-gray-500 mt-2">
          OTP has been sent to
        </p>

        <p className="text-center font-semibold text-green-600 mb-6">
          {phone}
        </p>

        <form
          onSubmit={handleVerify}
          className="space-y-5"
        >
          <input
            type="text"
            maxLength={6}
            value={otp}
            onChange={(e) =>
              setOtp(e.target.value)
            }
            placeholder="Enter 6 digit OTP"
            className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold"
          >
            {loading
              ? "Verifying..."
              : "Verify OTP"}
          </button>
        </form>

        <button
          onClick={handleResendOTP}
          className="w-full mt-4 text-green-600 hover:underline"
        >
          Resend OTP
        </button>

      </div>

    </div>
  );
};

export default VerifyOTP;