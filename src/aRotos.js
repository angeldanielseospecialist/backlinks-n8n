// Webs que enlazaban a páginas rotas de los competidores: su enlace ya no les sirve y se les puede proponer algo vivo
function raiz(valor) {
  let d = String(valor || '').trim().toLowerCase();
  d = d.replace(/^https?:\/\//, '').replace(/[\/?#:].*$/, '').replace(/^www\./, '');
  const partes = d.split('.');
  const sld = partes[partes.length - 2] || '';
  const tld = partes[partes.length - 1] || '';
  // co.uk, com.br, com.ar: la raíz tiene tres trozos
  if (partes.length > 2 && tld.length === 2 && ['co', 'com', 'org', 'net', 'gov', 'gob', 'edu', 'ac'].includes(sld)) return partes.slice(-3).join('.');
  return partes.slice(-2).join('.');
}

const conteo = {};
let llamadas = 0, errores = 0, coste = 0;
for (const item of $input.all()) {
  const r = item.json;
  if (r.error) { errores++; continue; }
  const filas = r.brokenBacklinks || r.broken_backlinks || r.backlinks;
  if (!Array.isArray(filas)) continue;
  llamadas++;
  // Coste medido: 2 unidades por fila, mínimo 50 por llamada
  coste += Math.max(50, filas.length * 2);
  const vistos = new Set();
  for (const b of filas) {
    const dominio = raiz(b.url_from || b.domain_from);
    if (!dominio || vistos.has(dominio)) continue;
    vistos.add(dominio);
    if (!conteo[dominio]) conteo[dominio] = { dominio, dr: 0 };
    conteo[dominio].dr = Math.max(conteo[dominio].dr, Number(b.domain_rating_source || 0));
  }
}

return [{ json: { fuente: 'enlace_roto', dominios: Object.values(conteo), llamadas, errores, coste_ahrefs: coste, busquedas: 0 } }];
