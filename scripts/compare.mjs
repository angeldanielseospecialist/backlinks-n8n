#!/usr/bin/env node
// Compara dos versiones de un workflow de n8n y dice qué cambió:
// nodos nuevos o que faltan, parámetros y ajustes distintos y conexiones.
//
// Uso: node scripts/compare.mjs <antes.json> <despues.json>
// Ejemplo: comparar workflows/backlinks.json con una exportación de tu n8n.
//
// Los nodos se emparejan por su nombre. Los IDs internos (id, webhookId) y las
// Data Tables se ignoran, porque cambian en cada instancia de n8n.

import fs from 'node:fs';

const [rutaAntes, rutaDespues] = process.argv.slice(2);
if (!rutaAntes || !rutaDespues) {
  console.error('Uso: node scripts/compare.mjs <antes.json> <despues.json>');
  process.exit(1);
}

const leer = f => { const j = JSON.parse(fs.readFileSync(f, 'utf8')); return Array.isArray(j) ? j[0] : (j.workflow || j); };
const antes = leer(rutaAntes);
const despues = leer(rutaDespues);

const AJUSTES = ['type', 'typeVersion', 'position', 'executeOnce', 'retryOnFail', 'waitBetweenTries', 'onError', 'alwaysOutputData', 'disabled'];
const orden = o => Array.isArray(o) ? o.map(orden) : (o && typeof o === 'object' ? Object.fromEntries(Object.keys(o).sort().map(k => [k, orden(o[k])])) : o);
// La Data Table se compara por su nombre, no por su ID
const sinIds = p => JSON.parse(JSON.stringify(p, (k, v) => (k === 'dataTableId' && v && typeof v === 'object') ? v.cachedResultName : v));
const igual = (a, b) => JSON.stringify(orden(a)) === JSON.stringify(orden(b));

const A = Object.fromEntries(antes.nodes.map(n => [n.name, n]));
const B = Object.fromEntries(despues.nodes.map(n => [n.name, n]));
const informe = { nodos_antes: antes.nodes.length, nodos_despues: despues.nodes.length, faltan: [], nuevos: [], distintos: [] };

for (const k of Object.keys(A)) if (!B[k]) informe.faltan.push(k);
for (const k of Object.keys(B)) if (!A[k]) informe.nuevos.push(k);
for (const k of Object.keys(A)) {
  if (!B[k]) continue;
  const difs = [];
  if (!igual(sinIds(A[k].parameters), sinIds(B[k].parameters))) difs.push('parameters');
  for (const s of AJUSTES) if (!igual(A[k][s], B[k][s])) difs.push(`${s}: ${JSON.stringify(A[k][s])} → ${JSON.stringify(B[k][s])}`);
  if (difs.length) informe.distintos.push(`${k} · ${difs.join(' · ')}`);
}

// Conexiones como aristas "origen[salida] → destino[entrada] (tipo)"
const aristas = w => {
  const s = new Set();
  for (const [o, porTipo] of Object.entries(w.connections || {}))
    for (const [tipo, salidas] of Object.entries(porTipo))
      (salidas || []).forEach((lista, i) => (lista || []).forEach(c => s.add(`${o}[${i}] → ${c.node}[${c.index}] (${tipo})`)));
  return s;
};
const ea = aristas(antes), eb = aristas(despues);
informe.conexiones_quitadas = [...ea].filter(x => !eb.has(x));
informe.conexiones_nuevas = [...eb].filter(x => !ea.has(x));

console.log(JSON.stringify(informe, null, 1));
