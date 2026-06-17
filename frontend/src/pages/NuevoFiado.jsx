import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import client from '../api/client';

export default function NuevoFiado() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [monto, setMonto] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await client.post(`/clientes/${id}/fiado/`, { monto, descripcion });
      navigate(`/clientes/${id}`);
    } catch {
      setError('No se pudo registrar el fiado. Verifica el monto.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="px-container-margin py-lg max-w-[480px] mx-auto md:mx-0">
      <h1 className="font-display-md text-display-md text-on-surface mb-lg">Nuevo Fiado</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-md bg-surface-container-lowest border border-outline-variant rounded-xl p-lg">
        <div className="flex flex-col gap-xs">
          <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider ml-1" htmlFor="monto">
            Monto *
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-outline font-amount-lg">$</span>
            <input
              id="monto"
              className="w-full bg-surface-container-low border border-outline-variant rounded-lg py-md pl-8 pr-md font-amount-lg text-amount-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
              type="number"
              inputMode="decimal"
              min="0.01"
              step="0.01"
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
              placeholder="0"
              required
            />
          </div>
        </div>

        <div className="flex flex-col gap-xs">
          <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider ml-1" htmlFor="descripcion">
            Descripción
          </label>
          <textarea
            id="descripcion"
            className="w-full bg-surface-container-low border border-outline-variant rounded-lg py-md px-md font-body-md focus:outline-none focus:ring-2 focus:ring-primary/20"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Aceite, Arroz y Pan"
            rows={3}
          />
        </div>

        {error && <p className="text-error text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="mt-md w-full bg-primary text-on-primary font-body-lg text-body-lg py-md rounded-lg flex items-center justify-center gap-sm transition-all shadow-sm hover:shadow-md disabled:opacity-70"
        >
          {loading ? 'Guardando...' : 'Registrar Fiado'}
        </button>
      </form>
    </div>
  );
}
