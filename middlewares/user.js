const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.userAuth = (req, res, next) => {
  try {
    // Get token from: headers, cookies, or authorization Bearer token
    const token =
      req.headers.token ||
      req.cookies?.userToken ||
      (req.headers.authorization?.startsWith("Bearer ")
        ? req.headers.authorization.split(" ")[1]
        : null);

    // Token missing
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided. Please login.",
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_USER_PASSWORD);

    // Attach user data to request
    req.userId = decoded.id;
    req.userEmail = decoded.email;

    next(); // Continue to protected route
  } catch (error) {
    console.error("Auth Middleware Error:", error.message);

    // Different types of JWT errors
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Session expired. Please login again.",
      });
    }

    return res.status(403).json({
      success: false,
      message: "Invalid or unauthorized token",
    });
  }
};
