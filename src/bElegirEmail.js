// Primero los que Hunter ya tiene verificados; después, personas de contenido, prensa o alianzas; después, el de más confianza
const dominio = $('B · ¿Cabe en Hunter?').item.json;
const todos = ($input.item.json.data && $input.item.json.data.emails) || [];
// Hunter ya dice en la búsqueda si un email está verificado: los inválidos se quitan aquí, sin gastar la verificación
const estado = e => String((e.verification && e.verification.status) || '').toLowerCase();
const emails = todos.filter(e => estado(e) !== 'invalid');
const nota = e => estado(e) === 'valid' ? 2 : (estado(e) === 'accept_all' ? 1 : 0);
const cargosPreferidos = /editor|redac|content|contenido|prensa|press|comunic|marketing|seo|colabor|partner|alianza/i;

const ordenados = [...emails].sort((a, b) => {
  if (nota(a) !== nota(b)) return nota(b) - nota(a);
  const pa = cargosPreferidos.test(a.position || '') ? 1 : 0;
  const pb = cargosPreferidos.test(b.position || '') ? 1 : 0;
  if (pa !== pb) return pb - pa;
  return (b.confidence || 0) - (a.confidence || 0);
});
const mejor = ordenados[0] || {};

return { json: {
  id: dominio.id,
  dominio_raiz: dominio.dominio_raiz,
  idioma: dominio.idioma,
  email: mejor.value || '',
  email_nombre: [mejor.first_name, mejor.last_name].filter(Boolean).join(' '),
  email_cargo: mejor.position || '',
  email_confianza: mejor.confidence || 0,
  emails_encontrados: todos.length
} };