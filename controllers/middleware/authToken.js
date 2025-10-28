const jwt = require('jsonwebtoken');

const authToken = (req, res, next) => {
  console.log("Incoming headers:", req.headers);
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Missing or invalid token." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 🔍 Add this line to inspect the decoded payload
    console.log("authToken decoded payload:", decoded);

    req.user = decoded; // attach user info to request
    next();
  } catch (err) {
    return res.status(403).json({ message: "Token is invalid or expired." });
  }
};

module.exports = authToken;
