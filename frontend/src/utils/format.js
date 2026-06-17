const formatter = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
});

export function formatCOP(value) {
  return formatter.format(Number(value) || 0);
}

export function toWhatsAppNumber(celular) {
  const digits = (celular || '').replace(/\D/g, '');
  if (!digits) return null;
  // Asume Colombia (+57) si guardaron el celular sin indicativo de pais.
  return digits.length === 10 ? `57${digits}` : digits;
}

export function whatsAppLink(celular, mensaje) {
  const numero = toWhatsAppNumber(celular);
  if (!numero) return null;
  return `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
}
