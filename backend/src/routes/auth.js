const express = require('express');
const jwt = require('jsonwebtoken');
const { getUserByUsername } = require('../models/userModel');

const router = express.Router();

// ВРЕМЕННЫЙ ЛОГИН: только по username, пароль игнорируем
// user:  user1
// admin: admin
router.post('/login', async (req, res) => {
  const { username, password } = req.body; // пароль пока не используем

  if (!username) {
    return res.status(400).json({ message: 'Username is required' });
  }

  try {
    const user = await getUserByUsername(username);

    if (!user) {
      return res.status(401).json({ message: 'Пользователь не найден' });
    }

    const payload = {
      userId: user.id,
      username: user.username,
      role: user.role,
      displayName: user.display_name,
      department: user.department,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '8h',
    });

    res.json({ token, user: payload });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;