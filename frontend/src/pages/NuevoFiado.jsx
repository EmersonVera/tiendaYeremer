import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import client from '../api/client';
import { formatCOP, whatsAppLink } from '../utils/format';

export default function NuevoFiado() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [monto, setMonto] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [creado, setCreado] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await client.post(`/clientes/${id}/fiado/`, { monto, descripcion });
      setCreado({ cliente: data, monto, descripcion });
    } catch {
      setError('No se pudo registrar el fiado. Verifica el monto.');
    } finally {
      setLoading(false);
    }
  }

  if (creado) {
    const { cliente, monto: montoCreado, descripcion: descripcionCreada } = creado;
    const mensaje = `Hola ${cliente.nombre}, en Tienda Yeremer registramos un fiado de ${formatCOP(montoCreado)}${
      descripcionCreada ? ` por "${descripcionCreada}"` : ''
    }. Tu saldo pendiente ahora es ${formatCOP(cliente.saldo)}. ¡Gracias por tu confianza!`;
    const link = whatsAppLink(cliente.celular, mensaje);

    return (
      <div className="px-container-margin py-lg max-w-[480px] mx-auto md:mx-0">
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg flex flex-col gap-md items-center text-center">
          <span className="material-symbols-outlined text-secondary text-[48px]">check_circle</span>
          <h1 className="font-display-md text-display-md text-on-surface">Fiado Registrado</h1>
          <p className="text-on-surface-variant">
            {formatCOP(montoCreado)} para {cliente.nombre}. Saldo pendiente: {formatCOP(cliente.saldo)}.
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
