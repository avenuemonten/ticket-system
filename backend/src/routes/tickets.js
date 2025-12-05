const express = require('express');
const {
  getAllTickets,
  getTicketById,
  createTicket,
  updateTicket,
  deleteTicket,
} = require('../models/ticketModel');

const router = express.Router();

// GET /api/tickets
router.get('/', async (req, res) => {
  try {
    const tickets = await getAllTickets();
    res.json(tickets);
  } catch (err) {
    console.error('Error getting tickets:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET /api/tickets/:id
router.get('/:id', async (req, res) => {
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

// POST /api/tickets
router.post('/', async (req, res) => {
  try {
    const { title, description, priority } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const newTicket = await createTicket({ title, description, priority });
    res.status(201).json(newTicket);
  } catch (err) {
    console.error('Error creating ticket:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// PUT /api/tickets/:id
router.put('/:id', async (req, res) => {
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

// DELETE /api/tickets/:id
router.delete('/:id', async (req, res) => {
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
