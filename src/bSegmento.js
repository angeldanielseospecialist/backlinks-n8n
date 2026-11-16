// Clasifica la web en el segmento de marketing: gran prensa (no se toca), pequeña prensa (lista de PR) o pyme (visto bueno y email)
const cfg = $('B · Leer Config').first().json;
const d = $input.item.json;
const num = v => (v === null || v === undefined || v === '') ? null : Number(v);
const granDr = num(cfg.gran_prensa_dr_min);
const granTrafico = num(cfg.gran_prensa_trafico_min);
const pymeMin = num(cfg.pyme_dr_min);
const pymeMax = num(cfg.pyme_dr_max);
const tipo = String(d.tipo_sitio || '').toLowerCase();

let segmento;
// Sin umbrales en la config, todo va al visto bueno como antes
if (granDr === null && granTrafico === null && pymeMin === null && pymeMax === null) segmento = 'sin_segmentar';
else if (tipo === 'medio') {
  const grande = (granDr !== null && d.dr >= granDr) || (granTrafico !== null && d.trafico_organico >= granTrafico);
  segmento = grande ? 'gran_prensa' : 'pequena_prensa';
} else if (tipo === 'empresa') {
  segmento = (d.dr >= (pymeMin ?? 0) && d.dr <= (pymeMax ?? 100)) ? 'pyme' : 'empresa_fuera_rango';
} else segmento = 'otro';

const destino = {
  pyme: { estado: 'pendiente_aprobacion', motivo: '' },
  sin_segmentar: { estado: 'pendiente_aprobacion', motivo: '' },
  pequena_prensa: { estado: 'lista_pr', motivo: '' },
  gran_prensa: { estado: 'descartado', motivo: 'gran_prensa' },
  empresa_fuera_rango: { estado: 'descartado', motivo: 'fuera_de_segmento' },
  otro: { estado: 'descartado', motivo: 'fuera_de_segmento' }
}[segmento];

return { json: { ...d, segmento, estado: destino.estado, motivo: destino.motivo, al_visto_bueno: destino.estado === 'pendiente_aprobacion' } };
