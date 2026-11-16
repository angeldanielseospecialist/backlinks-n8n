// Rellena la cola solo hasta el tope. Los huecos se reparten por turnos entre las fuentes, para que ninguna se los quede todos
const cfg = $('A · Leer Config').first().json;
const enCola = $('A · Leer cola actual').all().filter(i => i.json.id).length;
const tope = Number(cfg.limite_cola_prospectos) || 7 * Number(cfg.limite_cualificacion_diario || 5);
const huecos = Math.max(0, tope - enCola);
const nuevos = $input.all().map(i => i.json).filter(c => c.dominio_raiz);

// Banda de DR que sirve sea medio o empresa: desde el mínimo de pyme hasta justo antes de gran prensa
const num = v => (v === null || v === undefined || v === '') ? null : Number(v);
const desde = num(cfg.pyme_dr_min);
const granDr = num(cfg.gran_prensa_dr_min);
const hasta = Math.min(num(cfg.pyme_dr_max) ?? 100, granDr === null ? 100 : granDr - 1);
const enBanda = c => (desde !== null && c.dr >= desde && c.dr <= hasta) ? 1 : 0;
nuevos.sort((a, b) => a.prioridad - b.prioridad || enBanda(b) - enBanda(a) || b.n_competidores - a.n_competidores || b.dr - a.dr);

// Una lista por fuente, en orden de prioridad; en cada vuelta entra la mejor web de cada una
const porFuente = {};
for (const c of nuevos) (porFuente[c.fuente] = porFuente[c.fuente] || []).push(c);
const listas = Object.values(porFuente);
const elegidos = [];
while (elegidos.length < huecos && listas.some(l => l.length)) {
  for (const l of listas) {
    if (l.length && elegidos.length < huecos) elegidos.push(l.shift());
  }
}
return elegidos.map(c => ({ json: c }));
