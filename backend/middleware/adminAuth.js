

const jwt = require("jsonwebtoken");

const adminAuth = async (req, res, next) => {
  try {
    // Get token from cookie
    const token = req.cookies.adminToken;

    if (!token) {
      return res.status(401).json({
        message: "Admin authentication required",
      });
    } // Verify JWT

    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Check role

    if (decoded.role !== "admin") {
      return res.status(403).json({
        message: "Admin access denied",
      });
    } // Store admin information

    req.admin = {
      id: decoded.id,
      role: decoded.role,
    };

    next();
  } catch (error) {
    console.error("Admin Auth Error:", error);

    return res.status(401).json({
      message: "Invalid or expired admin token",
    });
  }
};

module.exports = adminAuth;
