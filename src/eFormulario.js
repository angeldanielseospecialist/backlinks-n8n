// Junta los recordatorios de la tanda en un solo formulario de Slack, como el de la rama C
const cfg = $('E · Leer Config').first().json;
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const borradores = $input.all().map(i => i.json).filter(b => b.fila_mensaje);
if (!borradores.length) return [];
const etiqueta = b => b.dominio_raiz + ' · ' + b.email;

const bloques = borradores.map((b, i) =>
  '<hr><h3>' + (i + 1) + '. ' + esc(b.dominio_raiz) + ' · recordatorio ' + b.numero + ' de 2</h3>' +
  '<p><b>Hilo:</b> ' + esc(b.asunto_original) + '<br><b>Para:</b> ' + esc((b.nombre ? b.nombre + ' ' : '') + '<' + b.email + '>') + ' · <b>Idioma</b> ' + esc(b.idioma_email) + '</p>' +
  ((b.avisos || []).length ? '<p><b>Avisos:</b><br>' + b.avisos.map(esc).join('<br>') + '</p>' : '') +
  '<p>' + esc(b.cuerpo).replace(/\n/g, '<br>') + '</p>'
).join('');

const formulario = [
  { fieldType: 'html', elementName: 'recordatorios', html: bloques },
  { fieldLabel: 'Recordatorios que apruebas', fieldType: 'checkbox', fieldOptions: { values: borradores.map(b => ({ option: etiqueta(b) })) } },
  { fieldLabel: 'Los que no marques', fieldType: 'radio', requiredField: true, fieldOptions: { values: [{ option: 'Dejarlos para otro día' }, { option: 'Descartar el contacto' }] } }
];

const prueba = cfg.modo_prueba !== false;
const mensaje = ':hourglass_flowing_sand: *' + borradores.length + (borradores.length === 1 ? ' recordatorio' : ' recordatorios') + ' para revisar · ' + cfg.negocio_nombre + '*\n' +
  borradores.map(b => '• ' + b.dominio_raiz + ' (' + b.numero + ' de 2) → _' + b.asunto_original + '_').join('\n') +
  (prueba ? '\n:test_tube: Modo prueba: la respuesta irá al hilo de ' + cfg.email_pruebas : '') +
  '\nPulsa el botón para leerlos y marcar los que se envían. Sin respuesta en 20 horas, se intenta otro día.';

return [{ json: { borradores, formulario, mensaje } }];
