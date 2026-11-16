# Automatización de backlinks en n8n — base de conocimiento

> Este documento resume el diseño de la automatización: lo necesario para instalarla, operarla y
> mantenerla. El detalle por rama y por tabla está en [`branches/`](./branches/) y
> [`tables/`](./tables/); la instalación, en [`instalacion.md`](./instalacion.md); lo que falta
> por hacer, en [`ROADMAP.md`](../ROADMAP.md); el método para cambiar el workflow, en
> [`desarrollo.md`](./desarrollo.md).

## 1. Qué es

Prospección, cualificación y outreach de backlinks para el dominio de una empresa, orquestado en
n8n. **Es una plantilla reutilizable:** nada del negocio va escrito en los nodos; todo vive en la
única fila de la Data Table `backlinks_config` (nombre, dominio, temática, competidores, umbrales,
buzón, firma…). Para usarla con otra empresa se cambian los valores de esa fila.

**Nada sale sin aprobación humana.** Cada web y cada email pasan por un formulario en Slack, y
mientras `modo_prueba` esté activado todos los emails van al buzón de pruebas.

## 2. Arquitectura

**Un solo workflow `Backlinks`** (246 nodos) con una rama por disparador. Las
ramas no se conectan entre sí: se comunican por el **estado** de cada fila en las Data Tables.
Cada nodo lleva el prefijo de su rama (`B · Leer Config`).

| Rama | Disparo | Qué hace |
|---|---|---|
| A · Prospección | Lunes 3:00 | 4 fuentes (menciones, competidores, enlaces rotos, búsquedas) → `prospecto` hasta el tope; resumen a Slack; lista PR a Slack y al Sheet; propone posts del blog como recursos |
| B · Cualificación | L-V 4:00 | Filtra de barato a caro, segmenta, visto bueno en Slack, busca y verifica el email con Hunter, crea el contacto |
| C · Envío | Cada hora, dentro de `ventana_envio` | Prepara el primer email, formulario único en Slack, envío por Gmail |
| D · Bandeja de entrada | Cada 15 min | Lee solo nuestros hilos, clasifica cada respuesta con IA (9 categorías) y avisa |
| E · Follow-up | Diario 10:00 | Hasta 2 recordatorios en el mismo hilo, con formulario en Slack |
| F · Monitor de enlaces | Domingo 7:00 | Vigila `backlinks_enlaces` (vivo o perdido); formulario web para dar de alta enlaces |
| G · Resumen y KPIs | Diario 18:00 | Números del día a Slack; viernes, KPIs; después borra los datos personales antiguos |

**Workflows aparte:**

- `Errores en backlinks` — el *Error Workflow* de `Backlinks`. Escribe en `backlinks_log` y avisa
  en Slack. n8n solo lo dispara en ejecuciones automáticas, nunca en manuales.
- `Test APIs` — chequeo de salud: Ahrefs, Hunter, SerpAPI, la IA y la lectura de la config en una
  pasada. No gasta. Es la forma fiable de medir el gasto real: ejecutarlo antes y después.

**Data Tables (6):** `backlinks_config`, `backlinks_dominios`, `backlinks_contactos`,
`backlinks_mensajes`, `backlinks_enlaces` y `backlinks_log`. Sus columnas están en
[`data-tables/schema.json`](../data-tables/schema.json) (con su tipo) y explicadas en [`tables/`](./tables/).

**Google Sheet de backlinks:** lo comparte marketing, con las pestañas *Recursos enlazables*,
*Lista PR* e *Instrucciones*. Ver [`google-sheet.md`](./google-sheet.md).

**Credenciales de n8n (8):** `Ahrefs API` (cabecera) · `Hunter API` y `SerpAPI` (parámetro de
consulta) · `Anthropic API Backlinks` · `Slack Bot` · `Gmail Backlinks` (OAuth) ·
`Google Sheets Backlinks` (OAuth) · `Formulario enlaces Backlinks` (usuario y contraseña del
formulario de la rama F). Los nodos que descargan páginas (`B · Descargar la home` y
`F · Descargar página`) no llevan credencial: es correcto.

**IA:** Claude. Haiku en la rama B y en los recursos del blog; Sonnet en C, D y E.

## 3. Flujo y máquina de estados

Camino feliz: A guarda `prospecto` → B lo convierte en contacto `listo_para_enviar` → C lo deja en
`enviado` → D clasifica la respuesta → `negociando` (habla una persona) → F confirma `conseguido`.

**`backlinks_dominios.estado`:** `prospecto` → `pendiente_aprobacion` (espera el visto bueno; si
nadie responde en 20 h, reaparece al día siguiente) → `pendiente_email` (aprobada, sin créditos de
Hunter; va delante de las nuevas) → `cualificado` | `descartado` (con su `motivo`). Aparte:
`lista_pr` → `pr_notificado` (pequeña prensa, la reparte la rama A los lunes).

**Rama B, de barato a caro:** lee como mucho `limite_cualificacion_diario` prospectos (los más
antiguos) → normaliza el dominio raíz (`co.uk` o `com.br` son raíces de 3 trozos), quita duplicados
y `lista_bloqueo` → ¿ya enlaza al dominio del negocio? (Ahrefs, 1 llamada) → métricas en lote →
umbrales → descarga la portada y la IA puntúa `{relevancia 0-10, motivo, idioma, tipo_sitio,
artículo}` → **segmento**: medio con DR ≥ `gran_prensa_dr_min` o tráfico ≥
`gran_prensa_trafico_min` = `gran_prensa` (descartada); medio menor = `lista_pr`; empresa con DR
entre `pyme_dr_min` y `pyme_dr_max` = pyme → visto bueno; resto = `fuera_de_segmento`. Sin esos
umbrales en la config, todo va al visto bueno → formulario en Slack → freno de Hunter → busca hasta
`hunter_emails_por_dominio` emails (prefiere cargos editoriales, de prensa o de alianzas) y
verifica. `valid` → `valido`; `accept_all` → `aceptar_todo` (se acepta; la rama C lo avisa).

**Motivos de descarte:** `duplicado` `bloqueado` `ya_enlaza` `dr_bajo` `trafico_bajo`
`pocos_refdomains` `ratio_granja` `dr_sin_trafico` (combinables con `+`) `relevancia_baja`
`idioma_no_aceptado` `sin_contenido` (no se pudo leer: revisar a mano) `error_ia` `rechazado_manual`
`gran_prensa` `fuera_de_segmento` `sin_email` `email_invalid`… `sin_creditos_hunter` no es descarte.

**`backlinks_contactos.estado`:** `listo_para_enviar` → `pendiente_revision` (reservado por C) →
`enviado` → `follow_up_1` / `follow_up_2` (rama E) → `respondido` → `negociando` | `descartado`;
`conseguido` lo pone solo la rama F.

**Rama D, según la clasificación:** `interesado` / `pide_info` → `negociando` + borrador de
respuesta; `fuera_oficina` → sigue `enviado` con `fecha_reintento`; `no_interesado` →
`descartado`; `pide_pago` / `baja` → `descartado` + dominio a `lista_bloqueo` (no en modo prueba);
`rebote` → `descartado` + email `invalido`; `redirige_a_otro` → contacto nuevo `sin_verificar`;
`no_claro`, confianza menor de 0,8 o fallo de la IA → se queda en `respondido` y avisa para revisar
a mano. **Solo lee nuestros hilos** (los `thread_id` de `backlinks_mensajes` con contacto
esperando), nunca el resto del buzón.

**Recursos enlazables:** el primer email no ofrece ninguno. El borrador de respuesta de la rama D
propone uno de la pestaña *Recursos enlazables* del Sheet, en el idioma del contacto si lo hay.

**Rama E:** `dias_follow_up` = `4,9` o `4,9,14` (días hasta el 1.º y el 2.º recordatorio; el
tercer número son los días hasta descartar, 14 por defecto). **Vacía = no hace nada.** Comprueba
el hilo antes de escribir (si respondieron → `respondido`, y lo trata D). El cupo `limite_diario`
es **compartido** con la rama C y cuenta también los borradores.

**Rama F:** las filas de `backlinks_enlaces` las da de alta una persona (basta `url_origen`;
`url_destino` exige esa URL concreta). Vivo = enlace presente y página sin `noindex`. Nuevo vivo →
`fecha_conseguido` + contacto `conseguido`; vivo que desaparece → `perdido` + aviso.

## 4. Datos: reglas duras

- `id`, `createdAt` y `updatedAt` son automáticos. Las tablas se relacionan por el id numérico
  (`contactos.dominio_id`).
- **n8n reutiliza los ids** (el nuevo es el máximo que queda + 1): al borrar una fila, hay que
  borrar también las que apuntan a ella, o una fila nueva heredaría sus referencias.
- Los estados son texto libre sin validación: un estado mal escrito deja la fila invisible, sin
  aviso.
- No borrar los dominios `cualificado` (los contactos apuntan a ellos) ni los descartados (son la
  memoria que evita pagar dos veces: la rama A nunca toca filas existentes).
- `backlinks_config` tiene **una sola fila**: los nodos *Leer Config* leen la primera que
  encuentran.
- `coste_estimado` en `backlinks_log` es el peor caso, no una medición.
- `backlinks_contactos`, `backlinks_mensajes` y `backlinks_log` contienen datos personales: no
  salen del equipo.

## 5. Interruptor de parada

1. **Pararlo todo en segundos:** en el workflow `Backlinks`, despublicar o desactivar el workflow
   con el interruptor de arriba a la derecha. Se paran todos los disparadores (A-G) y el formulario
   de altas deja de responder. Después, en *Executions*, filtrar por *Waiting* y parar las que
   esperan un formulario de Slack (B, C o E); aunque se quedaran, nada sale sin que alguien apruebe.
2. **Solo frenar los emails:** `limite_diario = 0`. La rama C no redacta nada y la rama E no
   prepara recordatorios. Alternativa: `ventana_envio` vacía. Para frenar solo la rama E:
   `dias_follow_up` vacía.
3. **Lo que no sirve como freno:** `limite_cualificacion_diario = 0` (podría leer todas las webs)
   y `modo_prueba` activado (desvía los emails al buzón de pruebas, pero los contactos quedan como
   `enviado`). Nada de la config frena la rama A: para pararla, desactivar su disparador o usar el
   paso 1.

## 6. Riesgos de fondo

- **Esquemas de enlaces (Google):** el intercambio de enlaces automatizado y a escala deja huella.
  La plantilla actual del primer email propone una colaboración con "una URL mutua": es un riesgo
  que cada empresa debe valorar. La alternativa más prudente es una propuesta de valor editorial
  que no pida el enlace. En todo caso: el acuerdo lo cierra una persona, anchors de marca,
  `rel="sponsored"` si hay contraprestación, y quien pide pago va a la lista de bloqueo.
- **Entregabilidad:** conviene un buzón dedicado con SPF, DKIM y DMARC, un calentamiento de 2 a 4
  semanas, rebotes por debajo del 3 %, primer email sin enlaces ni adjuntos, pausas de 3 a 8
  minutos entre envíos y volumen bajo. Un correo que rebota daña la reputación del buzón.
- **Legal:** el email en frío entre empresas y el tratamiento de los correos que devuelve Hunter
  están regulados (en España, LSSI art. 21 y RGPD: base legal, información al destinatario y plazos
  de conservación). Ver [`condiciones-email-frio.md`](./condiciones-email-frio.md) y revisarlo con
  asesoría legal antes de desactivar `modo_prueba`.
