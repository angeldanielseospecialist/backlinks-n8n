# Tabla `backlinks_dominios`

**Qué guarda:** cada web candidata, todo lo que averiguamos de ella y qué se decidió.
**Una fila por web.**

**Quién la escribe:** la rama A la llena de candidatas y la rama B decide su destino.
**Quién la lee:** la rama B cada mañana.

---

## Para qué sirve

Es la memoria del sistema. Cada web que ha pasado alguna vez por aquí deja su ficha
con el veredicto y el porqué.

Esa memoria ahorra dinero: una web descartada no se vuelve a analizar. Si
`ejemplo.com` ya salió descartada porque ya nos enlaza, el día que vuelva a
aparecer como candidata no se gastará ni una unidad de Ahrefs en volver a
descubrirlo.

> Por eso **no conviene borrar las filas descartadas**, aunque parezcan basura.
> Son justamente lo que evita repetir el gasto.

---

## Las columnas

### Identificación

| Columna | Qué guarda | Ejemplo |
|---|---|---|
| `dominio_raiz` | La web, ya normalizada. `blog.ejemplo.com` se guarda como `ejemplo.com` | ejemplo.com |
| `fuente` | De dónde salió la candidata | manual, competidor, mencion, enlace_roto, serpapi |
| `nota` | Campo libre para apuntar cualquier cosa a mano. En las webs que llegan de la fuente de competidores, la rama A anota a cuántos competidores enlazan | Enlaza a 3 competidores |

### El veredicto

| Columna | Qué guarda |
|---|---|
| `estado` | En qué punto está. Ver la lista de abajo |
| `motivo` | Por qué se descartó, en una palabra. Vacío si no se descartó |
| `en_bloqueo` | Sí o no: si estaba en la lista negra |
| `ya_enlaza` | Sí o no: si ya enlaza al dominio del negocio |

### Los números de Ahrefs

| Columna | Qué guarda | Ejemplo |
|---|---|---|
| `dr` | Autoridad del sitio, de 0 a 100 | 55 |
| `trafico_organico` | Visitas mensuales desde Google | 12.000 |
| `dominios_referencia` | Cuántas webs distintas le enlazan | 3.500 |
| `dominios_enlazados` | A cuántas webs distintas enlaza él | 7.000 |
| `ratio_enlazados` | Los enlazados divididos entre los de referencia. Cuanto más alto, más sospechoso | 2,00 |

### Lo que dice la inteligencia artificial

| Columna | Qué guarda | Ejemplo |
|---|---|---|
| `relevancia` | Nota de afinidad temática, de 0 a 10 | 8 |
| `motivo_relevancia` | Por qué esa nota, en una frase | "Medio especializado en la temática del negocio" |
| `idioma` | Idioma detectado, en dos letras | es |
| `tipo_sitio` | `medio`, `empresa` u `otro` | medio |
| `segmento` | Grupo de marketing: `gran_prensa`, `pequena_prensa`, `pyme`, `empresa_fuera_rango`, `otro` o `sin_segmentar` | pyme |
| `articulo_titulo`, `articulo_url`, `articulo_resumen` | Un artículo real del sitio. Se enseña en el formulario de aprobación de la rama B; la plantilla del primer email no lo menciona | |

---

## Los estados

| Estado | Qué significa |
|---|---|
| `prospecto` | Recién anotada, aún sin analizar. Es el punto de partida |
| `pendiente_aprobacion` | Pasó todos los filtros y espera que una persona la apruebe en Slack. **No es un descarte:** si nadie contesta, vuelve a salir al día siguiente |
| `pendiente_email` | Aprobada, pero no había créditos de Hunter. **No es un descarte:** es la primera de la cola mañana |
| `lista_pr` | Pequeña prensa: no se le escribe desde aquí. Sale en el aviso de PR del lunes |
| `pr_notificado` | Ya se pasó a PR en un aviso del lunes |
| `cualificado` | Superó todo y tiene un contacto creado |
| `descartado` | Se cayó por algún motivo. La columna `motivo` dice cuál |

Los estados son texto libre y n8n no comprueba que estén bien escritos. Una palabra
mal puesta a mano deja esa fila fuera de todo, en silencio.

## Los motivos de descarte

| Motivo | Qué pasó |
|---|---|
| `duplicado` | Ya había otra fila con ese mismo dominio |
| `bloqueado` | Estaba en la lista negra |
| `ya_enlaza` | Ya enlaza al dominio del negocio |
| `dr_bajo` · `trafico_bajo` · `pocos_refdomains` · `ratio_granja` · `dr_sin_trafico` | No superó ese listón. Pueden aparecer varios juntos separados por `+` |
| `relevancia_baja` | La inteligencia artificial le puso menos de 7 |
| `idioma_no_aceptado` | Publica en un idioma fuera de nuestra lista |
| `rechazado_manual` | Una persona no la aprobó en Slack |
| `gran_prensa` | Medio grande: marketing no quiere que se le escriba |
| `fuera_de_segmento` | Ni pyme de tamaño parecido ni medio: empresa fuera del rango de DR, blog personal, foro… |
| `sin_contenido` | No se pudo leer su portada (se carga con JavaScript o bloquea robots). Conviene revisarla a mano: puede ser buena |
| `error_ia` | La inteligencia artificial falló al puntuarla. Se puede volver a poner en `prospecto` |
| `sin_email` | Hunter no encontró ningún correo |
| `email_invalid` y similares | El correo no superó la verificación. Los `accept_all` no se descartan: se aceptan como `aceptar_todo` |
| `sin_creditos_hunter` | Acompaña al estado `pendiente_email` |

---

## Avisos

**No borres las filas `cualificado`.** Los contactos apuntan a ellas por su número.
Si se borra la web, el contacto se queda huérfano.

**No borres las descartadas** salvo que sobren de verdad. Son la memoria que evita
volver a gastar en lo mismo.

**Cuidado con lo que se edita a mano.** Poner una fila en `prospecto` es la forma de
pedir que se vuelva a analizar, y eso cuesta dinero otra vez.

**La prospección nunca toca las filas que ya existen.** Si vuelve a encontrar una web
que ya está en la tabla, la ignora, aunque esté descartada. Así un descarte no se
deshace solo. Y solo añade webs nuevas hasta llenar el tope de
`limite_cola_prospectos`: las que no caben esa semana no se guardan.
