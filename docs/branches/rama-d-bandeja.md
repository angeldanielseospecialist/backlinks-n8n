# Rama D · Bandeja de entrada

**Qué hace:** mira si alguien ha contestado a nuestros emails, lee la respuesta, la
clasifica con inteligencia artificial y decide qué hacer con ese contacto. Si la
respuesta importa, avisa en Slack.

**Cuándo:** cada 15 minutos.

**Dónde:** dentro del workflow `Backlinks`. Sus nodos empiezan por `D ·`.

---

## Por qué existe

Sin ella, las respuestas se quedan en el buzón y nadie se entera a tiempo. Además, la
rama E manda recordatorios automáticos, y no se puede mandar un recordatorio a
quien ya contestó. Esta rama marca a esos contactos como respondidos para que no se les
vuelva a escribir.

**Nada se responde solo.** Si alguien muestra interés, la rama prepara un borrador de
respuesta y lo deja en Slack; lo revisa y lo envía una persona.

---

## Solo lee nuestros hilos

La rama **no mira el resto del correo** del buzón. Solo abre las
conversaciones que empezamos nosotros: las que tienen su `thread_id` guardado en
`backlinks_mensajes` y cuyo contacto sigue esperando respuesta (`enviado`, `follow_up_1`
o `follow_up_2`) o está en `respondido`. Ningún otro correo del buzón entra en n8n.

`respondido` está en la lista porque la rama E marca así al contacto cuando ve una
respuesta antes de que pase esta rama. No hay riesgo de repetir avisos: cada respuesta se
guarda y no se vuelve a leer.

---

## El recorrido, paso a paso

### 1. Qué hilos mirar

Lee `backlinks_mensajes` y `backlinks_contactos` y hace la lista de conversaciones que
siguen abiertas.

### 2. Leer cada hilo en Gmail

Pide a Gmail cada conversación y busca mensajes nuevos que no sean nuestros ni estén ya
guardados.

### 3. Guardar la respuesta

La guarda en `backlinks_mensajes` como `entrada` y pasa el contacto a `respondido`.

### 4. Clasificarla *(inteligencia artificial)*

La IA lee nuestro email y su respuesta y dice qué tipo de respuesta es, con cuánta
seguridad, un resumen de una frase y, si hay interés, un borrador de contestación.

**El borrador propone un recurso nuestro**:
el primer email no ofrece ninguno, así que es aquí donde se presenta. La IA elige el
que mejor encaje con su web, en su idioma si lo hay, y lo propone con su enlace. Si
ninguno encaja, propone el siguiente paso. Trata a la persona igual que nuestro email:
de tú o de vosotros.

**De dónde salen los recursos:** de la pestaña *Recursos enlazables* del Google Sheet
de backlinks, que mantiene marketing (columnas `url`, `para_que_sirve`, `idiomas`
y `activo`). Solo cuentan las filas con `activo` = sí. Al arrancar, la rama lee esa
pestaña (*D · Leer recursos*) y la junta en un texto para la IA (*D · Recursos de
marketing*). Si la pestaña está vacía o Google falla, la rama sigue, y el aviso de Slack
dice que el borrador no propone ningún recurso.

### 5. Qué hace con cada tipo

| Respuesta | Qué pasa con el contacto | ¿Aviso en Slack? |
|---|---|---|
| `interesado` | `negociando` | Sí, con el borrador de respuesta |
| `pide_info` | `negociando` | Sí, con el borrador de respuesta |
| `fuera_oficina` | Sigue `enviado`, con la fecha de vuelta en `fecha_reintento` | No |
| `no_interesado` | `descartado` | No |
| `pide_pago` | `descartado` y su web a la lista negra | Sí |
| `baja` | `descartado` y su web a la lista negra | Sí |
| `rebote` | `descartado` y el email marcado `invalido` | No |
| `redirige_a_otro` | `descartado`, y se crea un contacto nuevo con el email que nos dan | Sí |
| `no_claro` | Se queda en `respondido` hasta que decidas | Sí, para revisar a mano |
| La IA duda (menos de 0,8) o falla | Se queda en `respondido` hasta que decidas | Sí, para revisar a mano |

**`no_claro`** es la salida de la IA cuando la respuesta es
ambigua, aplaza la decisión ("ya os diré algo") o no tiene que ver con nuestro email.

**En modo prueba no se toca la lista negra**: las respuestas de prueba las escribimos
nosotros y no queremos bloquear webs reales por eso. El aviso de Slack lo indica.

---

## Qué cuesta

Gmail no cuesta nada. La IA, una consulta por respuesta nueva.
