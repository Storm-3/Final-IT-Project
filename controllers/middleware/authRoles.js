const db = require('../models');

const authorizeRoles = (...allowedRoles) => {
  return async (req, res, next) => {
    try {
      const userId = req.user.id; // assuming user ID is in req.user from auth middleware
      const user = await db.Users.findByPk(userId, { include: db.UserRoles });
      if (!user) return res.status(401).json({ error: 'User not found' });

      const userRole = user.UserRole.role_name; // adjust based on your associations
      if (!allowedRoles.includes(userRole)) {
        return res.status(403).json({ error: 'Access denied: insufficient permissions' });
      }
      next();
    } catch (err) {
      res.status(500).json({ error: 'Authorization error', details: err.message });
    }
  };
};

module.exports = authorizeRoles;
