// Traduce la clasificación en lo que hay que hacer: estado del contacto, lista de bloqueo, contacto nuevo y aviso en Slack
const cfg = $('D · Leer Config').first().json;
const r = $('D · Respuestas nuevas').item.json;
const fila = $('D · Guardar respuesta').item.json.id;
const ia = $input.item.json.output;
const prueba = cfg.modo_prueba !== false;
const umbral = 0.8;

const acciones = {
  interesado: { estado: 'negociando', avisar: true },
  pide_info: { estado: 'negociando', avisar: true },
  fuera_oficina: { estado: 'enviado', avisar: false },
  no_interesado: { estado: 'descartado', avisar: false },
  pide_pago: { estado: 'descartado', avisar: true, bloquear: true },
  baja: { estado: 'descartado', avisar: true, bloquear: true },
  rebote: { estado: 'descartado', avisar: false, verificado: 'invalido' },
  redirige_a_otro: { estado: 'descartado', avisar: true }
};
const clasificacion = ia ? String(ia.clasificacion || '').toLowerCase() : 'error_ia';
const confianza = ia ? Number(ia.confianza ?? 0) : 0;
const base = acciones[clasificacion];
// Con poca confianza o si la IA falla no se toca nada: decide una persona
const dudosa = !base || confianza < umbral;
const accion = dudosa ? { estado: 'respondido', avisar: true } : base;
const datos = (ia && ia.datos) || {};
const nuevoEmail = !dudosa && clasificacion === 'redirige_a_otro' ? String(datos.nuevo_email || '').trim().toLowerCase() : '';
// En modo prueba no se toca la lista de bloqueo: las respuestas las escribimos nosotros
const bloquear = Boolean(accion.bloquear) && !prueba;
const borrador = ['interesado', 'pide_info'].includes(clasificacion) ? String(ia?.borrador_respuesta || '') : '';

const titulos = {
  interesado: ':star2: *Respuesta interesada',
  pide_info: ':question: *Pide información',
  pide_pago: ':moneybag: *Pide pago',
  baja: ':no_entry: *Pide la baja',
  redirige_a_otro: ':arrow_right: *Nos redirige a otra persona'
};
const lineas = [
  (dudosa ? ':mag: *Respuesta para revisar a mano' : (titulos[clasificacion] || ':envelope: *Respuesta')) + ' · ' + r.dominio_raiz + '*',
  '• De: ' + r.remitente + (prueba ? ' _(modo prueba)_' : ''),
  '• Clasificación: ' + clasificacion + ' · confianza ' + confianza.toFixed(2) + (dudosa ? ' → el contacto queda en `respondido` hasta que decidas' : ''),
  '• Resumen: ' + (ia?.resumen || 'la IA no pudo leerla')
];
if (accion.bloquear) lineas.push(prueba ? '• Modo prueba: el dominio NO se añade a la lista de bloqueo' : '• Dominio añadido a la lista de bloqueo');
if (clasificacion === 'pide_pago' && datos.precio_pedido) lineas.push('• Precio pedido: ' + datos.precio_pedido);
if (nuevoEmail) lineas.push('• Contacto nuevo creado, listo para enviar: ' + nuevoEmail + ' (sin verificar)');
if (borrador && !$('D · Recursos de marketing').first().json.hay) lineas.push('• :warning: Marketing aún no ha cargado recursos enlazables en el Sheet: el borrador no propone ninguno');
if (borrador) lineas.push('*Borrador de respuesta* (lo revisa y lo envía una persona, no la automatización):', '```' + borrador + '```');
lineas.push('• Hilo en Gmail: https://mail.google.com/mail/?authuser=' + encodeURIComponent(cfg.mailbox || '') + '#all/' + r.thread_id);

return { json: {
  fila, contacto_id: r.contacto_id, dominio_id: r.dominio_id, dominio_raiz: r.dominio_raiz, idioma: r.idioma,
  clasificacion, confianza, resumen: ia?.resumen || '', borrador_respuesta: borrador,
  estado: accion.estado, verificado: accion.verificado || r.verificado,
  fecha_reintento: !dudosa && clasificacion === 'fuera_oficina' && datos.fecha_regreso ? String(datos.fecha_regreso) : '',
  bloquear, nuevo_email: nuevoEmail, avisar: accion.avisar, mensaje: lineas.join('\n')
} };
