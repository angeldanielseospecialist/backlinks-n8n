// Borra los datos personales que ya no hacen falta (condiciones del email en frío):
// quien pidió la baja, a los 15 días; el resto de conversaciones cerradas, a los 6 meses de la última actividad
const DIA = 864e5;
const ahora = $now.toMillis();
const filas = n => { try { return $(n).all().map(i => i.json).filter(j => j.id); } catch (e) { return []; } };
const mensajes = filas('G · Leer mensajes');
const contactos = filas('G · Leer contactos');
// Estos siguen vivos: esperan turno, están en revisión o hablan con una persona
const conservar = ['listo_para_enviar', 'pendiente_revision', 'negociando', 'conseguido'];
const fecha = f => { const t = Date.parse(String(f || '')); return isNaN(t) ? 0 : t; };

const borrar = [];
const ids = new Set(contactos.map(c => Number(c.id)));
for (const c of contactos) {
  if (conservar.includes(String(c.estado || '').trim())) continue;
  const suyos = mensajes.filter(m => Number(m.contacto_id) === Number(c.id));
  const baja = suyos.some(m => m.direccion === 'entrada' && m.clasificacion === 'baja');
  const ultima = Math.max(fecha(c.fecha_ultimo_envio), fecha(c.updatedAt), ...suyos.map(m => fecha(m.updatedAt)));
  const plazo = (baja ? 15 : 180) * DIA;
  if (!ultima || ahora - ultima < plazo) continue;
  borrar.push({ json: { tabla: 'contactos', id: c.id, motivo: baja ? 'baja' : 'conversación cerrada', email: c.email } });
  for (const m of suyos) borrar.push({ json: { tabla: 'mensajes', id: m.id, motivo: 'de un contacto borrado' } });
}
// Mensajes sueltos de contactos que ya no existen, con más de 6 meses
for (const m of mensajes) {
  if (!ids.has(Number(m.contacto_id)) && fecha(m.updatedAt) && ahora - fecha(m.updatedAt) >= 180 * DIA) {
    borrar.push({ json: { tabla: 'mensajes', id: m.id, motivo: 'sin contacto' } });
  }
}
return borrar;
