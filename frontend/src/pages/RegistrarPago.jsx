import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import client from '../api/client';
import { formatCOP } from '../utils/format';

export default function RegistrarPago() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [saldo, setSaldo] = useState(null);
  const [monto, setMonto] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    client.get(`/clientes/${id}/`).then((res) => setSaldo(Number(res.data.saldo)));
  }, [id]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (saldo !== null && Number(monto) > saldo) {
      setError(`El pago no puede ser mayor al saldo pendiente (${formatCOP(saldo)}).`);
      return;
    }

    setLoading(true);
    try {
      await client.post(`/clientes/${id}/pago/`, { monto });
      navigate(`/clientes/${id}`);
    } catch (err) {
      setError(err.response?.data?.monto?.[0] || 'No se pudo registrar el pago. Verifica el monto.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="px-container-margin py-lg max-w-[480px] mx-auto md:mx-0">
      <h1 className="font-display-md text-display-md text-on-surface mb-lg">Registrar Pago</h1>

      {saldo !== null && (
        <p className="text-on-surface-variant mb-md">
          Saldo pendiente: <span className="font-bold text-tertiary">{formatCOP(saldo)}</span>
        </p>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-md bg-surface-container-lowest border border-outline-variant rounded-xl p-lg">
        <div className="flex flex-col gap-xs">
          <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider ml-1" htmlFor="monto">
            Monto del abono *
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-outline font-amount-lg">$</span>
            <input
              id="monto"
              className="w-full bg-surface-container-low border border-outline-variant rounded-lg py-md pl-8 pr-md font-amount-lg text-amount-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
              type="number"
              inputMode="decimal"
              min="0.01"
              max={saldo ?? undefined}
              step="0.01"
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
              placeholder="0"
              required
            />
          </div>
        </div>

        {error && <p className="text-error text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="mt-md w-full bg-secondary text-on-secondary font-body-lg text-body-lg py-md rounded-lg flex items-center justify-center gap-sm transition-all shadow-sm hover:shadow-md disabled:opacity-70"
        >
          {loading ? 'Guardando...' : 'Registrar Pago'}
        </button>
      </form>
    </div>
  );
}
