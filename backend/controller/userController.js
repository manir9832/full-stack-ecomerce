// const User = require("../model/user");
// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");
// const generateOTP = require("../utils/generateOtp");
// const sendOTP = require("../utils/sendOtp");



// // ======================================
// // REGISTER
// // ======================================
// const register = async (req, res) => {
//     try {
//         const { name, phone, password } = req.body;

//         // Check required fields
//         if (!name || !phone || !password) {
//             return res.status(400).json({
//                 message: "Name, phone and password are required"
//             });
//         }

//         // Check existing user
//         const existingUser = await User.findOne({ phone });

//         if (existingUser) {

//             // If already verified
//             if (existingUser.isPhoneVerified) {
//                 return res.status(400).json({
//                     message: "User already exists"
//                 });
//             }

//             // User exists but phone is not verified
//             const otp = generateOTP();

//             existingUser.otp = otp;
//             existingUser.otpExpiresAt = new Date(
//                 Date.now() + 5 * 60 * 1000
//             );

//             await existingUser.save();

//             await sendOTP(phone, otp);

//             return res.status(200).json({
//                 message: "OTP sent again. Please verify your phone"
//             });
//         }

//         // Hash password
//         const hashedPassword = await bcrypt.hash(password, 10);

//         // Generate OTP
//         const otp = generateOTP();

//         // OTP expires after 5 minutes
//         const otpExpiresAt = new Date(
//             Date.now() + 3 * 60 * 1000
//         );

//         // Create user
//         const user = await User.create({
//             name,
//             phone,
//             password: hashedPassword,
//             role: "user",
//             isPhoneVerified: false,
//             otp,
//             otpExpiresAt
//         });

//         // Send OTP
//         const otpResponse = await sendOTP(phone, otp);

//         console.log("2Factor Response:", otpResponse);

//         return res.status(201).json({
//             message: "User registered. OTP sent to your phone",
//             userId: user._id
//         });

//     } catch (error) {
//         console.error("Register Error:", error);

//         return res.status(500).json({
//             message: "Server error"
//         });
//     }
// };


// // ======================================
// // VERIFY OTP
// // ======================================
// const verifyOTP = async (req, res) => {
//     try {
//         const { phone, otp } = req.body;

//         if (!phone || !otp) {
//             return res.status(400).json({
//                 message: "Phone and OTP are required"
//             });
//         }

//         // Find user
//         const user = await User.findOne({ phone });

//         if (!user) {
//             return res.status(404).json({
//                 message: "User not found"
//             });
//         }

//         // Check already verified
//         if (user.isPhoneVerified) {
//             return res.status(400).json({
//                 message: "Phone already verified"
//             });
//         }

//         // Check OTP expiry
//         if (
//             !user.otpExpiresAt ||
//             user.otpExpiresAt < new Date()
//         ) {
//             return res.status(400).json({
//                 message: "OTP expired. Please request a new OTP"
//             });
//         }

//         // Check OTP
//         if (user.otp !== otp) {
//             return res.status(400).json({
//                 message: "Invalid OTP"
//             });
//         }

//         // Phone verified
//         user.isPhoneVerified = true;

//         user.otp = undefined;
//         user.otpExpiresAt = undefined;

//         await user.save();

//         // Create JWT
//         const token = jwt.sign(
//             {
//                 id: user._id,
//                 role: user.role
//             },
//             process.env.JWT_SECRET,
//             {
//                 expiresIn: "6h"
//             }
//         );

//         // Set cookie
//         res.cookie("token", token, {
//             httpOnly: true,

//             sameSite:
//                 process.env.NODE_ENV === "production"
//                     ? "none"
//                     : "strict",

//             secure:
//                 process.env.NODE_ENV === "production",

//             maxAge: 6 * 60 * 60 * 1000
//         });

//         return res.status(200).json({
//             message: "Phone verified successfully",

//             user: {
//                 id: user._id,
//                 name: user.name,
//                 phone: user.phone,
//                 role: user.role,
//                 isPhoneVerified: user.isPhoneVerified
//             }
//         });

//     } catch (error) {
//         console.error("Verify OTP Error:", error);

//         return res.status(500).json({
//             message: "Server error"
//         });
//     }
// };


// // ======================================
// // RESEND OTP
// // ======================================
// const resendOTP = async (req, res) => {
//     try {
//         const { phone } = req.body;

//         if (!phone) {
//             return res.status(400).json({
//                 message: "Phone number is required"
//             });
//         }

//         // Find user
//         const user = await User.findOne({ phone });

//         if (!user) {
//             return res.status(404).json({
//                 message: "User not found"
//             });
//         }

//         // Check verified
//         if (user.isPhoneVerified) {
//             return res.status(400).json({
//                 message: "Phone already verified"
//             });
//         }

//         // Generate new OTP
//         const otp = generateOTP();

//         user.otp = otp;

//         user.otpExpiresAt = new Date(
//             Date.now() + 5 * 60 * 1000
//         );

//         await user.save();

//         // Send new OTP
//         const otpResponse = await sendOTP(phone, otp);

//         console.log("2Factor Response:", otpResponse);

//         return res.status(200).json({
//             message: "New OTP sent successfully"
//         });

//     } catch (error) {
//         console.error("Resend OTP Error:", error);

//         return res.status(500).json({
//             message: "Server error"
//         });
//     }
// };


// // ======================================
// // LOGIN
// // ======================================
// const login = async (req, res) => {
//     try {
//         const { phone, password } = req.body;

//         if (!phone || !password) {
//             return res.status(400).json({
//                 message: "Phone and password are required"
//             });
//         }

//         // Find user
//         const user = await User.findOne({
//             phone,
//             role: "user"
//         });

//         if (!user) {
//             return res.status(400).json({
//                 message: "User not found"
//             });
//         }

//         // Check phone verification
//         if (!user.isPhoneVerified) {
//             return res.status(403).json({
//                 message: "Please verify your phone number first"
//             });
//         }

//         // Check password
//         const isPasswordCorrect = await bcrypt.compare(
//             password,
//             user.password
//         );

//         if (!isPasswordCorrect) {
//             return res.status(400).json({
//                 message: "Invalid password"
//             });
//         }

//         // Create JWT
//         const token = jwt.sign(
//             {
//                 id: user._id,
//                 role: user.role
//             },
//             process.env.JWT_SECRET,
//             {
//                 expiresIn: "6h"
//             }
//         );

//         // Set cookie
//         res.cookie("token", token, {
//             httpOnly: true,

//             sameSite:
//                 process.env.NODE_ENV === "production"
//                     ? "none"
//                     : "strict",

//             secure:
//                 process.env.NODE_ENV === "production",

//             maxAge: 6 * 60 * 60 * 1000
//         });

//         return res.status(200).json({
//             message: "User logged in successfully",

//             user: {
//                 id: user._id,
//                 name: user.name,
//                 phone: user.phone,
//                 role: user.role,
//                 isPhoneVerified: user.isPhoneVerified
//             }
//         });

//     } catch (error) {
//         console.error("Login Error:", error);

//         return res.status(500).json({
//             message: "Server error"
//         });
//     }
// };


// // ======================================
// // CHECK AUTH
// // ======================================
// const isAuth = async (req, res) => {
//     try {
//         const { id } = req.user;

//         const user = await User.findById(id)
//             .select("-password -otp -otpExpiresAt");

//         if (!user) {
//             return res.status(404).json({
//                 message: "User not found"
//             });
//         }

//         return res.status(200).json({
//             user
//         });

//     } catch (error) {
//         console.error("isAuth Error:", error);

//         return res.status(500).json({
//             message: "Server error"
//         });
//     }
// };


// // ======================================
// // LOGOUT
// // ======================================
// const logout = async (req, res) => {
//     try {
//         res.clearCookie("token", {
//             httpOnly: true,

//             sameSite:
//                 process.env.NODE_ENV === "production"
//                     ? "none"
//                     : "strict",

//             secure:
//                 process.env.NODE_ENV === "production"
//         });

//         return res.status(200).json({
//             message: "User logged out successfully"
//         });

//     } catch (error) {
//         console.error("Logout Error:", error);

//         return res.status(500).json({
//             message: "Server error"
//         });
//     }
// };


// const updateUserLocation = async (req, res) => {
//     try {
//         const { latitude, longitude } = req.body;

//         if (
//             latitude === undefined ||
//             longitude === undefined
//         ) {
//             return res.status(400).json({
//                 message: "Latitude and longitude are required"
//             });
//         }

//         const user = await User.findById(req.user.id);

//         if (!user) {
//             return res.status(404).json({
//                 message: "User not found"
//             });
//         }

//         user.location = {
//             latitude: Number(latitude),
//             longitude: Number(longitude)
//         };

//         await user.save();

//         res.status(200).json({
//             message: "Location updated successfully",
//             location: user.location
//         });

//     } catch (error) {
//         console.error(
//             "Update User Location Error:",
//             error
//         );

//         res.status(500).json({
//             message: "Server error"
//         });
//     }
// };



// module.exports = {
//     register,
//     verifyOTP,
//     resendOTP,
//     login,
//     isAuth,
//     logout,
//     updateUserLocation
// };




















const User = require("../model/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const generateOTP = require("../utils/generateOtp");
const sendOTP = require("../utils/sendOtp");

// ======================================
// REGISTER
// ======================================
const register = async (req, res) => {
  try {
    const { name, phone, password } = req.body;

    if (!name || !phone || !password) {
      return res.status(400).json({
        message: "Name, phone and password are required"
      });
    }

    const existingUser = await User.findOne({ phone });

    if (existingUser) {
      if (existingUser.isPhoneVerified) {
        return res.status(400).json({
          message: "User already exists"
        });
      }

      const otp = generateOTP();
      existingUser.otp = otp;
      existingUser.otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);
      await existingUser.save();

      await sendOTP(phone, otp);

      return res.status(200).json({
        message: "OTP sent again. Please verify your phone"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOTP();
    const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);

    const user = await User.create({
      name,
      phone,
      password: hashedPassword,
      role: "user",
      isPhoneVerified: false,
      otp,
      otpExpiresAt
    });

    const otpResponse = await sendOTP(phone, otp);
    console.log("2Factor Response:", otpResponse);

    return res.status(201).json({
      message: "User registered. OTP sent to your phone",
      userId: user._id
    });
  } catch (error) {
    console.error("Register Error:", error);
    return res.status(500).json({
      message: "Server error"
    });
  }
};

// ======================================
// VERIFY OTP
// ======================================
const verifyOTP = async (req, res) => {
  try {
    const { phone, otp } = req.body;

    if (!phone || !otp) {
      return res.status(400).json({
        message: "Phone and OTP are required"
      });
    }

    const user = await User.findOne({ phone });

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    if (user.isPhoneVerified) {
      return res.status(400).json({
        message: "Phone already verified"
      });
    }

    if (!user.otpExpiresAt || user.otpExpiresAt < new Date()) {
      return res.status(400).json({
        message: "OTP expired. Please request a new OTP"
      });
    }

    if (user.otp !== otp) {
      return res.status(400).json({
        message: "Invalid OTP"
      });
    }

    user.isPhoneVerified = true;
    user.otp = undefined;
    user.otpExpiresAt = undefined;
    await user.save();

    // Create JWT
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d"
      }
    );

    // Set Cookie
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    // রেসপন্সে token পাঠানো হচ্ছে যাতে frontend localStorage-এ সেভ করতে পারে
    return res.status(200).json({
      message: "Phone verified successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        role: user.role,
        isPhoneVerified: user.isPhoneVerified
      }
    });
  } catch (error) {
    console.error("Verify OTP Error:", error);
    return res.status(500).json({
      message: "Server error"
    });
  }
};

// ======================================
// RESEND OTP
// ======================================
const resendOTP = async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({
        message: "Phone number is required"
      });
    }

    const user = await User.findOne({ phone });

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    if (user.isPhoneVerified) {
      return res.status(400).json({
        message: "Phone already verified"
      });
    }

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);
    await user.save();

    const otpResponse = await sendOTP(phone, otp);
    console.log("2Factor Response:", otpResponse);

    return res.status(200).json({
      message: "New OTP sent successfully"
    });
  } catch (error) {
    console.error("Resend OTP Error:", error);
    return res.status(500).json({
      message: "Server error"
    });
  }
};

// ======================================
// LOGIN
// ======================================
const login = async (req, res) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({
        message: "Phone and password are required"
      });
    }

    const user = await User.findOne({
      phone,
      role: "user"
    });

    if (!user) {
      return res.status(400).json({
        message: "User not found"
      });
    }

    if (!user.isPhoneVerified) {
      return res.status(403).json({
        message: "Please verify your phone number first"
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(400).json({
        message: "Invalid password"
      });
    }

    // Create JWT
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d"
      }
    );

    // Set Cookie
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    // রেসপন্সে token পাঠানো হচ্ছে
    return res.status(200).json({
      message: "User logged in successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        role: user.role,
        isPhoneVerified: user.isPhoneVerified
      }
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({
      message: "Server error"
    });
  }
};

// ======================================
// CHECK AUTH
// ======================================
const isAuth = async (req, res) => {
  try {
    const { id } = req.user;

    const user = await User.findById(id).select("-password -otp -otpExpiresAt");

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    return res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    console.error("isAuth Error:", error);
    return res.status(500).json({
      message: "Server error"
    });
  }
};

// ======================================
// LOGOUT
// ======================================
const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production"
    });

    return res.status(200).json({
      message: "User logged out successfully"
    });
  } catch (error) {
    console.error("Logout Error:", error);
    return res.status(500).json({
      message: "Server error"
    });
  }
};

// ======================================
// UPDATE LOCATION
// ======================================
const updateUserLocation = async (req, res) => {
  try {
    const { latitude, longitude } = req.body;

    if (latitude === undefined || longitude === undefined) {
      return res.status(400).json({
        message: "Latitude and longitude are required"
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    user.location = {
      latitude: Number(latitude),
      longitude: Number(longitude)
    };

    await user.save();

    return res.status(200).json({
      message: "Location updated successfully",
      location: user.location
    });
  } catch (error) {
    console.error("Update User Location Error:", error);
    return res.status(500).json({
      message: "Server error"
    });
  }
};

module.exports = {
  register,
  verifyOTP,
  resendOTP,
  login,
  isAuth,
  logout,
  updateUserLocation
};