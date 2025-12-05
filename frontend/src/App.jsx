import { useEffect, useState } from 'react';
import {
  fetchTickets,
  createTicket,
  updateTicket,
  deleteTicket,
} from './api/ticketsApi';
import { TicketList } from './components/TicketList';
import { TicketForm } from './components/TicketForm';
import './App.css';

function App() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function loadTickets() {
    try {
      setLoading(true);
      setError('');
      const data = await fetchTickets();
      setTickets(data);
    } catch (err) {
      console.error(err);
      setError('Не удалось загрузить тикеты');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTickets();
  }, []);

  async function handleCreateTicket(data) {
    try {
      const created = await createTicket(data);
      setTickets((prev) => [created, ...prev]);
    } catch (err) {
      console.error(err);
      alert('Ошибка при создании тикета');
    }
  }

  async function handleStatusChange(id, status) {
    try {
      const ticket = tickets.find((t) => t.id === id);
      const updated = await updateTicket(id, { ...ticket, status });
      setTickets((prev) => prev.map((t) => (t.id === id ? updated : t)));
    } catch (err) {
      console.error(err);
      alert('Ошибка при обновлении статуса');
    }
  }

  async function handleDelete(id) {
    if (!confirm(`Удалить тикет #${id}?`)) return;
    try {
      await deleteTicket(id);
      setTickets((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.error(err);
      alert('Ошибка при удалении тикета');
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-logo-dot" />
        <div>
          <h1>Ticket System</h1>
          <p>Лёгкая внутренняя система заявок за 1 день</p>
        </div>
      </header>

      <main className="app-main">
        <div className="main-layout">
          <section className="panel">
            <TicketForm onCreate={handleCreateTicket} />
          </section>

          <section className="panel">
            <div className="panel-header">
              <h2>Тикеты</h2>
              <span className="badge badge-muted">
                всего: {tickets.length}
              </span>
            </div>

            {loading && <p className="muted">Загружаю тикеты…</p>}
            {error && <p className="error">{error}</p>}

            {!loading && !error && (
              <TicketList
                tickets={tickets}
                onDelete={handleDelete}
                onStatusChange={handleStatusChange}
              />
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

export default App;