// Calcula el cupo de hoy (limite_diario menos los borradores ya hechos hoy) y elige los mejores: más relevancia y más autoridad primero
const cfg = $('C · Leer Config').first().json;
const zona = $('C · ¿Toca enviar?').first().json.zona;
const inicioHoy = $now.setZone(zona).startOf('day');
const mensajes = $('C · Leer mensajes').all().map(i => i.json).filter(m => m.id);
const hechosHoy = mensajes.filter(m => m.direccion === 'salida' && DateTime.fromISO(String(m.createdAt)).setZone(zona) >= inicioHoy).length;
const cupo = Math.max(0, Number(cfg.limite_diario || 0) - hechosHoy);
if (!cupo) return [];

// Idioma por defecto: el primero de la config
const idiomaBase = String(cfg.idiomas || 'es').split(',')[0].trim().toLowerCase();

const dominios = {};
for (const i of $('C · Leer dominios cualificados').all()) if (i.json.id) dominios[i.json.id] = i.json;
const contactos = $('C · Leer contactos listos').all().map(i => i.json).filter(c => c.id && c.email);

const elegidos = contactos.map(c => {
  const d = dominios[c.dominio_id] || {};
  const idioma = String(c.idioma || d.idioma || idiomaBase).toLowerCase();
  return {
    contacto_id: c.id, email: c.email, nombre: c.nombre || '', cargo: c.cargo || '', verificado: c.verificado || '',
    idioma, dominio_id: c.dominio_id, dominio_raiz: c.dominio_raiz, fuente: d.fuente || '',
    segmento: d.segmento || '', tipo_sitio: d.tipo_sitio || '',
    dr: Number(d.dr || 0), relevancia: Number(d.relevancia || 0), motivo_relevancia: d.motivo_relevancia || '',
    articulo_titulo: d.articulo_titulo || '', articulo_url: d.articulo_url || '', articulo_resumen: d.articulo_resumen || '',
    hechos_hoy: hechosHoy, cupo
  };
}).sort((a, b) => b.relevancia - a.relevancia || b.dr - a.dr).slice(0, cupo);

return elegidos.map(e => ({ json: e }));
