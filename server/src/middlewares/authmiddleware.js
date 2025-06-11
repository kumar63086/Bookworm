const jwt = require("jsonwebtoken");
const User = require("../model/User.model");
const authMiddleware = async (req, res, next) => {
  try {
    // Extract the token from the header
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // finde user
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(401).json({ message: "Invalid token" });
    }
    req.user = user;
    next();
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Server error" });
  }
};
module.exports=authMiddleware