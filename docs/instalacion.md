# Instalación

Pasos para poner en marcha `backlinks-n8n` en tu propia instancia de n8n.

## Requisitos

- **n8n 2.x** con **Data Tables** (probado con la versión 2.47.7). Sirve una instancia en la
  nube, en un servidor propio o en local con Docker.
- **Node.js 18 o superior**, solo para ejecutar el script que prepara los workflows.
- Cuentas en los servicios que usa la automatización (ver el paso 5).

## 1. Crea las 6 Data Tables

En n8n, ve a **Overview → Data tables** y crea estas tablas con **exactamente** estos nombres.
Las columnas y su tipo están en [`data-tables/schema.json`](../data-tables/schema.json): crea cada
columna con su nombre y su tipo (`string` = texto, `number` = número, `boolean` = sí/no,
`date` = fecha). Las columnas `id`, `createdAt` y `updatedAt` las crea n8n solo.

| Tabla | Columnas |
|---|---|
| `backlinks_config` | 35 |
| `backlinks_dominios` | 20 |
| `backlinks_contactos` | 11 |
| `backlinks_mensajes` | 16 |
| `backlinks_enlaces` | 12 |
| `backlinks_log` | 7 |

> **Atajo:** si conectas el MCP de n8n a un asistente de IA (por ejemplo, Claude Code), puede
> crear las 6 tablas a partir de `schema.json` con la herramienta `create_data_table`.

**`modo_prueba` tiene que ser de tipo `boolean`.** El código solo escribe a personas reales si
vale exactamente `false`.

## 2. Rellena la configuración

Añade **una sola fila** a `backlinks_config` con los datos de tu empresa. Tienes los valores de
ejemplo en [`data-tables/config-plantilla.csv`](../data-tables/config-plantilla.csv) y la
explicación de cada columna en [`tables/backlinks_config.md`](./tables/backlinks_config.md).

Deja **`modo_prueba` activado (`true`)** hasta terminar las pruebas: así todos los emails van a
`email_pruebas` y no a personas reales.

## 3. Prepara los workflows con tus IDs

Cada instancia de n8n da IDs distintos a sus tablas, así que los workflows del repo llevan
marcadores. Para sustituirlos:

1. Copia `data-tables/ids.example.json` como `data-tables/ids.local.json` (git lo ignora).
2. Escribe en él el ID de cada tabla. Lo ves en la URL al abrir la tabla en n8n:
   `…/datatables/ESTE_ES_EL_ID`.
3. Ejecuta:

   ```bash
   node scripts/prepare-import.mjs
   ```

Se crea la carpeta `dist/` con los 3 workflows listos para importar.

## 4. Importa los workflows

En n8n, crea un workflow vacío y usa **⋮ → Import from File** para cada archivo de `dist/`,
en este orden:

1. `errores-backlinks.json` — avisa en Slack cuando algo falla.
2. `backlinks.json` — la automatización (7 ramas, 246 nodos).
3. `test-apis.json` — comprueba de una pasada que las conexiones responden.

Guarda cada uno con `Ctrl + S`. **No los actives todavía.** Después, en los ajustes de
`Backlinks` (⋮ → *Settings*), elige `Errores en backlinks` como *Error Workflow*.

## 5. Crea las credenciales

Crea en n8n estas credenciales y asígnalas en los nodos que las piden (el aviso aparece en
cada nodo):

| Credencial | Tipo en n8n | Para qué |
|---|---|---|
| Ahrefs API | Header Auth | Métricas y backlinks de cada web |
| Hunter API | Query Auth | Buscar y verificar emails |
| SerpAPI | Query Auth | Búsquedas en Google |
| Anthropic API Backlinks | Anthropic | La IA (Claude) |
| Slack Bot | Slack API | Avisos y formularios de aprobación |
| Gmail Backlinks | Gmail OAuth2 | Enviar y leer los emails |
| Google Sheets Backlinks | Google Sheets OAuth2 | El Google Sheet de recursos y de PR |
| Formulario enlaces Backlinks | Basic Auth | Proteger el formulario de alta de enlaces |

Para Gmail y Google Sheets con n8n en local, añade en Google Cloud Console la URI de
redirección `http://localhost:5678/rest/oauth2-credential/callback`.

## 6. Crea el Google Sheet

Sigue [`google-sheet.md`](./google-sheet.md) y selecciona el Sheet en los 4 nodos que lo usan:
*D · Leer recursos*, *A · Lista PR en el Sheet*, *A · Leer recursos del Sheet* y
*A · Blog: añadir al Sheet*.

## 7. Prueba y activa

1. Ejecuta `Test APIs` para comprobar las conexiones.
2. Revisa las [condiciones del email en frío](./condiciones-email-frio.md) con tu asesoría legal.
3. Activa `Errores en backlinks` y después `Backlinks`, con `modo_prueba` todavía en `true`.
4. Cuando todo funcione, cambia `modo_prueba` a `false`.

Si algo va mal, consulta el [interruptor de parada](./arquitectura.md#5-interruptor-de-parada).
