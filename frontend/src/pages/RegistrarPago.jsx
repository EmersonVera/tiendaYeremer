import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import client from '../api/client';
import { formatCOP, whatsAppLink } from '../utils/format';

export default function RegistrarPago() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [saldo, setSaldo] = useState(null);
  const [monto, setMonto] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [creado, setCreado] = useState(null);

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
      const { data } = await client.post(`/clientes/${id}/pago/`, { monto });
      setCreado({ cliente: data, monto });
    } catch (err) {
      setError(err.response?.data?.monto?.[0] || 'No se pudo registrar el pago. Verifica el monto.');
    } finally {
      setLoading(false);
    }
  }

  if (creado) {
    const { cliente, monto: montoPagado } = creado;
    const saldoNuevo = Number(cliente.saldo);
    const aPazYSalvo = saldoNuevo <= 0;
    const mensaje = aPazYSalvo
      ? `Hola ${cliente.nombre}, en Tienda Yeremer recibimos tu abono de ${formatCOP(montoPagado)}. ¡Quedas a paz y salvo, ya no debes nada! Gracias por tu confianza.`
      : `Hola ${cliente.nombre}, en Tienda Yeremer recibimos tu abono de ${formatCOP(montoPagado)}. Tu saldo pendiente ahora es ${formatCOP(saldoNuevo)}. ¡Gracias!`;
    const link = whatsAppLink(cliente.celular, mensaje);

    return (
      <div className="px-container-margin py-lg max-w-[480px] mx-auto md:mx-0">
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg flex flex-col gap-md items-center text-center">
          <span className="material-symbols-outlined text-secondary text-[48px]">check_circle</span>
          <h1 className="font-display-md text-display-md text-on-surface">Pago Registrado</h1>
          <p className="text-on-surface-variant">
            {formatCOP(montoPagado)} de {cliente.nombre}.{' '}
            {aPazYSalvo ? 'Quedó a paz y salvo.' : `Saldo pendiente: ${formatCOP(saldoNuevo)}.`}
          </p>

          {link ? (
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-secondary text-on-secondary font-body-lg text-body-lg py-md rounded-lg flex items-center justify-center gap-sm transition-all shadow-sm hover:shadow-md"
            >
              <span className="material-symbols-outlined">chat</span>
              Avisar por WhatsApp
            </a>
          ) : (
            <p className="text-label-sm text-label-sm text-outline">
              Este cliente no tiene celular registrado, así que no se puede avisar por WhatsApp.
            </p>
          )}

          <button
            onClick={() => navigate(`/clientes/${id}`)}
            className="w-full bg-primary text-on-primary font-body-lg text-body-lg py-md rounded-lg flex items-center justify-center gap-sm transition-all shadow-sm hover:shadow-md"
          >
            Volver al Cliente
          </button>
        </div>
      </div>
    );
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
