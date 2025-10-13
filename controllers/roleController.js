const db = require('../models');
const UserRoles = db.UserRoles;

exports.GetAllRoles = async (req, res) => {
  try {
    const roles = await UserRoles.findAll(); // assuming roles are stored in DB
    res.status(200).json(roles);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch roles', details: err.message });
  }
};

exports.GetRoleById = async (req, res) => {
  try {
    const role = await UserRoles.findByPk(req.params.id);
    if (!role) return res.status(404).json({ error: 'Role not found' });
    res.status(200).json(role);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch role', details: err.message });
  }
};

exports.AssignRoleToUser = async (req, res) => {
  try {
    const { userId, roleId } = req.body;
    const user = await db.Users.findByPk(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.role_id = roleId;
    await user.save();

    res.status(200).json({ message: 'Role assigned successfully', user });
  } catch (err) {
    res.status(500).json({ error: 'Failed to assign role', details: err.message });
  }
};


