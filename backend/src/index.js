const express = require('express');
const cors = require('cors');
require('dotenv').config();

const ticketsRouter = require('./routes/tickets');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// health-check
app.get('/', (req, res) => {
  res.send('Ticket API работает');
});

// маршруты тикетов
app.use('/api/tickets', ticketsRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
