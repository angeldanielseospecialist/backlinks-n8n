// Mira si en el hilo hay algún mensaje que no sea nuestro: si ya contestaron, no se manda recordatorio (lo tratará la rama D)
const cfg = $('E · Leer Config').first().json;
const buzon = String(cfg.mailbox || '').toLowerCase();
const info = $('E · Uno por uno').item.json;
// Las respuestas que ya guardó la rama D no cuentan: ya están tratadas (por ejemplo, un aviso de fuera de oficina)
const yaGuardados = new Set($('E · Leer mensajes').all().map(i => i.json).filter(m => m.direccion === 'entrada' && m.message_id).map(m => m.message_id));
function cabecera(m, nombre) {
  if (m[nombre]) return String(m[nombre]);
  const h = (m.payload?.headers || []).find(x => String(x.name).toLowerCase() === nombre.toLowerCase());
  return h ? String(h.value) : '';
}
let mensajes = [];
let fallo = false;
for (const item of $input.all()) {
  const j = item.json;
  if (j.error) { fallo = true; continue; }
  if (Array.isArray(j.messages)) mensajes = mensajes.concat(j.messages);
  else if (j.threadId) mensajes.push(j);
}
const ajeno = mensajes.some(m => {
  const de = cabecera(m, 'From').toLowerCase();
  const etiquetas = m.labelIds || (m.labels || []).map(l => l.id) || [];
  return m.id && !yaGuardados.has(m.id) && !(buzon && de.includes(buzon)) && !etiquetas.includes('SENT') && !etiquetas.includes('DRAFT');
});
// Si Gmail falló, mejor no enviar: se reintenta en la pasada de mañana
return [{ json: { ...info, hay_respuesta: ajeno || fallo } }];
