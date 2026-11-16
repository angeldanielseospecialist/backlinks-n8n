// Normaliza cada web, quita lo que nunca se contacta y ordena por prioridad de la fuente
const cfg = $('A · Leer Config').first().json;
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
const lista = s => String(s || '').split(/[,\n]/).map(x => raiz(x)).filter(Boolean);
const propio = raiz(cfg.negocio_dominio);
const bloqueo = new Set(lista(cfg.lista_bloqueo));
const competidores = new Set(lista(cfg.competidores));

// Plataformas donde no hay una redacción a la que escribir
const plataformas = new Set([
  // Redes, buscadores y grandes servicios
  'google.com', 'youtube.com', 'facebook.com', 'instagram.com', 'twitter.com', 'x.com', 'linkedin.com', 'tiktok.com', 'reddit.com', 'pinterest.com', 'quora.com', 't.me', 'telegram.me', 'telegram.org', 'whatsapp.com', 'discord.com', 'discord.gg', 'threads.net', 'bsky.app', 'apple.com', 'microsoft.com', 'amazon.com', 'bing.com', 'yahoo.com', 'duckduckgo.com', 'ya.ru', 'deviantart.com', 'reverso.net', 'uptodown.com', 'setapp.com',
  // Enciclopedias y archivos
  'wikipedia.org', 'wikimedia.org', 'wikidata.org', 'grokipedia.com', 'archive.org', 'mdpi.com',
  // Blogs y webs alojadas en plataformas
  'medium.com', 'substack.com', 'wordpress.com', 'blogspot.com', 'tumblr.com', 'github.com', 'gitlab.com', 'github.io', 'netlify.app', 'vercel.app', 'pages.dev', 'web.app', 'firebaseapp.com', 'webflow.io', 'framer.app', 'framer.website', 'notion.site', 'ghost.io', 'beehiiv.com', 'kit.com', 'weebly.com', 'jouwweb.nl', 'neocities.org', 'hostingersite.com', 'mintlify.app', 'gitbooks.io', 'teletype.in', 'steemit.com', 'publish0x.com', 'slides.com', 'free.fr', 'eu.com',
  // Páginas de enlaces y acortadores
  'onelink.me', 'beacons.ai', 'rebrand.ly', 'goo.gl', 'bit.ly', 'linktr.ee', 'njump.me', 'uwpagina.nl', 'jouwpagina.nl', 'startkabel.nl', 'beginthier.nl',
  // Herramientas, soporte y podcasts
  'zendesk.com', 'freshdesk.com', 'tawk.help', 'instatus.com', 'pocketcasts.com', 'buzzsprout.com', 'spreaker.com', 'podimo.com', 'ausha.co', 'goodpods.com', 'poddtoppen.se', 'vimeo.com', 'spotify.com', 'soundcloud.com',
  // Directorios de empresas, reseñas y datos
  'trustpilot.com', 'crunchbase.com', 'cbinsights.com', 'f6s.com', 'theorg.com', 'craft.co', 'leadiq.com', 'prospeo.io', 'brandfetch.com', 'appsruntheworld.com', 'seedtable.com', 'gust.com', 'trustprofile.com', 'verif.com', 'scamadviser.com', 'trustburn.com', 'glassdoor.com', 'indeed.com', 'g2.com', 'capterra.com', 'producthunt.com', 'similarweb.com', 'ahrefs.com', 'semrush.com',
  // Tiendas de tarjetas regalo
  'eneba.com', 'g2a.com'
]);
// Granjas de enlaces que se delatan por el nombre
const granja = /directory|backlink|guestpost|linkadvice|seo-|-seo|-ranking|ranking-|ranks\.com$/;

const prioridad = { mencion: 1, competidor: 2, enlace_roto: 3, serpapi: 4 };
const mejor = {};
for (const item of $input.all()) {
  const f = item.json;
  for (const d of (f.dominios || [])) {
    const dominio_raiz = raiz(d.dominio);
    if (!/^[a-z0-9-]+(\.[a-z0-9-]+)*\.[a-z]{2,}$/.test(dominio_raiz)) continue;
    if (dominio_raiz === propio || bloqueo.has(dominio_raiz) || competidores.has(dominio_raiz)) continue;
    if (plataformas.has(dominio_raiz) || dominio_raiz.startsWith('google.') || granja.test(dominio_raiz)) continue;
    const nuevo = { dominio_raiz, fuente: f.fuente, prioridad: prioridad[f.fuente] || 9, n_competidores: Number(d.n_competidores || 0), dr: Number(d.dr || 0) };
    const previo = mejor[dominio_raiz];
    if (!previo) { mejor[dominio_raiz] = nuevo; continue; }
    // Si sale en varias fuentes, se queda la de más prioridad y los mejores datos
    const n = Math.max(previo.n_competidores, nuevo.n_competidores);
    const dr = Math.max(previo.dr, nuevo.dr);
    if (nuevo.prioridad < previo.prioridad) mejor[dominio_raiz] = nuevo;
    mejor[dominio_raiz].n_competidores = n;
    mejor[dominio_raiz].dr = dr;
  }
}

// Techo de DR: por encima, la rama B descarta la web sea medio (gran prensa) o empresa (fuera de segmento)
const num = v => (v === null || v === undefined || v === '') ? null : Number(v);
const pymeMax = num(cfg.pyme_dr_max);
const granDr = num(cfg.gran_prensa_dr_min);
const techo = (pymeMax === null || granDr === null) ? null : Math.max(pymeMax, granDr - 1);

// Las webs sin DR conocido (menciones y búsquedas) pasan: las mide la rama B
const candidatos = Object.values(mejor)
  .filter(c => techo === null || !c.dr || c.dr <= techo)
  .sort((a, b) => a.prioridad - b.prioridad || b.n_competidores - a.n_competidores || b.dr - a.dr);
return candidatos.map(c => ({ json: c }));
