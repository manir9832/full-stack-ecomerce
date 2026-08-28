const axios = require("axios");

const sendOTP = async (phone, otp) => {
    try {
        const apiKey = process.env.TWO_FACTOR_API_KEY;

        // Approved Template 'OTP1' সহ 2Factor SMS URL
        const url = `https://2factor.in/API/V1/${apiKey}/SMS/+91${phone}/${otp}/OTP1`;

        const response = await axios.get(url);

        console.log("2Factor Response:", response.data);

        return response.data;

    } catch (error) {
        console.error(
            "2Factor Error:",
            error.response?.data || error.message
        );

        throw error;
    }
};

module.exports = sendOTP;