const pool = require('../config/db');

async function getUserByUsername(username) {
  const [rows] = await pool.query(
    'SELECT * FROM users WHERE username = ?',
    [username]
  );
  return rows[0] || null;
}

async function getUserById(id) {
  const [rows] = await pool.query(
    'SELECT * FROM users WHERE id = ?',
    [id]
  );
  return rows[0] || null;
}

module.exports = {
  getUserByUsername,
  getUserById,
};