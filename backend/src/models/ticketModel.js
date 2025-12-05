const pool = require('../config/db');

async function getAllTickets() {
  const [rows] = await pool.query(
    'SELECT * FROM tickets ORDER BY created_at DESC'
  );
  return rows;
}

async function getTicketById(id) {
  const [rows] = await pool.query('SELECT * FROM tickets WHERE id = ?', [id]);
  return rows[0] || null;
}

async function createTicket({ title, description, priority }) {
  const [result] = await pool.query(
    'INSERT INTO tickets (title, description, priority) VALUES (?, ?, ?)',
    [title, description || '', priority || 'medium']
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
  const [result] = await pool.query('DELETE FROM tickets WHERE id = ?', [id]);
  return result.affectedRows > 0;
}

module.exports = {
  getAllTickets,
  getTicketById,
  createTicket,
  updateTicket,
  deleteTicket,
};
