// Arma el aviso semanal para PR con las webs de pequeña prensa que aún no se le han pasado
const cfg = $('A · Leer Config').first().json;
const webs = $input.all().map(i => i.json).filter(w => w.id && w.dominio_raiz);
if (!webs.length) return [];
const miles = n => String(Math.round(Number(n || 0))).replace(/\B(?=(\d{3})+(?!\d))/g, '.');

const lineas = [
  ':newspaper: :rotating_light: *LISTA PARA PR · ' + cfg.negocio_nombre + ' · ' + webs.length + ' webs de pequeña prensa* :rotating_light:',
  '_Medios pequeños y afines que la automatización no contacta: son para la lista de PR orgánico._',
  ...webs.map(w => '• *' + w.dominio_raiz + '* · DR ' + (w.dr ?? '?') + ' · ' + miles(w.trafico_organico) + ' visitas/mes · ' + (w.idioma || '?') + (w.motivo_relevancia ? ' · ' + w.motivo_relevancia : '')),
  ':white_check_mark: Quedan marcadas como avisadas: la semana que viene solo saldrán las nuevas.'
];

return [{ json: { texto: lineas.join('\n'), ids: webs.map(w => w.id) } }];
