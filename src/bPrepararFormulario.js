// Junta las webs que esperan visto bueno en un solo formulario: una casilla por web y sus datos a la vista
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const vistos = new Set();
const candidatos = [];
for (const item of $input.all()) {
  const c = item.json;
  if (!c.id || vistos.has(c.id)) continue;
  vistos.add(c.id);
  candidatos.push({
    id: c.id,
    dominio_raiz: c.dominio_raiz,
    idioma: c.idioma || '',
    origen: c.origen || 'pendiente',
    segmento: c.segmento || '',
    dr: c.dr ?? '',
    trafico: c.trafico_organico ?? '',
    relevancia: c.relevancia ?? '',
    motivo: c.motivo_relevancia || '',
    articulo_titulo: c.articulo_titulo || '',
    articulo_url: c.articulo_url || ''
  });
}

const filas = candidatos.map(c =>
  '<tr><td><b>' + esc(c.dominio_raiz) + '</b></td><td>' + esc(c.segmento || '—') + '</td><td>' + esc(c.dr) + '</td><td>' + esc(c.trafico) + '</td><td>' + esc(c.relevancia) + '/10</td><td>' + esc(c.idioma) + '</td><td>' + esc(c.motivo) + '</td><td>' +
  (c.articulo_url ? '<a href="' + esc(c.articulo_url) + '" target="_blank">' + esc(c.articulo_titulo || c.articulo_url) + '</a>' : '') + '</td></tr>'
).join('');
const tabla = '<table><tr><th>Web</th><th>Segmento</th><th>DR</th><th>Tráfico</th><th>Relevancia</th><th>Idioma</th><th>Por qué encaja</th><th>Artículo</th></tr>' + filas + '</table>';

const formulario = [
  { fieldType: 'html', elementName: 'datos', html: tabla },
  { fieldLabel: 'Webs que apruebas', fieldType: 'checkbox', fieldOptions: { values: candidatos.map(c => ({ option: c.dominio_raiz })) } },
  { fieldLabel: 'Las que no marques', fieldType: 'radio', requiredField: true, fieldOptions: { values: [{ option: 'Rechazarlas' }, { option: 'Dejarlas para mañana' }] } }
];

const mensaje = ':white_check_mark: *' + candidatos.length + ' webs esperan tu visto bueno antes de gastar créditos de Hunter*\n' +
  candidatos.map(c => '• ' + c.dominio_raiz + (c.segmento ? ' · ' + c.segmento : '') + ' · DR ' + c.dr + ' · relevancia ' + c.relevancia + '/10 · ' + c.idioma).join('\n') +
  '\nSi nadie responde en 20 horas, vuelven a salir mañana.';

return [{ json: { candidatos, formulario, mensaje } }];
