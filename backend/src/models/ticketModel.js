const pool = require('../config/db');

async function getAllTickets() {
  const [rows] = await pool.query(
    `SELECT t.*, u.display_name AS created_by_name, u.department AS created_by_department
     FROM tickets t
     LEFT JOIN users u ON t.created_by = u.id
     ORDER BY t.created_at DESC`
  );
  return rows;
}

async function getTicketsByUser(userId) {
  const [rows] = await pool.query(
    `SELECT t.*, u.display_name AS created_by_name, u.department AS created_by_department
     FROM tickets t
     LEFT JOIN users u ON t.created_by = u.id
     WHERE t.created_by = ?
     ORDER BY t.created_at DESC`,
    [userId]
  );
  return rows;
}

async function getTicketById(id) {
  const [rows] = await pool.query(
    `SELECT t.*, u.display_name AS created_by_name, u.department AS created_by_department
     FROM tickets t
     LEFT JOIN users u ON t.created_by = u.id
     WHERE t.id = ?`,
    [id]
  );
  return rows[0] || null;
}

async function createTicket({ title, description, priority, createdBy }) {
  const [result] = await pool.query(
    'INSERT INTO tickets (title, description, priority, created_by) VALUES (?, ?, ?, ?)',
    [title, description || '', priority || 'medium', createdBy]
  );
  return getTicketById(result.insertId);
}

async function updateTicket(id, { title, description, status, priority }) {
  await pool.query(
    `UPDATE tickets
     SET title = ?, description = ?, status = ?, priority = ?
     WHERE id = ?`,
    [title, description, status, priority, id]
  );
  return getTicketById(id);
}

async function deleteTicket(id) {
  const [result] = await pool.query(
    'DELETE FROM tickets WHERE id = ?',
    [id]
  );
  return result.affectedRows > 0;
}

module.exports = {
  getAllTickets,
  getTicketsByUser,
  getTicketById,
  createTicket,
  updateTicket,
  deleteTicket,
};
