const express = require('express');
const {
  getAllTickets,
  getTicketsByUser,
  getTicketById,
  createTicket,
  updateTicket,
  deleteTicket,
} = require('../models/ticketModel');
const auth = require('../middleware/auth');

const router = express.Router();

// 🔹 Все тикеты — только для админа
router.get('/', auth('admin'), async (req, res) => {
  try {
    const tickets = await getAllTickets();
    res.json(tickets);
  } catch (err) {
    console.error('Error getting tickets:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// 🔹 Мои тикеты — любой авторизованный
router.get('/my', auth(), async (req, res) => {
  try {
    const tickets = await getTicketsByUser(req.user.userId);
    res.json(tickets);
  } catch (err) {
    console.error('Error getting my tickets:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// 🔹 Один тикет — любой авторизованный
router.get('/:id', auth(), async (req, res) => {
  try {
    const ticket = await getTicketById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }
    res.json(ticket);
  } catch (err) {
    console.error('Error getting ticket:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// 🔹 Создать тикет — любой авторизованный
router.post('/', auth(), async (req, res) => {
  try {
    const { title, description, priority } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const newTicket = await createTicket({
      title,
      description,
      priority,
      createdBy: req.user.userId,
    });

    res.status(201).json(newTicket);
  } catch (err) {
    console.error('Error creating ticket:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// 🔹 Обновить тикет — только админ
router.put('/:id', auth('admin'), async (req, res) => {
  try {
    const existing = await getTicketById(req.params.id);
    if (!existing) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    const { title, description, status, priority } = req.body;

    const updated = await updateTicket(req.params.id, {
      title: title ?? existing.title,
      description: description ?? existing.description,
      status: status ?? existing.status,
      priority: priority ?? existing.priority,
    });

    res.json(updated);
  } catch (err) {
    console.error('Error updating ticket:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// 🔹 Удалить тикет — только админ
router.delete('/:id', auth('admin'), async (req, res) => {
  try {
    const deleted = await deleteTicket(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Ticket not found' });
    }
    res.status(204).send();
  } catch (err) {
    console.error('Error deleting ticket:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
