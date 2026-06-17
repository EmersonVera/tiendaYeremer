import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../api/client';

export default function NuevoCliente() {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState('');
  const [numeroCasa, setNumeroCasa] = useState('');
  const [celular, setCelular] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await client.post('/clientes/', {
        nombre,
        numero_casa: numeroCasa,
        celular,
      });
      navigate(`/clientes/${data.id}`);
    } catch {
      setError('No se pudo crear el cliente. Verifica los datos.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="px-container-margin py-lg max-w-[480px] mx-auto md:mx-0">
      <h1 className="font-display-md text-display-md text-on-surface mb-lg">Nuevo Cliente</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-md bg-surface-container-lowest border border-outline-variant rounded-xl p-lg">
        <div className="flex flex-col gap-xs">
          <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider ml-1" htmlFor="nombre">
            Nombre *
          </label>
          <input
            id="nombre"
            className="w-full bg-surface-container-low border border-outline-variant rounded-lg py-md px-md font-body-md focus:outline-none focus:ring-2 focus:ring-primary/20"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Nombre completo"
            required
          />
        </div>

        <div className="flex flex-col gap-xs">
          <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider ml-1" htmlFor="numero_casa">
            Número de casa
          </label>
          <input
            id="numero_casa"
            className="w-full bg-surface-container-low border border-outline-variant rounded-lg py-md px-md font-body-md focus:outline-none focus:ring-2 focus:ring-primary/20"
            value={numeroCasa}
            onChange={(e) => setNumeroCasa(e.target.value)}
            placeholder="Casa #12"
          />
        </div>

        <div className="flex flex-col gap-xs">
          <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider ml-1" htmlFor="celular">
            Celular
          </label>
          <input
            id="celular"
            className="w-full bg-surface-container-low border border-outline-variant rounded-lg py-md px-md font-body-md focus:outline-none focus:ring-2 focus:ring-primary/20"
            value={celular}
            onChange={(e) => setCelular(e.target.value)}
            placeholder="+57 300 000 0000"
          />
        </div>

        {error && <p className="text-error text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="mt-md w-full bg-primary text-on-primary font-body-lg text-body-lg py-md rounded-lg flex items-center justify-center gap-sm transition-all shadow-sm hover:shadow-md disabled:opacity-70"
        >
          {loading ? 'Guardando...' : 'Guardar Cliente'}
        </button>
      </form>
    </div>
  );
}
