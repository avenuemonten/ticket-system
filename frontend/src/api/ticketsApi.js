const API_BASE = 'http://localhost:3000';

function getAuthHeaders() {
  const token = localStorage.getItem('ticket_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// 🔹 Мои тикеты (для обычного пользователя)
export async function fetchMyTickets() {
  const res = await fetch(`${API_BASE}/api/tickets/my`, {
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch tickets');
  }

  return res.json();
}

// 🔹 Все тикеты (для админа)
export async function fetchAllTickets() {
  const res = await fetch(`${API_BASE}/api/tickets`, {
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch tickets');
  }

  return res.json();
}

export async function createTicket(ticket) {
  const res = await fetch(`${API_BASE}/api/tickets`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify(ticket),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to create ticket');
  }

  return res.json();
}

export async function updateTicket(id, ticket) {
  const res = await fetch(`${API_BASE}/api/tickets/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify(ticket),
  });

  if (!res.ok) {
    throw new Error('Failed to update ticket');
  }

  return res.json();
}

export async function deleteTicket(id) {
  const res = await fetch(`${API_BASE}/api/tickets/${id}`, {
    method: 'DELETE',
    headers: {
      ...getAuthHeaders(),
    },
  });

  if (!res.ok && res.status !== 204) {
    throw new Error('Failed to delete ticket');
  }
}
