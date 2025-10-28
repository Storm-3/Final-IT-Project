const db = require("../../models");

const authRoles = (...allowedRoles) => {
  return async (req, res, next) => {
    try {
      console.log('authRoles req.user:', req.user);
      const userId = req.user.id || req.user.userId;

      if (!userId) {
        return res.status(401).json({ error: "Missing user ID in token." });
      }

      // Fetch user with role association
      const user = await db.Users.findByPk(userId, {
        include: db.UserRoles
      });

      if (!user) {
        return res.status(401).json({ error: "User not found." });
      }

      const userRole = user.UserRole?.role_name;
      if (!userRole || !allowedRoles.includes(userRole)) {
        return res.status(403).json({ error: "Access denied: insufficient permissions." });
      }

      next();
    } catch (err) {
      return res.status(500).json({ error: "Authorization error", details: err.message });
    }
  };
};

module.exports = authRoles;

