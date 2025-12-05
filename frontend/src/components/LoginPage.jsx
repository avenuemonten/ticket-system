import { useState } from 'react';

export function LoginPage({ onLogin, loading, error }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (!username) return;
    onLogin(username.trim(), password);
  }

  return (
    <div className="login-wrapper">
      <div className="login-card panel">
        <div className="login-header">
          <div className="app-logo-dot" />
          <div>
            <h1>Ticket System</h1>
            <p>Внутренняя система заявок</p>
          </div>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <label className="login-label">
            Логин домена
            <input
              type="text"
              placeholder="например, zabolotskiy_ds"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </label>

          <label className="login-label">
            Пароль
            <input
              type="password"
              placeholder="пароль от Windows"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>

          {error && <p className="error login-error">{error}</p>}

          <button type="submit" disabled={loading}>
            {loading ? 'Входим…' : 'Войти'}
          </button>

          <p className="login-hint">
            Сейчас пароль не проверяется (dev-режим). <br />
            Введи <b>admin</b> или <b>user1</b> в качестве логина.
          </p>
        </form>
      </div>
    </div>
  );
}