// Junta todos los borradores de la tanda en un solo formulario: el texto completo de cada email y una casilla para aprobarlo
const cfg = $('C · Leer Config').first().json;
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
// Solo los que tienen borrador guardado: los que fallaron en la IA ya volvieron a la cola
const borradores = $input.all().map(i => i.json).filter(b => b.fila_mensaje);
if (!borradores.length) return [];
const etiqueta = b => b.dominio_raiz + ' · ' + b.email;

const bloques = borradores.map((b, i) =>
  '<hr><h3>' + (i + 1) + '. ' + esc(b.dominio_raiz) + '</h3>' +
  '<p><b>Para:</b> ' + esc((b.nombre ? b.nombre + ' ' : '') + '<' + b.email + '>') + (b.cargo ? ' · ' + esc(b.cargo) : '') +
  '<br><b>Segmento:</b> ' + esc(b.segmento || '—') + ' · <b>DR</b> ' + esc(b.dr) + ' · <b>Relevancia</b> ' + esc(b.relevancia) + '/10 · <b>Idioma</b> ' + esc(b.idioma_email) +
  '<br><b>Recurso:</b> ' + esc(b.recurso_ofrecido || 'ninguno') + '</p>' +
  ((b.avisos || []).length ? '<p><b>Avisos:</b><br>' + b.avisos.map(esc).join('<br>') + '</p>' : '') +
  '<p><b>Asunto:</b> ' + esc(b.asunto) + '</p>' +
    '<p>' + esc(b.cuerpo).replace(/\n/g, '<br>') + '</p>'
).join('');

const formulario = [
  { fieldType: 'html', elementName: 'borradores', html: bloques },
  { fieldLabel: 'Emails que apruebas', fieldType: 'checkbox', fieldOptions: { values: borradores.map(b => ({ option: etiqueta(b) })) } },
  { fieldLabel: 'Los que no marques', fieldType: 'radio', requiredField: true, fieldOptions: { values: [{ option: 'Descartarlos' }, { option: 'Devolverlos a la cola' }] } }
];

const prueba = cfg.modo_prueba !== false;
const mensaje = ':envelope_with_arrow: *' + borradores.length + (borradores.length === 1 ? ' borrador' : ' borradores') + ' para revisar · ' + cfg.negocio_nombre + '*\n' +
  borradores.map(b => '• ' + b.dominio_raiz + (b.segmento ? ' (' + b.segmento + ')' : '') + ' → _' + b.asunto + '_').join('\n') +
  (prueba ? '\n:test_tube: Modo prueba: los aprobados irán a ' + cfg.email_pruebas : '') +
  '\nPulsa el botón para leerlos enteros y marcar los que se envían. Si nadie responde en 20 horas, vuelven a la cola.';

return [{ json: { borradores, formulario, mensaje } }];
