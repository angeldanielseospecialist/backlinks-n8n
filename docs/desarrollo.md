# Cómo modificar el workflow

Guía para quien quiera cambiar la automatización o contribuir al repositorio.

## Qué hay en cada carpeta

| Carpeta | Para qué |
|---|---|
| [`workflows/`](../workflows/) | Los 3 workflows **con marcadores** en vez de IDs de Data Tables y credenciales. Es la fuente de verdad del repo |
| [`src/`](../src/) | Copia legible de los 36 prompts y nodos *Code* del workflow `Backlinks`, uno por archivo. Sirve para leerlos, buscarlos y revisar cambios con git |
| [`scripts/prepare-import.mjs`](../scripts/prepare-import.mjs) | Sustituye los marcadores por los IDs de tus Data Tables y genera `dist/` |
| [`scripts/compare.mjs`](../scripts/compare.mjs) | Compara dos versiones de un workflow: nodos nuevos o que faltan, parámetros, ajustes y conexiones |

Los archivos de `src/` empiezan por la letra de su rama (`aPreparar.js` es de la rama A,
`cPrompt.txt` es el prompt de la rama C).

## Formas de cambiar el workflow

- **Cambio pequeño:** a mano en el lienzo de n8n.
- **Un prompt:** pégalo en el campo *Prompt* del nodo **sin** el `=` inicial que lleva la copia
  de `src/`.
- **Varios nodos nuevos:** escribe un JSON `{ "nodes": [...], "connections": {...} }` y pégalo en
  el lienzo con `Ctrl + V`. Las flechas hacia nodos que ya existen se dibujan a mano y las
  credenciales se eligen en cada nodo.
- **Cambio grande:** modifica el JSON e impórtalo (⋮ → *Import from File*). Pruébalo antes en un
  workflow desechable.

## Llevar tus cambios al repositorio

1. En n8n, descarga el workflow (⋮ → *Download*) y guárdalo en una carpeta `exports/`, que git
   ignora.
2. Compáralo con la versión del repo para ver qué cambió:

   ```bash
   node scripts/compare.mjs workflows/backlinks.json exports/Backlinks.json
   ```

3. Antes de copiarlo a `workflows/`, **deja la exportación como plantilla**:
   - sustituye el `value` de cada `dataTableId` por su marcador, `__DATA_TABLE_<nombre_de_la_tabla>__`;
   - sustituye el `id` de cada credencial por su marcador (por ejemplo, `__CREDENTIAL_SLACK__`) y
     conserva su `name`;
   - borra los campos `id` y `versionId` de la raíz, el bloque `meta` y el contenido de `pinData`.
4. Si cambiaste un prompt o un nodo *Code*, actualiza también su copia en `src/`.
5. Comprueba que no queda ningún dato tuyo (correos, dominios, IDs de tu instancia) antes de
   hacer el commit.

## Trampas del importador de n8n

- Cada nodo necesita su campo `type`. Al generar nodos con herramientas externas, revisa los
  `if`, `splitInBatches` y `merge`: a veces no lo traen.
- Si una credencial no existe en tu instancia, n8n la quita del nodo al importar sin dar error.
  El nodo queda esperando a que elijas una credencial tuya.
- n8n puede regenerar el ID interno de un formulario (`webhookId`) para que no choque con otro.
  La dirección del formulario (`path`) no cambia.
