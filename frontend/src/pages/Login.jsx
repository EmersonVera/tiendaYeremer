import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login({ username, password });
      navigate('/');
    } catch {
      setError('Usuario o contraseña incorrectos.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="paper-texture min-h-screen flex flex-col items-center justify-center font-body-md text-body-md px-gutter">
      <div className="mb-xl text-center flex flex-col items-center">
        <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center mb-md shadow-sm">
          <span className="material-symbols-outlined text-white text-[32px]">storefront</span>
        </div>
        <h1 className="font-display-md-mobile text-display-md-mobile md:font-display-md md:text-display-md text-primary tracking-tight">
          Tienda Yeremer
        </h1>
        <p className="text-on-surface-variant font-body-md mt-xs opacity-80">
          Tu negocio, bajo control.
        </p>
      </div>

      <main className="w-full max-w-[400px] bg-surface-container-lowest rounded-xl p-lg flex flex-col gap-lg border border-outline-variant">
        <div className="space-y-sm">
          <h2 className="font-display-md-mobile text-display-md-mobile text-on-surface">
            Iniciar Sesión
          </h2>
          <p className="font-body-md text-on-surface-variant text-sm">
            Ingresa tus credenciales para acceder a Tienda Yeremer.
          </p>
        </div>

        <form className="flex flex-col gap-md" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-xs">
            <label
              className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider ml-1"
              htmlFor="username"
            >
              Usuario
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">
                person
              </span>
              <input
                autoComplete="username"
                className="w-full bg-surface-container-low border border-outline-variant rounded-lg py-md pl-11 pr-md font-body-md transition-all focus:outline-none focus:ring-2 focus:ring-primary/20"
                id="username"
                placeholder="Nombre de usuario"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-xs">
            <label
              className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider ml-1"
              htmlFor="password"
            >
              Contraseña
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">
                lock
              </span>
              <input
                autoComplete="current-password"
                className="w-full bg-surface-container-low border border-outline-variant rounded-lg py-md pl-11 pr-md font-body-md transition-all focus:outline-none focus:ring-2 focus:ring-primary/20"
                id="password"
                placeholder="••••••••"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-primary transition-colors"
                type="button"
                onClick={() => setShowPassword((v) => !v)}
              >
                <span className="material-symbols-outlined text-[20px]">
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
          </div>

          {error && <p className="text-error text-sm">{error}</p>}

          <button
            className="mt-md w-full bg-primary text-on-primary font-body-lg text-body-lg py-md rounded-lg flex items-center justify-center gap-sm transition-all shadow-sm hover:shadow-md disabled:opacity-70"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Accediendo...' : 'Entrar'}
            {!loading && <span className="material-symbols-outlined">login</span>}
          </button>
        </form>
      </main>

      <footer className="mt-xl text-center">
        <div className="flex items-center gap-base justify-center opacity-40">
          <span className="material-symbols-outlined text-[14px]">verified_user</span>
          <span className="font-label-sm text-label-sm">Conexión segura y encriptada</span>
        </div>
      </footer>
    </div>
  );
}
