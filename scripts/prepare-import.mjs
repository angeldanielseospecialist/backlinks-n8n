#!/usr/bin/env node
// Genera en dist/ los workflows listos para importar en TU n8n.
//
// Los JSON de workflows/ llevan marcadores en vez de los IDs de las Data Tables
// (por ejemplo "__DATA_TABLE_backlinks_config__"), porque cada instancia de n8n
// genera IDs distintos. Este script sustituye cada marcador por el ID real.
//
// Uso:
//   1. Copia data-tables/ids.example.json como data-tables/ids.local.json
//   2. Escribe en él el ID de cada una de tus 6 Data Tables
//   3. node scripts/prepare-import.mjs [ruta-al-archivo-de-ids]
//
// Sin dependencias: solo necesita Node.js 18 o superior.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIR_WORKFLOWS = path.join(RAIZ, 'workflows');
const DIR_SALIDA = path.join(RAIZ, 'dist');
const RUTA_SCHEMA = path.join(RAIZ, 'data-tables', 'schema.json');
const RUTA_IDS = path.resolve(process.argv[2] || path.join(RAIZ, 'data-tables', 'ids.local.json'));

const MARCADOR = /^__DATA_TABLE_([a-z_]+)__$/;

function fallar(mensaje) {
  console.error(`\n✖ ${mensaje}\n`);
  process.exit(1);
}

// 1. Leer las tablas esperadas y los IDs del usuario
const tablas = JSON.parse(fs.readFileSync(RUTA_SCHEMA, 'utf8')).tables.map(t => t.name);

if (!fs.existsSync(RUTA_IDS)) {
  fallar(`No encuentro ${path.relative(RAIZ, RUTA_IDS)}.\n` +
    '  Cópialo desde data-tables/ids.example.json y escribe el ID de cada Data Table.');
}
const ids = JSON.parse(fs.readFileSync(RUTA_IDS, 'utf8'));

const faltan = tablas.filter(t => typeof ids[t] !== 'string' || !/^[A-Za-z0-9]{8,}$/.test(ids[t]));
if (faltan.length) {
  fallar(`Falta un ID válido para: ${faltan.join(', ')}.\n` +
    '  Lo ves en la URL de cada tabla en n8n (Overview → Data tables → abre la tabla).');
}

// 2. Sustituir los marcadores en cada workflow
fs.mkdirSync(DIR_SALIDA, { recursive: true });
const archivos = fs.readdirSync(DIR_WORKFLOWS).filter(f => f.endsWith('.json'));
let total = 0;

for (const archivo of archivos) {
  const workflow = JSON.parse(fs.readFileSync(path.join(DIR_WORKFLOWS, archivo), 'utf8'));
  let cambios = 0;

  for (const nodo of workflow.nodes) {
    const ref = nodo.parameters?.dataTableId;
    if (!ref || typeof ref.value !== 'string') continue;
    const m = ref.value.match(MARCADOR);
    if (!m) fallar(`${archivo} · nodo "${nodo.name}": esperaba un marcador y encontré "${ref.value}".`);
    if (!tablas.includes(m[1])) fallar(`${archivo} · nodo "${nodo.name}": tabla desconocida "${m[1]}".`);
    ref.value = ids[m[1]];
    cambios++;
  }

  const salida = JSON.stringify(workflow, null, 2);
  if (salida.includes('__DATA_TABLE_')) fallar(`${archivo}: ha quedado algún marcador sin sustituir.`);
  fs.writeFileSync(path.join(DIR_SALIDA, archivo), salida + '\n');
  console.log(`✔ ${archivo.padEnd(24)} ${String(cambios).padStart(3)} referencias a Data Tables`);
  total += cambios;
}

console.log(`\nListo: ${archivos.length} workflows en dist/ (${total} referencias).`);
console.log('Impórtalos en n8n en este orden: errores-backlinks.json, backlinks.json y test-apis.json.');
