// Decide qué pasa con cada enlace y arma el aviso de Slack y la fila del log
const cfg = $('F · Leer Config').first().json;
// Llegan todas las filas por la salida final del bucle. Leer el nodo de dentro solo daría la última
const res = $input.all().map(i => i.json).filter(r => r.url_origen);
// Lo que tenía guardado cada fila antes de esta pasada
const antes = {}; for (const i of $('F · Leer enlaces').all()) antes[i.json.id] = i.json;
const hoy = $now.toISO();
const enlaces = []; const avisos = [];
let nuevos = 0, vivos = 0, perdidos = 0, fallos = 0;

for (const r of res) {
  const vivoOk = r.encontrado && r.indexable !== false;
  const fila = {
    id: r.id, contacto_id: r.contacto_id || '', url_origen: r.url_origen, estado: r.estado || '',
    rel: r.rel_visto || '', anchor: r.anchor_visto || '', indexable: r.indexable !== false,
    fecha_conseguido: r.fecha_conseguido || null, conseguir: false
  };
  if (r.fallo && !r.encontrado) {
    fallos++;
    // No se pudo leer: la fila conserva lo que tenía
    const a = antes[r.id] || {};
    fila.rel = a.rel || ''; fila.anchor = a.anchor || ''; fila.indexable = a.indexable !== false;
    avisos.push('• :warning: No se pudo leer ' + r.url_origen + ' (' + r.fallo + '). Se reintenta la próxima semana');
  } else if (vivoOk && fila.estado !== 'vivo') {
    fila.estado = 'vivo'; fila.fecha_conseguido = hoy; fila.conseguir = Boolean(r.contacto_id); nuevos++;
    avisos.push('• :white_check_mark: Enlace vivo en ' + r.url_origen + (fila.rel ? ' (rel ' + fila.rel + ')' : ''));
  } else if (vivoOk) {
    vivos++;
    if (r.canonical_distinta) avisos.push('• :warning: ' + r.url_origen + ' enlaza, pero su canonical apunta a otra URL');
  } else if (fila.estado === 'vivo') {
    fila.estado = 'perdido'; perdidos++;
    avisos.push('• :x: Enlace perdido en ' + r.url_origen + (r.encontrado ? ' (la página tiene noindex)' : ''));
  }
  enlaces.push(fila);
}

const texto = ':link: *Monitor de enlaces · ' + cfg.negocio_nombre + '*\n' +
  '• Revisados: ' + res.length + ' · vivos: ' + (vivos + nuevos) + ' · nuevos: ' + nuevos + ' · perdidos: ' + perdidos + (fallos ? ' · sin leer: ' + fallos : '') +
  (avisos.length ? '\n' + avisos.join('\n') : '');

return [{ json: { enlaces, texto, avisar: (nuevos + perdidos + fallos) > 0, total: res.length, nuevos, perdidos, fallos } }];