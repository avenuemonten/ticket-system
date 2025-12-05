const API_BASE_URL = 'http://localhost:3000/api';

export async function fetchTickets() {
  const res = await fetch(`${API_BASE_URL}/tickets`);
  if (!res.ok) throw new Error('Failed to load tickets');
  return res.json();
}

export async function createTicket(data) {
  const res = await fetch(`${API_BASE_URL}/tickets`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create ticket');
  return res.json();
}

export async function updateTicket(id, data) {
  const res = await fetch(`${API_BASE_URL}/tickets/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update ticket');
  return res.json();
}

export async function deleteTicket(id) {
  const res = await fetch(`${API_BASE_URL}/tickets/${id}`, {
    method: 'DELETE',
  });

  // backend возвращает 204 No Content
  if (!res.ok && res.status !== 204) {
    throw new Error('Failed to delete ticket');
  }
}