// Mira si la página sigue enlazando al negocio, con qué rel y anchor, y si la página se puede indexar
const cfg = $('F · Leer Config').first().json;
const enlace = $('F · Uno por uno').item.json;
const html = String($json.html || '');
const fallo = $json.error ? String($json.error.message || $json.error).slice(0, 120) : (html ? '' : 'sin contenido');
const dominio = String(cfg.negocio_dominio || '').trim().toLowerCase();
const limpiar = u => String(u || '').trim().toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/[#?].*$/, '').replace(/\/$/, '');

let encontrado = false, rel = '', anchor = '';
if (html && dominio) {
  const destino = limpiar(enlace.url_destino);
  for (const m of html.matchAll(/<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)) {
    const href = limpiar(m[1]);
    if (!href.includes(dominio)) continue;
    // Si la fila exige una URL de destino concreta, solo cuenta ese enlace
    if (destino && href !== destino) continue;
    encontrado = true;
    rel = (m[0].match(/\brel=["']([^"']*)["']/i) || [, ''])[1];
    anchor = m[2].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 150);
    break;
  }
}
const noindex = /<meta[^>]+name=["']robots["'][^>]+noindex/i.test(html) || /<meta[^>]+content=["'][^"']*noindex[^"']*["'][^>]+name=["']robots["']/i.test(html);
const canon = (html.match(/<link[^>]+rel=["']canonical["'][^>]*href=["']([^"']+)["']/i) || html.match(/<link[^>]+href=["']([^"']+)["'][^>]*rel=["']canonical["']/i) || [, ''])[1];
const canonical_distinta = Boolean(canon) && limpiar(canon) !== limpiar(enlace.url_origen);

return { json: { ...enlace, encontrado, rel_visto: rel, anchor_visto: anchor, indexable: !noindex, canonical_distinta, fallo } };
