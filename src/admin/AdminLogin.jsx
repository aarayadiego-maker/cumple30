import { useState } from "react";

export default function AdminLogin({ onLogin, error }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [enviando, setEnviando] = useState(false);

  async function manejarSubmit(e) {
    e.preventDefault();
    setEnviando(true);
    await onLogin(email, password);
    setEnviando(false);
  }

  return (
    <div className="admin-body">
      <div className="admin-login-box">
        <h2>Panel privado</h2>
        <p className="apoyo">Solo para el dueño de casa.</p>
        {error && <p className="error">{error}</p>}
        <form onSubmit={manejarSubmit}>
          <input
            type="email"
            className="input-text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoFocus
          />
          <input
            type="password"
            className="input-text"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="btn btn-primary" disabled={enviando}>
            {enviando ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
