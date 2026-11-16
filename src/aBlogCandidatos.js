// Agrupa los posts del blog por idioma y quita los que ya están en el Sheet de recursos
const cfg = $('A · Leer Config').first().json;
const api = String(cfg.blog_api || '').trim();
if (!api) return [];
const idiomas = String(cfg.idiomas || 'es').split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
const raiz = api.split('/wp-json')[0].replace(/\/+$/, '');
const norm = u => String(u || '').trim().replace(/\/+$/, '').toLowerCase();
const yaEnSheet = new Set($('A · Leer recursos del Sheet').all().map(i => norm(i.json.url)).filter(Boolean));
const decodificar = t => String(t || '').replace(/&#(\d+);/g, (m, n) => String.fromCharCode(n))
  .replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&hellip;/g, '…').replace(/<[^>]+>/g, '').trim();

// Cada página llega como una lista o como un post por item, según n8n
const posts = $input.all().flatMap(i => Array.isArray(i.json) ? i.json : [i.json]).filter(p => p && p.id && p.link);
// Sin posts es que el blog no respondió (por ejemplo, el WAF): que salte el aviso de errores
if (!posts.length) throw new Error('No se pudo leer el blog en ' + api);

const porIdioma = {};
for (const p of posts) {
  // El idioma va en la ruta (/blog/it/…); sin prefijo, es el idioma principal
  const tramo = String(p.link).slice(raiz.length).split('/').filter(Boolean)[0] || '';
  const idioma = idiomas.includes(tramo) ? tramo : idiomas[0];
  if (yaEnSheet.has(norm(p.link))) continue;
  (porIdioma[idioma] = porIdioma[idioma] || []).push({ url: p.link, titulo: decodificar(p.title && p.title.rendered), fecha: String(p.modified || '').slice(0, 10) });
}

// A la IA, los 250 más recientes de cada idioma
return Object.entries(porIdioma).map(([idioma, lista]) => {
  lista.sort((a, b) => b.fecha.localeCompare(a.fecha));
  const top = lista.slice(0, 250);
  return { json: { idioma, total: lista.length, candidatos: top.map(x => x.url + ' | ' + x.titulo).join('\n'), urls: top.map(x => x.url) } };
});
