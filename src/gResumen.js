// Junta los números del día y, los viernes, añade los KPIs acumulados. Todo en un solo mensaje
const cfg = $('G · Leer Config').first().json;
const zona = (String(cfg.ventana_envio || '').trim().split(/\s+/)[2]) || 'Europe/Madrid';
const ahora = $now.setZone(zona);
const inicioHoy = ahora.startOf('day');
const filas = n => { try { return $(n).all().map(i => i.json).filter(j => j.id); } catch (e) { return []; } };
const esHoy = f => Boolean(f) && DateTime.fromISO(String(f)).setZone(zona) >= inicioHoy;

const mensajes = filas('G · Leer mensajes');
const contactos = filas('G · Leer contactos');
const dominios = filas('G · Leer dominios');
const log = filas('G · Leer log');
const porEstado = (lista, estado) => lista.filter(x => x.estado === estado).length;

const enviadosHoy = mensajes.filter(m => m.direccion === 'salida' && ['outreach', 'follow_up'].includes(m.tipo) && esHoy(m.updatedAt)).length;
const borradoresHoy = mensajes.filter(m => m.direccion === 'salida' && esHoy(m.createdAt)).length;
const respuestasHoy = mensajes.filter(m => m.direccion === 'entrada' && esHoy(m.createdAt));
const tipos = {};
for (const r of respuestasHoy) { const c = r.clasificacion || 'sin clasificar'; tipos[c] = (tipos[c] || 0) + 1; }
const cualificadosHoy = dominios.filter(d => d.estado === 'cualificado' && esHoy(d.updatedAt)).length;

// El gasto se agrupa por servicio, porque cada uno se mide en su unidad
const gasto = {};
for (const l of log.filter(l => esHoy(l.createdAt))) {
  const u = /ahrefs/.test(l.accion) ? 'unidades de Ahrefs' : /hunter/.test(l.accion) ? 'créditos de Hunter' : /serpapi/.test(l.accion) ? 'búsquedas de SerpAPI' : null;
  if (u) gasto[u] = (gasto[u] || 0) + Number(l.coste_estimado || 0);
}
const gastoTxt = Object.entries(gasto).map(([u, n]) => n + ' ' + u).join(' · ') || 'nada';

const lineas = [
  ':bar_chart: *Resumen diario · ' + cfg.negocio_nombre + ' · ' + ahora.toFormat('dd/MM') + '*',
  '• Enviados hoy: ' + enviadosHoy + ' de ' + Number(cfg.limite_diario || 0) + ' (borradores del día: ' + borradoresHoy + ')',
  '• Respuestas hoy: ' + respuestasHoy.length + (respuestasHoy.length ? ' (' + Object.entries(tipos).map(([t, n]) => t + ' ' + n).join(', ') + ')' : ''),
  '• Cualificados nuevos hoy: ' + cualificadosHoy,
  '• Esperando: ' + porEstado(dominios, 'prospecto') + ' en cola · ' + porEstado(dominios, 'pendiente_aprobacion') + ' por aprobar · ' + porEstado(dominios, 'pendiente_email') + ' sin créditos de Hunter',
  '• Contactos: ' + porEstado(contactos, 'listo_para_enviar') + ' listos · ' + porEstado(contactos, 'pendiente_revision') + ' en revisión · ' + porEstado(contactos, 'negociando') + ' negociando',
  '• Gasto de hoy: ' + gastoTxt
];

// Los viernes, KPIs acumulados leyendo el estado de las tablas (si se limpian mensajes antiguos, serán parciales)
if (ahora.weekday === 5) {
  const enviados = mensajes.filter(m => m.direccion === 'salida' && m.tipo === 'outreach').length;
  // La tasa cuenta personas, no mensajes. Fuera de oficina y rebotes no son respuesta
  const escritos = new Set(mensajes.filter(m => m.direccion === 'salida' && m.tipo === 'outreach').map(m => Number(m.contacto_id)));
  const entradas = mensajes.filter(m => m.direccion === 'entrada');
  const respondieron = new Set(entradas.filter(m => escritos.has(Number(m.contacto_id)) && !['fuera_oficina', 'rebote'].includes(m.clasificacion)).map(m => Number(m.contacto_id)));
  const interesados = new Set(entradas.filter(m => ['interesado', 'pide_info'].includes(m.clasificacion)).map(m => Number(m.contacto_id)));
  const conseguidos = contactos.filter(c => c.estado === 'conseguido');
  const dominiosPorId = {}; for (const d of dominios) dominiosPorId[d.id] = d;
  const drs = conseguidos.map(c => Number((dominiosPorId[c.dominio_id] || {}).dr || 0)).filter(Boolean);
  const drMedio = drs.length ? Math.round(drs.reduce((s, n) => s + n, 0) / drs.length) : 0;
  lineas.push('', ':chart_with_upwards_trend: *KPIs (acumulado de las tablas)*',
    '• Primeros emails enviados: ' + enviados,
    '• Tasa de respuesta: ' + (escritos.size ? Math.round(100 * respondieron.size / escritos.size) + ' % (' + respondieron.size + ' de ' + escritos.size + ' contactos)' : 'sin envíos') + ' · con interés: ' + interesados.size,
    '• Backlinks conseguidos: ' + conseguidos.length + (drs.length ? ' (DR medio ' + drMedio + ')' : ''));
}

return [{ json: { texto: lineas.join('\n') } }];