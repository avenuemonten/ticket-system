import { useState } from 'react';

export function TicketForm({ onCreate }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    try {
      await onCreate({ title, description, priority });
      setTitle('');
      setDescription('');
      setPriority('medium');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="ticket-form" onSubmit={handleSubmit}>
      <h2>Создать тикет</h2>

      <input
        type="text"
        placeholder="Заголовок тикета"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        placeholder="Описание проблемы"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <div className="ticket-form-row">
        <label>
          Приоритет:{' '}
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="low">low</option>
            <option value="medium">medium</option>
            <option value="high">high</option>
          </select>
        </label>

        <button type="submit" disabled={loading}>
          {loading ? 'Создаю...' : 'Создать'}
        </button>
      </div>
    </form>
  );
}