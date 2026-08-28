

// const jwt = require("jsonwebtoken");

// const sellerAuth = async (req, res, next) => {
//   try {
//     const token = req.cookies.sellerToken;

//     if (!token) {
//       return res.status(401).json({
//         message: "Not authenticated",
//       });
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     if (decoded.role !== "seller") {
//       return res.status(403).json({
//         message: "Access denied",
//       });
//     }

//     req.seller = decoded;

//     next();
//   } catch (error) {
//     console.error(error);

//     res.status(401).json({
//       message: "Invalid or expired token",
//     });
//   }
// };

// module.exports = sellerAuth;












const jwt = require("jsonwebtoken");

const sellerAuth = async (req, res, next) => {
  try {
    // কুকি অথবা Authorization হেডার থেকে টোকেন নেওয়ার সেফ মেথড
    const token =
      req.cookies?.sellerToken ||
      (req.headers.authorization?.startsWith("Bearer ")
        ? req.headers.authorization.split(" ")[1]
        : null);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated. No token provided.",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "seller") {
      return res.status(403).json({
        success: false,
        message: "Access denied: Seller privileges required.",
      });
    }

    req.seller = decoded;
    next();
  } catch (error) {
    console.error("Seller Auth Middleware Error:", error.message);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

module.exports = sellerAuth;