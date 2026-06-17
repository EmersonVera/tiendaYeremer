import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../api/client';
import { formatCOP } from '../utils/format';

function inicial(nombre) {
  return nombre.trim().charAt(0).toUpperCase() || '?';
}

export default function ClientesList() {
  const navigate = useNavigate();
  const [clientes, setClientes] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError('');
    client
      .get('/clientes/', { params: search ? { search } : undefined, signal: controller.signal })
      .then((res) => setClientes(res.data))
      .catch((err) => {
        if (err.name !== 'CanceledError') setError('No se pudo cargar la lista de clientes.');
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [search]);

  return (
    <>
      <header className="flex justify-between items-center w-full px-container-margin py-sm sticky top-0 z-40 bg-surface border-b border-outline-variant">
        <h1 className="font-display-md-mobile text-display-md-mobile text-primary tracking-tight md:font-display-md md:text-display-md">
          Tienda Yeremer
        </h1>
      </header>

      <div className="px-container-margin py-md">
        <div className="mb-lg relative">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">
            search
          </span>
          <input
            className="w-full pl-12 pr-4 py-3 bg-surface-container-low border border-outline-variant rounded-xl text-body-md focus:outline-none focus:ring-2 focus:ring-primary/20"
            placeholder="Buscar clientes..."
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex justify-between items-end mb-md">
          <h2 className="font-display-md text-display-md text-on-surface">Lista de Clientes</h2>
          <p className="font-label-sm text-label-sm text-outline uppercase tracking-wider">
            {clientes.length} {clientes.length === 1 ? 'Cliente' : 'Clientes'}
          </p>
        </div>

        {loading && <p className="text-on-surface-variant">Cargando...</p>}
        {error && <p className="text-error">{error}</p>}
        {!loading && !error && clientes.length === 0 && (
          <p className="text-on-surface-variant">No hay clientes todavía.</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
          {clientes.map((cliente) => {
            const conDeuda = Number(cliente.saldo) > 0;
            return (
              <div
                key={cliente.id}
                onClick={() => navigate(`/clientes/${cliente.id}`)}
                className="customer-card bg-surface-container-lowest p-md rounded-xl flex flex-col gap-sm hover:border-primary/30 transition-all cursor-pointer active:scale-95 duration-150"
              >
                <div className="flex justify-between items-start">
                  <div className="w-12 h-12 bg-primary-fixed rounded-full flex items-center justify-center text-on-primary-fixed font-bold text-lg">
                    {inicial(cliente.nombre)}
                  </div>
                  <div className="text-right">
                    <span className="font-label-sm text-label-sm text-outline block mb-1">
                      SALDO PENDIENTE
                    </span>
                    <span
                      className={`font-amount-lg text-amount-lg ${conDeuda ? 'text-tertiary' : 'text-secondary'}`}
                    >
                      {formatCOP(cliente.saldo)}
                    </span>
                  </div>
                </div>
                <div>
                  <h3 className="font-body-lg text-body-lg text-on-surface font-bold">
                    {cliente.nombre}
                  </h3>
                  <div className="flex items-center gap-1 text-on-surface-variant mt-1">
                    <span className="material-symbols-outlined text-[18px]">home</span>
                    <span className="text-body-md font-body-md">
                      {cliente.numero_casa || 'Sin asignar'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <button
        onClick={() => navigate('/clientes/nuevo')}
        className="fixed right-6 bottom-24 z-50 w-14 h-14 bg-primary text-on-primary rounded-xl shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-all md:bottom-10"
      >
        <span className="material-symbols-outlined text-[32px]">person_add</span>
      </button>
    </>
  );
}
