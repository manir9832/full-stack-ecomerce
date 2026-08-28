
// const jwt = require("jsonwebtoken");

// const deliveryBoyAuth = async (req, res, next) => {
//   try {
//     const token = req.cookies.deliveryBoyToken;

//     if (!token) {
//       return res.status(401).json({
//         message: "Not authenticated",
//       });
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET); // Check role

//     if (decoded.role !== "deliveryBoy") {
//       return res.status(403).json({
//         message: "Access denied",
//       });
//     } // Save decoded data

//     req.deliveryBoy = decoded;

//     next();
//   } catch (error) {
//     console.error("Delivery Boy Auth Error:", error);

//     return res.status(401).json({
//       message: "Invalid or expired token",
//     });
//   }
// };

// module.exports = deliveryBoyAuth;


















const jwt = require("jsonwebtoken");

const deliveryBoyAuth = async (req, res, next) => {
  try {
    let token = req.cookies?.deliveryBoyToken;

    // Bearer Token হেডার চেক
    if (!token && req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "deliveryBoy") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    req.deliveryBoy = decoded;
    next();
  } catch (error) {
    console.error("Delivery Boy Auth Error:", error.message);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

module.exports = deliveryBoyAuth;
