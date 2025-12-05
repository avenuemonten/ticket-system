export function TicketList({ tickets, canManage = false, onStatusChange, onDelete }) {
  function formatDate(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  function getStatusClass(status) {
    if (status === 'open') return 'status status-open';
    if (status === 'in_progress') return 'status status-in_progress';
    if (status === 'closed') return 'status status-closed';
    return 'status';
  }

  function getStatusLabel(status) {
    if (status === 'open') return 'открыт';
    if (status === 'in_progress') return 'в работе';
    if (status === 'closed') return 'закрыт';
    return status || 'неизвестно';
  }

  function getPriorityClass(priority) {
    if (priority === 'low') return 'priority priority-low';
    if (priority === 'high') return 'priority priority-high';
    return 'priority priority-medium';
  }

  function getPriorityLabel(priority) {
    if (priority === 'low') return 'LOW';
    if (priority === 'high') return 'HIGH';
    return 'MEDIUM';
  }

  return (
    <div className="ticket-list">
      {tickets.map((ticket) => (
        <article key={ticket.id} className="ticket-card">
          <header className="ticket-header">
            <h3>
              #{ticket.id} — {ticket.title}
            </h3>
            <span className={getStatusClass(ticket.status)}>
              {getStatusLabel(ticket.status)}
            </span>
          </header>

          {ticket.description && (
            <p className="ticket-description">{ticket.description}</p>
          )}

          <p className="ticket-meta">
            <span>
              Автор:{' '}
              <strong>{ticket.created_by_name || 'неизвестно'}</strong>
            </span>
            {ticket.created_by_department && (
              <span className="ticket-meta-dept">
                ({ticket.created_by_department})
              </span>
            )}
          </p>

          <footer className="ticket-footer">
            <span className={getPriorityClass(ticket.priority)}>
              {getPriorityLabel(ticket.priority)}
            </span>
            <span>{formatDate(ticket.created_at)}</span>
          </footer>

          {/* действия только для админа */}
          {canManage && (onStatusChange || onDelete) && (
            <div className="ticket-actions">
              {onStatusChange && (
                <select
                  defaultValue={ticket.status}
                  onChange={(e) =>
                    onStatusChange(ticket.id, e.target.value)
                  }
                >
                  <option value="open">открыт</option>
                  <option value="in_progress">в работе</option>
                  <option value="closed">закрыт</option>
                </select>
              )}

              {onDelete && (
                <button onClick={() => onDelete(ticket.id)}>Удалить</button>
              )}
            </div>
          )}
        </article>
      ))}
    </div>
  );
}
