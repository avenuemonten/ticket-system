export function TicketList({ tickets, onDelete, onStatusChange }) {
  if (!tickets.length) {
    return <p>Пока нет тикетов 👀</p>;
  }

  return (
    <div className="ticket-list">
      {tickets.map((t) => (
        <div key={t.id} className="ticket-card">
          <div className="ticket-header">
            <h3>
              #{t.id} — {t.title}
            </h3>
            <span className={`status status-${t.status}`}>{t.status}</span>
          </div>

          <p className="ticket-description">{t.description}</p>

          <div className="ticket-footer">
            <span className={`priority priority-${t.priority}`}>
              {t.priority}
            </span>
            <span className="created-at">
              {t.created_at
                ? new Date(t.created_at).toLocaleString()
                : '—'}
            </span>
          </div>

          <div className="ticket-actions">
            <select
              value={t.status}
              onChange={(e) => onStatusChange(t.id, e.target.value)}
            >
              <option value="open">open</option>
              <option value="in_progress">in_progress</option>
              <option value="closed">closed</option>
            </select>
            <button onClick={() => onDelete(t.id)}>Удалить</button>
          </div>
        </div>
      ))}
    </div>
  );
}