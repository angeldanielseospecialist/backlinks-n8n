// Lista los hilos de Gmail que abrimos nosotros y siguen esperando respuesta. Solo esos se leen: nunca el resto del buzón
const mensajes = $('D · Leer mensajes').all().map(i => i.json).filter(m => m.id);
const contactos = {};
for (const i of $('D · Leer contactos').all()) if (i.json.id) contactos[i.json.id] = i.json;
const esperando = ['enviado', 'follow_up_1', 'follow_up_2', 'respondido'];

const hilos = {};
for (const m of mensajes) {
  if (m.direccion !== 'salida' || !m.thread_id || !['outreach', 'follow_up'].includes(m.tipo)) continue;
  const c = contactos[m.contacto_id];
  if (!c || !esperando.includes(c.estado)) continue;
  hilos[m.thread_id] = {
    thread_id: m.thread_id, contacto_id: c.id, dominio_id: c.dominio_id, dominio_raiz: m.dominio_raiz,
    email_contacto: c.email, verificado: c.verificado || '', estado_contacto: c.estado,
    idioma: c.idioma || m.idioma || '', asunto_original: m.asunto || '', cuerpo_original: m.cuerpo || ''
  };
}
return Object.values(hilos).map(h => ({ json: h }));
