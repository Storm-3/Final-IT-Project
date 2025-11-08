const { request } = require('express');
const db = require('../models');
const UserRoles = db.UserRoles;
const Users = db.Users;
const bcrypt = require('bcrypt');


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

exports.AddUserWithRole = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      password,
      role = 'counsellor', // default to counsellor if not specified
      resource_id = null,
      status = 'pending',
      isEmailVerified = false
    } = req.body;

    const existingUser = await Users.findOne({ where: { email } });
    if (existingUser)
      return res.status(400).json({ error: 'User with this email already exists.' });

    const roleRecord = await UserRoles.findOne({ where: { role_name: role } });
    if (!roleRecord)
      return res.status(500).json({ error: `Role '${role}' not found.` });

    const rawPassword = password || require('crypto').randomBytes(8).toString('hex');
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(rawPassword, saltRounds);

    const verificationToken = require('crypto').randomBytes(32).toString('hex');

    const newUser = await Users.create({
      name,
      email,
      password: hashedPassword,
      phone,
      role_id: roleRecord.id,
      resource_id,
      status,
      isEmailVerified,
      verificationToken,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    //sendEmailVerification(email, verificationToken); ----uncomment when not testing.

    res.status(201).json({
      message: `${role.charAt(0).toUpperCase() + role.slice(1)} added. Verification email sent.`,
      user: newUser
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add user', details: err.message });
  }
};



