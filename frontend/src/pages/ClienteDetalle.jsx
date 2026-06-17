import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import client from '../api/client';
import { formatCOP } from '../utils/format';

const ICONOS_FIADO = ['shopping_bag', 'fastfood', 'receipt_long'];

function formatFecha(fechaISO) {
  return new Date(fechaISO).toLocaleString('es-CO', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function ClienteDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cliente, setCliente] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    client
      .get(`/clientes/${id}/`)
      .then((res) => setCliente(res.data))
      .catch(() => setError('No se pudo cargar el cliente.'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="p-container-margin text-on-surface-variant">Cargando...</p>;
  if (error) return <p className="p-container-margin text-error">{error}</p>;
  if (!cliente) return null;

  const saldo = Number(cliente.saldo);
  const conDeuda = saldo > 0;

  async function handleEliminar() {
    if (!window.confirm(`¿Seguro que quieres eliminar a ${cliente.nombre}? Esto borra también su historial de movimientos.`)) {
      return;
    }
    try {
      await client.delete(`/clientes/${id}/`);
      navigate('/');
    } catch {
      setError('No se pudo eliminar el cliente.');
    }
  }

  return (
    <>
      <header className="flex items-center gap-2 w-full px-container-margin py-sm sticky top-0 z-40 bg-surface border-b border-outline-variant md:hidden">
        <button
          onClick={() => navigate('/')}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-low transition-colors"
        >
          <span className="material-symbols-outlined text-primary">arrow_back</span>
        </button>
        <h1 className="font-display-md-mobile text-display-md-mobile text-primary tracking-tight">
          Detalle Cliente
        </h1>
      </header>

      <section className="p-container-margin pt-lg md:pt-xl">
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg flex flex-col gap-md relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 pointer-events-none paper-texture"></div>
          <div className="relative z-10 flex justify-end gap-1">
            <button
              onClick={() => navigate(`/clientes/${id}/editar`)}
              className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-surface-container-high transition-colors"
              title="Editar cliente"
            >
              <span className="material-symbols-outlined text-primary text-[20px]">edit</span>
            </button>
            <button
              onClick={handleEliminar}
              className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-error-container transition-colors"
              title="Eliminar cliente"
            >
              <span className="material-symbols-outlined text-error text-[20px]">delete</span>
            </button>
          </div>
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-md">
          <div className="flex items-center gap-lg">
            <div className="w-16 h-16 rounded-full bg-primary-fixed flex items-center justify-center text-on-primary-fixed-variant">
              <span className="material-symbols-outlined scale-150">person</span>
            </div>
            <div>
              <h2 className="font-display-md text-display-md text-on-surface">{cliente.nombre}</h2>
              <div className="flex flex-col gap-xs mt-xs text-on-surface-variant">
                {cliente.numero_casa && (
                  <span className="flex items-center gap-xs">
                    <span className="material-symbols-outlined text-[18px]">home</span>
                    {cliente.numero_casa}
                  </span>
                )}
                {cliente.celular && (
                  <span className="flex items-center gap-xs">
                    <span className="material-symbols-outlined text-[18px]">call</span>
                    {cliente.celular}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="md:text-right">
            <p className="text-label-sm text-on-surface-variant uppercase tracking-widest mb-1">
              Saldo Pendiente
            </p>
            <p className={`font-amount-lg text-display-lg ${conDeuda ? 'text-tertiary' : 'text-secondary'}`}>
              {formatCOP(saldo)}
            </p>
            {conDeuda ? (
              <span className="inline-flex items-center px-2 py-1 rounded bg-error-container text-on-error-container text-[11px] font-bold mt-2">
                DEUDA ACTIVA
              </span>
            ) : (
              <span className="inline-flex items-center px-2 py-1 rounded bg-secondary-container text-on-secondary-container text-[11px] font-bold mt-2">
                AL DÍA
              </span>
            )}
          </div>
          </div>
        </div>
      </section>

      <section className="px-container-margin grid grid-cols-1 md:grid-cols-2 gap-md mt-md">
        <button
          onClick={() => navigate(`/clientes/${id}/fiado`)}
          className="flex items-center justify-center gap-md bg-primary text-on-primary h-14 rounded-xl font-bold hover:opacity-90 active:scale-95 transition-all shadow-sm"
        >
          <span className="material-symbols-outlined">receipt_long</span>
          Nuevo Fiado
        </button>
        <button
          onClick={() => navigate(`/clientes/${id}/pago`)}
          className="flex items-center justify-center gap-md bg-secondary text-on-secondary h-14 rounded-xl font-bold hover:opacity-90 active:scale-95 transition-all shadow-sm"
        >
          <span className="material-symbols-outlined">payments</span>
          Registrar Pago
        </button>
      </section>

      <section className="px-container-margin mt-lg">
        <h3 className="font-display-md-mobile text-display-md-mobile text-on-surface mb-md">
          Movimientos Recientes
        </h3>

        {cliente.movimientos.length === 0 && (
          <p className="text-on-surface-variant">Todavía no hay movimientos.</p>
        )}

        <div className="space-y-0 relative">
          {cliente.movimientos.map((mov, idx) => {
            const esFiado = mov.tipo === 'FIADO';
            return (
              <div
                key={mov.id}
                className={`transaction-item relative flex items-start gap-md p-md bg-white border-x border-t border-outline-variant hover:bg-surface transition-colors ${
                  idx === 0 ? 'first:rounded-t-xl' : ''
                } ${idx === cliente.movimientos.length - 1 ? 'border-b rounded-b-xl' : ''}`}
              >
                <div className="transaction-line w-12 flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center z-10 ${
                      esFiado ? 'bg-surface-container' : 'bg-secondary-container'
                    }`}
                  >
                    <span
                      className={`material-symbols-outlined ${esFiado ? 'text-tertiary' : 'text-on-secondary-container'}`}
                    >
                      {esFiado ? ICONOS_FIADO[idx % ICONOS_FIADO.length] : 'check_circle'}
                    </span>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-body-lg text-on-surface">
                        {esFiado ? mov.descripcion || 'Fiado' : 'Abono'}
                      </p>
                      <p className="text-label-sm text-on-surface-variant">{formatFecha(mov.fecha)}</p>
                    </div>
                    <p className={`font-amount-lg ${esFiado ? 'text-tertiary' : 'text-secondary'}`}>
                      {esFiado ? '+' : '-'}
                      {formatCOP(mov.monto)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}
