
// const jwt = require("jsonwebtoken");
// const userAuth = async (req, res, next) => {
//   try {
//     const token = req.cookies.token;
//     if (!token) {
//       return res
//         .status(401)
//         .json({ message: "Access denied, no token provided" });
//     }
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded;
//     next();
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error" });
//   }
// };
// module.exports = userAuth;
















const jwt = require("jsonwebtoken");

const userAuth = async (req, res, next) => {
  try {
    // ১. কুকি অথবা Authorization হেডার (Bearer Token) উভয় জায়গা থেকে টোকেন চেক করা
    let token = req.cookies?.token;

    if (!token && req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "Access denied, no token provided" });
    }

    // ২. টোকেন ভেরিফাই করা
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = userAuth;