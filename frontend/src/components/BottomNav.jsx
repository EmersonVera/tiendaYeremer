import { NavLink } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export default function BottomNav() {
  const { logout } = useAuth();

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-center items-center gap-4 px-gutter py-xs pb-safe bg-surface border-t border-outline-variant md:hidden">
      <NavLink
        to="/"
        end
        className={({ isActive }) =>
          `flex flex-col items-center justify-center px-6 py-1 transition-all ${
            isActive
              ? 'bg-secondary-container text-on-secondary-container rounded-full'
              : 'text-on-surface-variant hover:bg-surface-variant'
          }`
        }
      >
        {({ isActive }) => (
          <>
            <span
              className="material-symbols-outlined"
              style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
            >
              group
            </span>
            <span className="font-label-sm text-label-sm mt-1">Clientes</span>
          </>
        )}
      </NavLink>

      <button
        onClick={logout}
        className="flex flex-col items-center justify-center px-6 py-1 text-on-surface-variant hover:bg-surface-variant transition-all"
      >
        <span className="material-symbols-outlined">logout</span>
        <span className="font-label-sm text-label-sm mt-1">Salir</span>
      </button>
    </nav>
  );
}
