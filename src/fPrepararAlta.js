// Valida el alta del formulario, evita duplicados y la enlaza con su contacto
const f = $('F · Formulario de alta').first().json;
const campo = (...k) => { for (const x of k) if (f[x] != null && String(f[x]).trim()) return String(f[x]).trim(); return ''; };
const origen = campo('url_origen', 'Página que nos enlaza');
const destino = campo('url_destino', 'Página nuestra a la que apunta (opcional)');
const email = campo('email_contacto', 'Email del contacto (opcional)').toLowerCase();
const nota = campo('nota', 'Nota (opcional)');

// Solo direcciones web públicas: así nadie puede hacer que la rama F visite el servidor por dentro
// (sin new URL(): el entorno de los nodos Code de n8n no lo tiene)
const servidor = u => { const m = String(u || '').trim().match(/^https?:\/\/([^\/?#:\s]+)(:\d+)?([\/?#]\S*)?$/i); return m ? m[1].toLowerCase() : ''; };
const valida = u => {
  const h = servidor(u);
  return h.includes('.') && !/^[\d.]+$/.test(h) && !/(^|\.)(localhost|local|internal)$/.test(h);
};
const norm = u => String(u || '').trim().replace(/\/+$/, '').toLowerCase();
const enlaces = $('F · Leer enlaces (alta)').all().map(i => i.json).filter(e => e.id);
let error = '';
if (!valida(origen)) error = 'la página que nos enlaza no es una dirección web válida (tiene que empezar por https://)';
else if (destino && !valida(destino)) error = 'la página nuestra no es una dirección web válida';
else if (enlaces.some(e => norm(e.url_origen) === norm(origen))) error = 'ese enlace ya estaba dado de alta';

// El contacto: primero por su email; si no, por la web
const dom = servidor(origen).replace(/^www\./, '');
const contactos = $('F · Leer contactos (alta)').all().map(i => i.json).filter(c => c.id);
const c = (email && contactos.find(x => String(x.email || '').toLowerCase() === email))
  || contactos.find(x => dom && x.dominio_raiz && (dom === x.dominio_raiz || dom.endsWith('.' + x.dominio_raiz)));

const mensaje = error
  ? ':warning: *Alta de enlace rechazada*: ' + error + '\n• Enviado: ' + (origen || '(vacío)')
  : ':link: *Enlace dado de alta*\n• Página: ' + origen +
    (destino ? '\n• Apunta a: ' + destino : '') +
    '\n• Contacto: ' + (c ? c.email + ' (id ' + c.id + ')' : 'ninguno encontrado') +
    (nota ? '\n• Nota: ' + nota : '') +
    '\nLa rama F lo comprobará el domingo.';
return [{ json: { valido: !error, error, mensaje, url_origen: origen, url_destino: destino, nota, contacto_id: c ? c.id : null, dominio_id: c ? c.dominio_id : null, dominio_raiz: c ? c.dominio_raiz : dom } }];
