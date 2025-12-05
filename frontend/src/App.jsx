import { useEffect, useState } from 'react';
import {
  fetchMyTickets,
  fetchAllTickets,
  createTicket,
  updateTicket,
  deleteTicket,
} from './api/ticketsApi';
import { login as apiLogin } from './api/authApi';
import { TicketList } from './components/TicketList';
import { TicketForm } from './components/TicketForm';
import { LoginPage } from './components/LoginPage';
import './App.css';

function App() {
  const [tickets, setTickets] = useState([]);
  const [loadingTickets, setLoadingTickets] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [user, setUser] = useState(null);

  const isAdmin = user?.role === 'admin';

  function loadUserFromStorage() {
    try {
      const storedUser = localStorage.getItem('ticket_user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (e) {
      console.error('Failed to parse stored user', e);
    }
  }

  async function loadTickets() {
    if (!user) return;
    try {
      setLoadingTickets(true);
      const data = isAdmin ? await fetchAllTickets() : await fetchMyTickets();
      setTickets(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingTickets(false);
    }
  }

  useEffect(() => {
    loadUserFromStorage();
  }, []);

  useEffect(() => {
    if (user) {
      loadTickets();
    } else {
      setTickets([]);
    }
  }, [user]);

  async function handleLogin(username, password) {
    try {
      setAuthLoading(true);
      setAuthError('');
      const { token, user: userPayload } = await apiLogin(username, password);

      localStorage.setItem('ticket_token', token);
      localStorage.setItem('ticket_user', JSON.stringify(userPayload));
      setUser(userPayload);
    } catch (err) {
      console.error(err);
      setAuthError(err.message || 'Ошибка авторизации');
    } finally {
      setAuthLoading(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem('ticket_token');
    localStorage.removeItem('ticket_user');
    setUser(null);
  }

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

  // Если не авторизован — показываем логин
  if (!user) {
    return (
      <LoginPage onLogin={handleLogin} loading={authLoading} error={authError} />
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-logo-dot" />
        <div>
          <h1>СТНГ Helpdesk</h1>
          <p>
            Внутренняя система помощи пользователем ·{' '}
            <span style={{ color: '#9ca3af', fontSize: 13 }}>
              {user.displayName} ({user.department || 'отдел не указан'}) —{' '}
              {isAdmin ? 'администратор' : 'пользователь'}
            </span>
          </p>
        </div>
        <div style={{ marginLeft: 'auto', fontSize: 12 }}>
          <button
            onClick={handleLogout}
            style={{
              padding: '6px 12px',
              borderRadius: 999,
              border: '1px solid rgba(148,163,184,0.6)',
              background: 'transparent',
              color: '#e5e7eb',
              cursor: 'pointer',
            }}
          >
            Выйти
          </button>
        </div>
      </header>

      <main className="app-main">
        <div className="main-layout">
          <section className="panel">
            <TicketForm onCreate={handleCreateTicket} />
          </section>

          <section className="panel">
            <div className="panel-header">
              <h2>{isAdmin ? 'Все тикеты' : 'Мои тикеты'}</h2>
              <span className="badge badge-muted">
                всего: {tickets.length}
              </span>
            </div>

            {loadingTickets && <p className="muted">Загружаю тикеты…</p>}

            {!loadingTickets && tickets.length === 0 && (
              <p className="muted">Пока нет тикетов 👀</p>
            )}

            {!loadingTickets && tickets.length > 0 && (
              <TicketList
                tickets={tickets}
                canManage={isAdmin}
                onDelete={isAdmin ? handleDelete : null}
                onStatusChange={isAdmin ? handleStatusChange : null}
              />
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

export default App;
