// Busca en cada hilo los mensajes que no son nuestros y que aún no hemos guardado
const cfg = $('D · Leer Config').first().json;
const buzon = String(cfg.mailbox || '').toLowerCase();
const yaGuardados = new Set($('D · Leer mensajes').all().map(i => i.json).filter(m => m.direccion === 'entrada' && m.message_id).map(m => m.message_id));
const hilos = {};
for (const i of $('D · Hilos a revisar').all()) hilos[i.json.thread_id] = i.json;

function cabecera(m, nombre) {
  if (m[nombre]) return String(m[nombre]);
  const h = (m.payload?.headers || []).find(x => String(x.name).toLowerCase() === nombre.toLowerCase());
  return h ? String(h.value) : '';
}
function decodificar(data) {
  try { return Buffer.from(String(data).replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8'); } catch (e) { return ''; }
}
function texto(m) {
  const partes = [];
  const recorrer = p => {
    if (!p) return;
    if (p.mimeType === 'text/plain' && p.body?.data) partes.push(decodificar(p.body.data));
    (p.parts || []).forEach(recorrer);
  };
  recorrer(m.payload);
  if (!partes.length && m.payload?.body?.data) partes.push(decodificar(m.payload.body.data).replace(/<[^>]+>/g, ' '));
  const t = (partes.join('\n').trim() || String(m.snippet || '')).replace(/\r/g, '');
  // Quita la parte citada de nuestro email para que la IA lea solo la respuesta
   const corte = t.search(/\n[^\n]{0,20}(El |On |Le |Il giorno |Em )[\s\S]{5,160}?(escribió|wrote|a écrit|ha scritto|escreveu):|\n>/);
  return (corte > 0 ? t.slice(0, corte) : t).trim().slice(0, 4000);
}

// Gmail puede devolver un item por hilo (con sus mensajes) o un item por mensaje: se agrupan por hilo
const grupos = {};
for (const item of $input.all()) {
  const j = item.json;
  if (Array.isArray(j.messages)) {
    const t = j.id || (j.messages[0] || {}).threadId;
    grupos[t] = (grupos[t] || []).concat(j.messages);
  } else if (j.threadId) grupos[j.threadId] = (grupos[j.threadId] || []).concat([j]);
}

const salida = [];
for (const [threadId, mensajesHilo] of Object.entries(grupos)) {
  const info = hilos[threadId];
  if (!info) continue;
  const nuevos = mensajesHilo.filter(m => {
    const de = cabecera(m, 'From').toLowerCase();
    const etiquetas = m.labelIds || (m.labels || []).map(l => l.id);
    return m.id && !yaGuardados.has(m.id) && !(buzon && de.includes(buzon)) && !etiquetas.includes('SENT') && !etiquetas.includes('DRAFT');
  });
  if (!nuevos.length) continue;
  // Si hay varios mensajes nuevos, se clasifica el último
  const m = nuevos[nuevos.length - 1];
  const de = cabecera(m, 'From');
  const email = (de.match(/[^<\s]+@[^>\s]+/) || [''])[0].toLowerCase();
  salida.push({ json: { ...info, message_id: m.id, remitente: email || de, asunto: cabecera(m, 'Subject'), texto: texto(m), mensajes_nuevos: nuevos.length } });
}
return salida;
