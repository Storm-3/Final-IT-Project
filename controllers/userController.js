const bcrypt = require('bcrypt');
const crypto = require('crypto');
const db = require('../models');
const Users = db.Users;
const ResourceDirectories = db.ResourceDirectories;
//const { validateUserFields } = require('../models/User');
const { sendEmail } = require('./middleware/emailVer'); // use existing email module
const jwt = require('jsonwebtoken');

const secretKey = process.env.JWT_SECRET || 'yourSecretKey';

exports.CreateAvgUser = async (req, res) => {
  try {
    const userData = { ...req.body };

    // Default role: survivor
    userData.role_id = 1;

    // Handle anonymous fallback
    if (userData.is_anonymous === undefined || userData.is_anonymous === true) {
      userData.is_anonymous = true;
      if (!userData.name) userData.name = `Guest_${Date.now()}`;
    } else {
      userData.is_anonymous = false;
    }

    // Hash password
    if (userData.password) {
      userData.password = await bcrypt.hash(userData.password, 10);
    }

    // Create verification token if email provided
    if (userData.email) {
      const token = crypto.randomBytes(20).toString('hex');
      userData.verificationToken = token;
    }

    const newUser = await Users.create(userData);

    // Send verification email
    if (newUser.email && newUser.verificationToken) {
      const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${newUser.verificationToken}`;
      const html = `<p>Please verify your email by clicking <a href="${verificationUrl}">here</a>.</p>`;
      try {
        await sendEmail(newUser.email, 'Verify Your Email', html);
      } catch (emailErr) {
        console.warn('Failed sending verification email:', emailErr.message || emailErr);
      }
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: newUser.id, role_id: newUser.role_id },
      secretKey,
      { expiresIn: '1h' }
    );

    return res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        is_anonymous: newUser.is_anonymous,
        role_id: newUser.role_id
      }
    });
  } catch (error) {
    console.error('Error creating user:', error);
    return res.status(400).json({ error: error.message });
  }
};

exports.GetAllUsers = async (req, res) => {
  try {
    const role_id = req.query.role_id ? parseInt(req.query.role_id, 10) : undefined;
    const where = role_id ? { role_id } : {};

    const users = await Users.findAll({
      include: [{ model: ResourceDirectories }],
      where,
      attributes: { exclude: ['password'] },
    });
    return res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

exports.GetUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await Users.findByPk(userId, {
      include: [{ model: ResourceDirectories }],
      attributes: { exclude: ['password'] }
    });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    return res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user by Id', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.UpdateUserById = async (req, res) => {
  try {
    const userId = req.params.id;

    if (!req.body || typeof req.body !== 'object') {
      return res.status(400).json({ error: 'Missing or invalid request body' });
    }

    const allowedFields = ['name', 'email', 'phone', 'password', 'is_anonymous', 'resource_id'];
    const updates = {};

    for (let key of allowedFields) {
      if (req.body[key] !== undefined) {
        updates[key] = req.body[key];
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: 'No valid fields provided for update' });
    }

    const user = await Users.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Hash password if it's being updated
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }

    await user.update(updates, { validate: true });

    const safeUser = user.toJSON();
    delete safeUser.password;

    return res.status(200).json({
      message: 'User updated successfully',
      user: safeUser,
    });
  } catch (error) {
    console.error('Error updating user:', error.message);
    console.error(error.stack);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

exports.DeleteUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await Users.findByPk(userId);

    if (!user) {
      return res.status(404).json({ error: 'User Not Found' });
    } else {
      await user.destroy();
      return res.status(200).json({ message: 'User deleted successfully.' });
    }
  } catch (error) {
    console.error('Error deleting user.', error);
    return res.status(500).json({ error: 'Internal Server Error.' });
  }
};