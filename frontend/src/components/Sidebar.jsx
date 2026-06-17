import { NavLink } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export default function Sidebar() {
  const { logout } = useAuth();

  return (
    <aside className="hidden md:flex flex-col h-screen sticky top-0 w-64 border-r border-outline-variant bg-surface-container-lowest">
      <div className="p-lg">
        <h2 className="font-display-md text-display-md text-primary tracking-tight">
          Tienda Yeremer
        </h2>
        <p className="text-on-surface-variant text-label-sm">Tienda de Barrio</p>
      </div>
      <nav className="flex-1 mt-md">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `flex items-center gap-md px-4 py-3 mx-2 rounded-lg transition-all ${
              isActive
                ? 'bg-primary-container text-on-primary-container font-bold'
                : 'text-on-surface-variant hover:bg-surface-container-high'
            }`
          }
        >
          <span className="material-symbols-outlined">group</span>
          <span className="font-body-md">Lista de Clientes</span>
        </NavLink>
      </nav>
      <div className="p-md mt-auto border-t border-outline-variant">
        <button
          onClick={logout}
          className="flex items-center gap-md px-4 py-3 mx-2 rounded-lg text-on-surface-variant hover:bg-surface-container-high w-[calc(100%-1rem)] text-left"
        >
          <span className="material-symbols-outlined">logout</span>
          <span className="font-body-md">Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
}
