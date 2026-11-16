# AGENTS.md

Contexto para asistentes de IA (Claude Code, Codex, Cursor, Gemini CLI…) que trabajen con este
repositorio. Léelo entero antes de cambiar nada. Responde al usuario en su idioma; la
documentación del repo está en español.

## Primer contacto: qué hacer cuando el usuario abre el repo

Si el usuario acaba de clonar el repo, o pide ayuda sin concretar ("ayúdame", "¿cómo empiezo?",
"instálalo"), **no esperes instrucciones detalladas: ofrécele la instalación guiada** de la
sección siguiente. Antes, mira si existe `setup-progress.local.md` en la raíz:

- **Si existe**, es una instalación a medias: léelo, resume en una frase dónde se quedó y
  pregunta si seguís desde ahí.
- **Si no existe**, pregúntale qué quiere hacer:
  1. **Instalar** la automatización en su n8n → [instalación guiada](#instalación-guiada).
  2. **Entender** cómo funciona → resúmele [`docs/arquitectura.md`](docs/arquitectura.md) y el
     [índice de ramas](docs/branches/README.md), y ofrece profundizar en la rama que le interese.
  3. **Modificar** algo → sigue [Tareas frecuentes](#tareas-frecuentes) y
     [`docs/desarrollo.md`](docs/desarrollo.md).

## Instalación guiada

Llevas al usuario de cero a una instalación funcionando **en modo prueba**. Es la versión
interactiva de [`docs/instalacion.md`](docs/instalacion.md).

### Cómo conducirla

- **Un paso cada vez.** Haz como mucho 2 o 3 preguntas a la vez y espera la respuesta.
- **Antes de cada acción**, di en una frase qué vas a hacer y por qué. **Después**, compruébalo y
  enséñale el resultado. No pases al paso siguiente hasta que el actual esté verificado.
- **Pide confirmación** antes de crear, modificar o borrar algo en su n8n o en sus archivos.
- **Adáptate a su nivel.** Si no conoce un concepto (Data Table, credencial, MCP), explícalo con
  una frase y un ejemplo.
- **Lleva el progreso** en `setup-progress.local.md` (git lo ignora): una casilla por paso, las
  decisiones que tomó y los IDs de sus tablas. Actualízalo al terminar cada paso. Si la sesión se
  corta, ese archivo permite retomarla.
- **Si algo falla**, detente, explica el error en lenguaje llano y propón una solución. No
  improvises cambios en cadena.

### Paso 1 · Entorno

Comprueba tú mismo lo que puedas y pregunta el resto:

| Comprobación | Cómo | Si falla |
|---|---|---|
| Node.js 18 o superior | `node -v` | Pídele que lo instale desde nodejs.org; solo hace falta para `prepare-import.mjs` |
| Dónde está su n8n | Pregunta: ¿n8n Cloud, servidor propio o en su ordenador? ¿Cuál es su URL? | Si no tiene, ofrece n8n en local con Docker (ver abajo) |
| n8n responde | Si es local: `curl http://localhost:5678/healthz` → `{"status":"ok"}` | ¿Docker abierto? ¿Contenedor encendido? |
| Versión de n8n | Pregunta o mírala en *Help → About n8n*. Necesita **2.x con Data Tables** | Que actualice n8n antes de seguir |
| MCP de n8n conectado | Mira si tienes herramientas como `search_data_tables` o `create_data_table` | Ofrece conectarlo (ver abajo). Es opcional: sin él, los pasos 3, 4 y 6 se hacen a mano en la interfaz |

**n8n en local con Docker** (si no tiene n8n): necesita Docker Desktop. Un `docker-compose.yml`
mínimo:

```yaml
services:
  n8n:
    image: docker.n8n.io/n8nio/n8n:latest
    container_name: n8n-local
    restart: unless-stopped
    ports: ["5678:5678"]
    environment:
      - GENERIC_TIMEZONE=Europe/Madrid
      - TZ=Europe/Madrid
      - N8N_SECURE_COOKIE=false
      - WEBHOOK_URL=http://localhost:5678/
    volumes: ["n8n_data:/home/node/.n8n"]
volumes:
  n8n_data:
```

Arranca con `docker compose up -d` y se abre en `http://localhost:5678`. Ajusta la zona horaria a
la suya. Explícale que sus datos viven en el volumen `n8n_data` y que no debe borrarlo.

**Conectar el MCP de n8n:** en n8n, *Settings → MCP* (o *Instance-level MCP*) muestra la dirección
del servidor. En Claude Code:
`claude mcp add --transport http n8n <URL_DE_SU_N8N>/mcp-server/http` y después `/mcp` para
autorizar con OAuth. La autorización la completa el usuario en su navegador.

### Paso 2 · Cuentas y servicios

Pregunta qué cuentas tiene ya. Necesitará todas para que la automatización funcione entera, pero
puede instalar ahora y conectarlas después:

| Servicio | Para qué | Nota |
|---|---|---|
| Ahrefs (API) | Métricas, backlinks de la competencia, enlaces rotos | Es el servicio más caro |
| Hunter | Buscar y verificar emails | El plan gratuito da unas 30 webs al mes |
| SerpAPI | Búsquedas en Google | Tiene plan gratuito |
| Anthropic | La IA (Claude) | Prepago |
| Slack | Avisos y formularios de aprobación | Necesita un canal para los avisos |
| Gmail y Google Sheets | Enviar y leer emails; el Sheet de marketing | OAuth con Google Cloud |

Anota en el progreso cuáles tiene y cuáles faltan.

### Paso 3 · Data Tables

1. Comprueba que no existan ya tablas con estos nombres (MCP: `search_data_tables`). Si existen,
   **pregunta** antes de tocar nada: puede ser una instalación anterior con datos.
2. Crea las 6 tablas de [`data-tables/schema.json`](data-tables/schema.json) con sus nombres y
   tipos exactos. Con MCP: `get_user_preferences`, `search_projects` y `create_data_table` por
   tabla. Sin MCP: guíale tabla por tabla en *Overview → Data tables*.
3. Verifica nombres, número de columnas (35, 20, 11, 16, 12 y 7) y tipos. **`modo_prueba` debe ser
   `boolean`.**
4. Guarda los 6 IDs en el progreso.

### Paso 4 · Configuración de su empresa

Rellena la única fila de `backlinks_config` **entrevistándole**. Parte de
[`data-tables/config-plantilla.csv`](data-tables/config-plantilla.csv) y pregunta por bloques:

1. **Negocio:** nombre comercial (`negocio_nombre`), dominio (`negocio_dominio`), de qué va y qué
   temas excluir (`tematica`), mercados (`mercados`) e idiomas en los que escribirá (`idiomas`).
2. **Dónde buscar:** 3 a 7 competidores (`competidores`), búsquedas tipo "escribe para nosotros"
   + su temática en cada idioma (`busquedas_serpapi`, separadas por `|`) y webs que nunca quiere
   contactar (`lista_bloqueo`).
3. **Envío:** buzón de Gmail desde el que escribirá (`mailbox`), buzón de pruebas
   (`email_pruebas`), firma (`firma_email`, líneas separadas por `|`; la primera es el nombre del
   remitente), canal de Slack (`canal_slack`), días y horario de envío (`ventana_envio`, formato
   `L,M,X,J,V 08:00-18:00 Europe/Madrid`) y URL de la API de su blog de WordPress (`blog_api`,
   opcional).
4. **Listones:** explica los valores de la plantilla y pregunta si quiere cambiar alguno. Sugiere
   `pyme_dr_min` y `pyme_dr_max` en torno al DR de su propio dominio (unos ±15 puntos). La
   explicación de cada columna está en [`docs/tables/backlinks_config.md`](docs/tables/backlinks_config.md).

Enséñale la fila completa y, con su visto bueno, insértala (MCP: `add_data_table_rows`) con
**`modo_prueba = true`**, los números como números y las cadenas tal cual. Léela de vuelta para
comprobarla.

### Paso 5 · Preparar los workflows

1. Crea `data-tables/ids.local.json` a partir de `ids.example.json`, con los IDs del paso 3.
2. Ejecuta `node scripts/prepare-import.mjs`. Debe terminar con "79 referencias" y crear 3
   archivos en `dist/`.

### Paso 6 · Importar

La importación la hace **el usuario desde la interfaz**: crea un workflow vacío y usa
*⋮ → Import from File* con cada archivo de `dist/`, en este orden: `errores-backlinks.json`,
`backlinks.json` y `test-apis.json`. Que guarde cada uno con `Ctrl + S` y **no lo active**.

No recrees el workflow principal con herramientas de código del MCP: es demasiado grande y se
perderían credenciales y ajustes.

Verifica (MCP: `search_workflows` y `get_workflow_details`): los 3 existen, están desactivados y
tienen 3, 246 y 7 nodos. Después, que asigne `Errores en backlinks` como *Error Workflow* en los
ajustes de `Backlinks`.

### Paso 7 · Credenciales

Guíale para crear en n8n cada credencial de la tabla de
[`docs/instalacion.md`](docs/instalacion.md#5-crea-las-credenciales) y asignarla en los nodos que
la piden. **Nunca le pidas las claves en el chat:** se escriben solo en la interfaz de n8n. Para
Gmail y Google Sheets con n8n en local, recuérdale la URI de redirección
`http://localhost:5678/rest/oauth2-credential/callback` en Google Cloud Console.

Si le faltan cuentas, deja esas credenciales pendientes en el progreso y sigue.

### Paso 8 · Google Sheet

Que cree el Sheet según [`docs/google-sheet.md`](docs/google-sheet.md) (3 pestañas con sus
encabezados exactos), lo comparta con la cuenta de la credencial de Sheets y lo seleccione en los
4 nodos que lo usan: *D · Leer recursos*, *A · Lista PR en el Sheet*, *A · Leer recursos del
Sheet* y *A · Blog: añadir al Sheet*.

### Paso 9 · Comprobar las conexiones

Pídele que ejecute `Test APIs` (no gasta créditos) y revisa con él el resultado de cada nodo. Si
uno falla, suele ser una clave mal copiada o una credencial sin asignar.

### Paso 10 · Antes de activar

Resume lo instalado y lo pendiente. Después explícale:

- que debe revisar las [condiciones del email en frío](docs/condiciones-email-frio.md) con su
  asesoría legal antes de escribir a personas reales;
- el [interruptor de parada](docs/arquitectura.md#5-interruptor-de-parada);
- que activar `Errores en backlinks` y `Backlinks` pone en marcha los disparadores programados y
  **empieza a gastar créditos** (Ahrefs y SerpAPI los lunes, Hunter y Anthropic a diario).

**Activar es decisión suya.** No actives nada ni cambies `modo_prueba` a `false` por tu cuenta.
Recomiéndale una primera semana en modo prueba, revisando los avisos de Slack.

## Qué es

`backlinks-n8n` es una **plantilla de n8n** que automatiza una campaña de backlinks: prospección,
cualificación, outreach por email, lectura de respuestas, seguimiento y monitor de enlaces.
El repo no contiene código de aplicación: contiene **workflows de n8n en JSON**, el esquema de sus
Data Tables, dos scripts de Node.js sin dependencias y documentación.

## Mapa del repo

| Ruta | Qué es |
|---|---|
| `workflows/backlinks.json` | El workflow principal: 7 ramas (A-G), 246 nodos. **Fuente de verdad** |
| `workflows/errores-backlinks.json` | *Error Workflow*: escribe en `backlinks_log` y avisa en Slack |
| `workflows/test-apis.json` | Comprueba que las APIs responden, sin gastar créditos |
| `data-tables/schema.json` | Las 6 Data Tables con sus columnas y tipos (`string`, `number`, `boolean`, `date`) |
| `data-tables/config-plantilla.csv` | La fila de ejemplo de `backlinks_config` |
| `data-tables/ids.example.json` | Plantilla del archivo de IDs que usa `prepare-import.mjs` |
| `scripts/prepare-import.mjs` | Sustituye los marcadores de Data Tables por IDs reales y escribe `dist/` |
| `scripts/compare.mjs` | Diferencias entre dos versiones de un workflow (nodos, parámetros, conexiones) |
| `src/` | Copia de los 36 prompts (`*Prompt.txt`) y nodos *Code* (`*.js`) del workflow, uno por archivo. La primera letra es la rama |
| `docs/arquitectura.md` | Máquina de estados, reglas de datos, interruptor de parada y riesgos |
| `docs/branches/`, `docs/tables/` | Una página por rama y por tabla |
| `docs/instalacion.md`, `docs/desarrollo.md` | Instalación paso a paso; cómo modificar y contribuir |
| `ROADMAP.md` | Mejoras previstas de la automatización |
| `CONTRIBUTING.md` | Flujo de ramas (los PR van a `develop`), reglas y mensajes de commit |

## Conceptos clave

- **Un workflow, 7 ramas.** Cada rama tiene su disparador y sus nodos llevan el prefijo de su
  letra: `B · Leer Config`, `C · Enviar email`… Las ramas **no se conectan entre sí**: se pasan el
  trabajo a través del **estado** de cada fila en las Data Tables.
- **Configuración en una sola fila.** Todo lo del negocio vive en la única fila de
  `backlinks_config`; los nodos *Leer Config* leen la primera. Nada del negocio va escrito en los
  nodos.
- **Estados como texto libre.** n8n no valida los estados (`prospecto`, `listo_para_enviar`,
  `negociando`…). Un estado mal escrito deja la fila invisible sin aviso. Cópialos de
  `docs/tables/`.
- **`modo_prueba`** es una columna `boolean`. El código solo escribe a personas reales si vale
  exactamente `false` (`cfg.modo_prueba !== false` = modo prueba).
- **Aprobación humana:** las ramas B, C y E esperan un formulario de Slack antes de gastar
  créditos o enviar emails.

## Marcadores en los workflows

Los JSON de `workflows/` no llevan IDs de ninguna instancia de n8n:

| Dato | Marcador | Quién lo sustituye |
|---|---|---|
| ID de Data Table | `__DATA_TABLE_<nombre_de_la_tabla>__` (en `parameters.dataTableId.value`) | `scripts/prepare-import.mjs` |
| ID de credencial | `__CREDENTIAL_<SERVICIO>__` (en `credentials.<tipo>.id`; el `name` se conserva) | Nadie: n8n quita la credencial al importar y el usuario elige la suya |

Tampoco llevan `id` ni `versionId` en la raíz, bloque `meta`, `pinData` con datos ni notas
adhesivas: la documentación vive en `docs/`.

## Reglas que no se rompen

1. **Ningún dato real en el repo.** Nada de correos, dominios, nombres de personas, IDs de
   instancia, URLs de una instancia concreta, claves ni datos de las tablas de alguien. Usa
   marcadores neutros: `Mi Empresa`, `miempresa.com`, `nombre@ejemplo.com`, `tu-n8n.com`. Los
   datos del usuario van solo a archivos ignorados por git (`*.local.json`, `*.local.md`).
2. **`workflows/` siempre con marcadores.** Si el usuario trae una exportación de su n8n,
   conviértela en plantilla antes de copiarla (ver `docs/desarrollo.md`). Nunca subas `dist/`,
   `data-tables/ids.local.json`, `setup-progress.local.md` ni `exports/`.
3. **No actives, publiques ni ejecutes workflows** en la instancia del usuario, ni cambies
   `modo_prueba` a `false`, sin su confirmación explícita. Antes de ejecutar algo que gaste
   créditos (Ahrefs, Hunter, SerpAPI, Anthropic) o envíe mensajes, dile qué gastará.
4. **Nunca pidas ni escribas claves de API** en el chat ni en archivos del repo. Las credenciales
   se crean en la interfaz de n8n.
5. **Mantén `src/` sincronizado.** Si cambias un prompt o un nodo *Code* en
   `workflows/backlinks.json`, actualiza su copia en `src/` (y al revés). El contenido de `src/`
   es literal: los prompts empiezan por `=`, igual que en el nodo.
6. **No renombres nodos, tablas ni columnas** sin buscar antes todas sus referencias: las
   expresiones de n8n usan nombres (`$('C · Leer Config')`) y los nodos de Data Tables usan
   nombres de columna.
7. **Si cambias el comportamiento, actualiza la documentación** afectada en `docs/` y, si aplica,
   el README (en sus dos idiomas).

## Tareas frecuentes

### Cambiar un prompt o un nodo *Code*

1. Busca el archivo en `src/` y el nodo en `workflows/backlinks.json` (mismo contenido).
2. Cambia los dos. Mantén las expresiones `{{ ... }}` y los nombres de nodo exactos.
3. Comprueba que el JSON sigue siendo válido y compara con `scripts/compare.mjs`.

### Llevar al repo cambios hechos en n8n

1. El usuario descarga el workflow (⋮ → *Download*) en `exports/`.
2. `node scripts/compare.mjs workflows/backlinks.json exports/<archivo>.json` para ver qué cambió.
3. Conviértelo en plantilla (marcadores, sin `meta`, `id`, `versionId` ni `pinData`) y repite la
   verificación de abajo antes de sustituir el archivo de `workflows/`.

### Diagnosticar un fallo

Mira la ejecución fallida (con el MCP: `search_workflow_executions` y `get_workflow_execution`),
la fila de error en `backlinks_log` y ejecuta `Test APIs` para descartar una clave o un saldo
agotado. El interruptor de parada está en `docs/arquitectura.md` (sección 5) y en el README.

## Verificación antes de terminar

```bash
# Los 3 workflows son JSON válido y no quedan IDs reales de Data Tables
node -e "for (const f of ['backlinks','errores-backlinks','test-apis']) { const w = require('./workflows/' + f + '.json'); const malos = w.nodes.filter(n => n.parameters?.dataTableId && !/^__DATA_TABLE_[a-z_]+__$/.test(n.parameters.dataTableId.value)); console.log(f, w.nodes.length, 'nodos', malos.length ? 'IDS REALES: ' + malos.map(n => n.name) : 'ok'); }"

# El script de importación funciona (con un archivo de IDs de prueba)
node scripts/prepare-import.mjs <ruta-a-ids-de-prueba.json> && rm -rf dist

# No hay correos ni dominios reales (solo deben salir los de ejemplo)
git grep -nE "[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[a-z]{2,}"
```
