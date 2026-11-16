// Elige a quién le toca recordatorio hoy y a quién se descarta por silencio. Sin dias_follow_up en la config, no hace nada
const cfg = $('E · Leer Config').first().json;
const zona = $('E · ¿Toca enviar?').first().json.zona;
const plazos = String(cfg.dias_follow_up || '').split(',').map(s => Number(s.trim())).filter(n => Number.isFinite(n) && n >= 0);
if (plazos.length < 2) return [];
const descarte = plazos[2] !== undefined ? plazos[2] : 14;

const mensajes = $('E · Leer mensajes').all().map(i => i.json).filter(m => m.id);
const ahora = $now.setZone(zona);
const inicioHoy = ahora.startOf('day');

// El cupo del día se comparte con la rama C: cuentan todas las salidas de hoy
const salidasHoy = mensajes.filter(m => m.direccion === 'salida' && DateTime.fromISO(String(m.createdAt)).setZone(zona) >= inicioHoy).length;
let cupo = Math.max(0, Number(cfg.limite_diario || 0) - salidasHoy);

// El último email nuestro de cada contacto: el recordatorio se responde en ese hilo
const ultimo = {};
// El primer email de cada contacto: es el que tiene que leer la IA, también en el segundo recordatorio
const primero = {};
for (const m of mensajes) {
  if (m.direccion !== 'salida' || !m.thread_id || !m.message_id || !['outreach', 'follow_up'].includes(m.tipo)) continue;
  if (!ultimo[m.contacto_id] || Number(m.id) > Number(ultimo[m.contacto_id].id)) ultimo[m.contacto_id] = m;
  if (m.tipo === 'outreach' && (!primero[m.contacto_id] || Number(m.id) < Number(primero[m.contacto_id].id))) primero[m.contacto_id] = m;
}

const salida = [];
for (const i of $('E · Leer contactos').all()) {
  const c = i.json;
  if (!c.id || !['enviado', 'follow_up_1', 'follow_up_2'].includes(c.estado) || !c.fecha_ultimo_envio) continue;
  // Si avisó de que estaba fuera, no se le escribe antes de su fecha de vuelta
  if (c.fecha_reintento && ahora < DateTime.fromISO(String(c.fecha_reintento)).setZone(zona)) continue;
  const dias = ahora.diff(DateTime.fromISO(String(c.fecha_ultimo_envio)).setZone(zona), 'days').days;
  const n = Number(c.n_follow_ups || 0);
  if (c.estado === 'follow_up_2' || n >= 2) {
    // Ya recibió los dos recordatorios: pasado el plazo, se da por perdido
    if (dias >= descarte) salida.push({ accion: 'descartar', contacto_id: c.id, dominio_raiz: c.dominio_raiz });
    continue;
  }
  if (dias < plazos[n] || !ultimo[c.id] || !cupo) continue;
  cupo--;
  const m = ultimo[c.id];
  const o = primero[c.id] || m;
  salida.push({
    accion: 'recordatorio', contacto_id: c.id, dominio_id: c.dominio_id, dominio_raiz: c.dominio_raiz,
    email: c.email, nombre: c.nombre || '', verificado: c.verificado || '', idioma: c.idioma || m.idioma || 'es',
    n_follow_ups: n, estado_nuevo: 'follow_up_' + (n + 1), numero: n + 1,
    thread_id: m.thread_id, message_id: m.message_id, asunto_original: o.asunto || '', cuerpo_original: o.cuerpo || '',
    recordatorio_anterior: m.tipo === 'follow_up' ? (m.cuerpo || '') : ''
  });
}
return salida.map(j => ({ json: j }));