// Añade a la lista de bloqueo los dominios que pidieron la baja o dinero, sin repetir ninguno
const cfg = $('D · Leer Config').first().json;
const actual = String(cfg.lista_bloqueo || '').split(/[,\n]/).map(s => s.trim().toLowerCase()).filter(Boolean);
const nuevos = $input.all().map(i => String(i.json.dominio_raiz || '').toLowerCase()).filter(Boolean);
const lista = [...new Set([...actual, ...nuevos])];
return [{ json: { id: cfg.id, lista_bloqueo: lista.join(','), anadidos: nuevos } }];
