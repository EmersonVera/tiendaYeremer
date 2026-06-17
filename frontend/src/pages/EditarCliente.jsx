import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import client from '../api/client';

export default function EditarCliente() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [nombre, setNombre] = useState('');
  const [numeroCasa, setNumeroCasa] = useState('');
  const [celular, setCelular] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    client
      .get(`/clientes/${id}/`)
      .then((res) => {
        setNombre(res.data.nombre);
        setNumeroCasa(res.data.numero_casa);
        setCelular(res.data.celular);
      })
      .catch(() => setError('No se pudo cargar el cliente.'))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      await client.patch(`/clientes/${id}/`, {
        nombre,
        numero_casa: numeroCasa,
        celular,
      });
      navigate(`/clientes/${id}`);
    } catch {
      setError('No se pudo guardar el cliente. Verifica los datos.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="p-container-margin text-on-surface-variant">Cargando...</p>;

  return (
    <div className="px-container-margin py-lg max-w-[480px] mx-auto md:mx-0">
      <h1 className="font-display-md text-display-md text-on-surface mb-lg">Editar Cliente</h1>

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
          disabled={saving}
          className="mt-md w-full bg-primary text-on-primary font-body-lg text-body-lg py-md rounded-lg flex items-center justify-center gap-sm transition-all shadow-sm hover:shadow-md disabled:opacity-70"
        >
          {saving ? 'Guardando...' : 'Guardar Cambios'}
        </button>
      </form>
    </div>
  );
}
