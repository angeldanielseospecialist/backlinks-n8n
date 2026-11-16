# Tabla `backlinks_log`

**Qué guarda:** el diario de todo lo que hace la automatización. Cada pasada, cada
gasto y cada error dejan una línea. **Una fila por suceso.**

**Quién la escribe:** todas las ramas, y el workflow de errores.
**Quién la lee:** las personas, cuando algo falla. Y la rama G, para
el gasto del día.

---

## Para qué sirve

Tres cosas:

1. **Saber qué pasó.** Si una mañana no aparecen contactos nuevos, aquí está el
   rastro de lo que hizo la automatización esa noche.
2. **Saber cuánto costó.** Cada fila anota el gasto estimado, y sumando se obtiene el
   coste por backlink conseguido, que es el número que de verdad importa para decidir
   si esto compensa.
3. **Guardar los errores.** Aunque nadie mire Slack ese día, el fallo queda escrito
   con el nodo que se rompió y el enlace a la ejecución.

---

## Las columnas

| Columna | Qué guarda | Ejemplo |
|---|---|---|
| `workflow` | Qué workflow lo escribió | Backlinks |
| `id_ejecucion` | El número de la ejecución concreta, para poder buscarla en n8n | 18 |
| `accion` | Qué se estaba haciendo | cualificacion_hunter |
| `entidad` | Sobre cuántas cosas | 2 dominios en cola |
| `resultado` | Cómo acabó | 20 caben con 50 creditos |
| `coste_estimado` | Lo que se calcula que costó. Unidades de Ahrefs, créditos de Hunter o búsquedas de SerpAPI según la acción | 5 |
| `url_ejecucion` | Enlace directo a la ejecución en n8n. Se rellena solo cuando lo escribe el workflow de errores | |

La fecha no hace falta anotarla: la columna automática `createdAt` ya la guarda.

---

## Las acciones que se registran hoy

| Acción | Cuándo se escribe | Qué mide el coste |
|---|---|---|
| `cualificacion_metricas_ahrefs` | Tras pedir las métricas en lote | Unidades de Ahrefs |
| `cualificacion_hunter` | Tras calcular cuántas webs caben con los créditos | Créditos de Hunter |
| `prospeccion_ahrefs` | Al final de cada prospección semanal | Unidades de Ahrefs de la fuente de competidores |
| `prospeccion_serpapi` | Al final de cada prospección semanal | Búsquedas de SerpAPI de menciones y búsquedas |
| `envio_outreach` | Cada vez que la rama C envía un email aprobado. El resultado dice a quién fue y si era modo prueba | Siempre cero: Gmail no cuesta |
| `error` | Cuando cualquier workflow se rompe en una ejecución automática | Siempre cero |

Otras ramas anotan también sus propias acciones.

---

## Un aviso sobre el coste

**El coste anotado es una estimación del peor caso, no lo que se gastó de verdad.**

Por ejemplo, la tabla puede anotar 5 créditos de Hunter cuando el consumo
real fueron 3. La diferencia es normal: el sistema calcula suponiendo que cada web
devolverá el máximo de correos posible, y muchas devuelven menos.

Para frenar el gasto antes de que ocurra, pecar de prudente está bien. Pero para
calcular el coste por backlink habrá que afinar este número o
contrastarlo con el saldo real de cada servicio.

La forma fiable de saber el gasto real es ejecutar el workflow `Test APIs` antes y
después, y restar. No consume nada.

---

## Avisos

**Esta tabla crece sola y nadie la vacía.** Con el tiempo conviene borrar las filas
antiguas, sobre todo las de pruebas, para que no ocupe de más.

**Las filas de las pruebas de error se reconocen fácil:** las que hablan de *Example
Workflow* con el mensaje *Example Error Message* son datos inventados por n8n, no
fallos reales.
