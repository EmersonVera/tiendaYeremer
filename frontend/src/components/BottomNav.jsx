import { NavLink } from 'react-router-dom';

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-center items-center px-gutter py-xs pb-safe bg-surface border-t border-outline-variant md:hidden">
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
    </nav>
  );
}
