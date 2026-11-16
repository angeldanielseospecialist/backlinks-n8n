# Tabla `backlinks_config`

**Qué guarda:** la ficha del negocio y todos los ajustes de la automatización.
**Una sola fila**, con los datos del negocio.

**Quién la lee:** todas las ramas, al arrancar.
**Quién la escribe:** se edita a mano. La única excepción es `lista_bloqueo`, que la rama D amplía cuando alguien pide la baja o dinero (fuera del modo prueba).

---

## Por qué es la tabla más importante

Es el panel de mandos. **Nada del negocio está escrito dentro de la automatización**:
el dominio, la temática, los idiomas y todos los listones salen de aquí.

Eso tiene dos consecuencias prácticas:

- Para cambiar el comportamiento no se toca ningún workflow. Se cambia una casilla.
- Para usarla con otra empresa basta con cambiar los valores de esta fila: no hay que
  tocar ningún nodo.

> Si alguna vez encuentras el nombre del negocio escrito dentro de un nodo, eso es un
> error que hay que corregir.

---

## Las columnas

### Quiénes somos

| Columna | Qué guarda | Valor en la plantilla |
|---|---|---|
| `negocio_nombre` | El nombre comercial | Mi Empresa |
| `negocio_dominio` | El dominio que queremos que enlacen | miempresa.com |
| `tematica` | De qué va el negocio y qué temas hay que excluir. Se le pasa tal cual a la inteligencia artificial | Describe aquí tu temática. Excluir: casinos, apuestas, adultos |
| `mercados` | Países objetivo. No la lee ningún nodo: sirve para saber a qué países pedir la validación legal | ES |
| `idiomas` | Idiomas aceptados. **Esta sí la usa el filtro**: un sitio en otro idioma se descarta | es |
| `competidores` | Webs de la competencia, separadas por comas. La prospección busca quién enlaza a dos o más de ellas, y nunca las apunta como candidatas | competidor1.com,competidor2.com |
| `busquedas_serpapi` | Búsquedas de Google para la prospección, escritas enteras y separadas por `\|`. Cada una cuesta una búsqueda de SerpAPI por semana | `"escribe para nosotros" tu temática \| "write for us" your topic` |
| `lista_bloqueo` | Webs que nunca se contactan: quien pidió la baja, quien pidió dinero, competidores. No cuesta nada: la prospección no las apunta y la cualificación las descarta antes de gastar | Vacía |

### Los listones de calidad

| Columna | Qué guarda | Valor en la plantilla |
|---|---|---|
| `umbral_dr_min` | Autoridad mínima del sitio, de 0 a 100 | 20 |
| `umbral_trafico_min` | Visitas mensuales mínimas desde Google | 500 |
| `umbral_refdomains_min` | Cuántas webs distintas deben enlazarle | 50 |
| `umbral_ratio_max` | Cuántas webs puede enlazar él por cada una que le enlaza. Por encima, huele a fábrica de enlaces | 5 |
| `granja_dr` y `granja_trafico` | La regla antifábrica: se descarta quien tenga esa autoridad o más pero menos de ese tráfico | 40 y 100 |
| `umbral_relevancia_min` | Nota mínima de afinidad que debe poner la inteligencia artificial, de 0 a 10 | 7 |

### Los segmentos de marketing

| Columna | Qué guarda | Valor en la plantilla |
|---|---|---|
| `gran_prensa_dr_min` | Un medio con este DR o más es gran prensa: no se le escribe | 70 |
| `gran_prensa_trafico_min` | …o con estas visitas al mes o más | 100000 |
| `pyme_dr_min` · `pyme_dr_max` | Rango de DR de las pymes que nos interesan: parecido al del propio dominio (por ejemplo, ±15 puntos) | 46 y 76 |

Si las cuatro están vacías, la rama B no segmenta y todo va al visto bueno como antes.

### El ritmo y el gasto

| Columna | Qué guarda | Valor en la plantilla |
|---|---|---|
| `limite_cualificacion_diario` | Cuántas webs nuevas se analizan al día. **Marca el gasto de todo el sistema** | 5 |
| `limite_cola_prospectos` | Cuántas webs pueden esperar a la vez en estado `prospecto`. La prospección solo rellena los huecos hasta este tope. 35 es una semana de trabajo de la cualificación | 35 |
| `hunter_creditos_mes` | Créditos del plan de Hunter, para tenerlo anotado | 50 |
| `hunter_emails_por_dominio` | Cuántos correos se piden por web. Hunter cobra 1 crédito por búsqueda, encuentre uno o varios, así que subirlo no encarece | 2 |
| `limite_diario` | Máximo de emails al día. Cuentan todos los borradores del día, también los descartados, y también los recordatorios de la rama E | 3 |
| `pausa_min_envio` · `pausa_max_envio` | Minutos de pausa entre un envío y el siguiente, al azar entre los dos. Vacías = 3 y 8 | 3 y 8 |
| `ventana_envio` | Días y horas en que se puede enviar, con el formato `L,M,X,J,V 08:00-18:00 Europe/Madrid` (letras L M X J V S D, separadas solo por comas). La hora de fin no entra. Vacía = no se envía nada | `L,M,X,J,V 08:00-18:00 Europe/Madrid` |
| `dias_follow_up` | Días hasta el primer y el segundo recordatorio de la rama E, separados por comas: `4,9`. Un tercer número, opcional, son los días desde el último envío hasta descartar el contacto (14 si no se pone). **Vacía = la rama E no hace nada** | `4,9`. Para probar la rama E: `0,0` |

### El envío

| Columna | Qué guarda | Valor en la plantilla |
|---|---|---|
| `mailbox` | El buzón desde el que se escribe | outreach@miempresa.com |
| `email_pruebas` | A dónde van todos los correos mientras `modo_prueba` esté activado | pruebas@miempresa.com |
| `modo_prueba` | **El seguro.** Mientras esté activado, ningún email sale a una persona real | Activado |
| `canal_slack` | Canal donde llegan los avisos | #backlinks |
| `firma_email` | La firma de los emails, con sus líneas separadas por `\|`. La primera línea es también el nombre del remitente. Sin dominios: Gmail los convierte en enlace | `Nombre Apellido \| SEO Manager · Mi Empresa` |
| `texto_baja` | La frase para que el destinatario pida que no le escribamos más. Va al final de cada email, en su idioma (`es: … \|\| en: …`) | El texto en 5 idiomas (es, en, it, fr, pt): dice de dónde sale el email y cómo darse de baja ("responder «baja»"). Está en [`../condiciones-email-frio.md`](../condiciones-email-frio.md) |
| `blog_api` | La dirección de la API de posts del blog (WordPress). La rama A la lee los lunes para proponer recursos al Sheet. Vacía = no se proponen | `https://www.miempresa.com/wp-json/wp/v2/posts` |

### Lo que no está aquí

**Los recursos enlazables** (las páginas propias que se proponen a quien responde con
interés) viven en el Google Sheet de backlinks, pestaña *Recursos enlazables*, porque
marketing los mantiene y no tiene acceso a n8n. La rama A propone cada lunes hasta 3
posts del blog por idioma (columna `blog_api`), con `activo = propuesto`: solo se usan
cuando marketing cambia "propuesto" por "sí".

---

## Avisos

**`modo_prueba` es el seguro de todo el sistema.** Mientras esté activado, cualquier
email va al buzón de pruebas. No lo desactive nadie hasta que legal haya dado el
visto bueno y el buzón de envío esté preparado.

**Solo puede haber una fila.** La automatización lee la primera que encuentra. Si
alguien añade una segunda por error, es impredecible cuál se usará.

**Cuidado al tocar los listones.** Bajarlos trae más webs pero peores, y como el
saldo de Hunter es limitado, se gasta en sitios que no valen la pena. Si se cambian,
conviene mirar el resultado unos días después.
