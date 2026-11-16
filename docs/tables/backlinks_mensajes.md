# Tabla `backlinks_mensajes`

**Qué guarda:** cada email de la automatización, desde el borrador hasta el enviado,
y también las respuestas. **Una fila por email.**

**Quién la escribe:** la rama C, al redactar y al enviar, y la rama D, con las respuestas.
**Quién la lee:** la rama C, para saber cuántos borradores se han hecho hoy, y la rama D,
para saber qué hilos de Gmail son nuestros.

---

## Para qué sirve

Es el historial de conversaciones. Guarda qué se escribió a cada contacto, si lo
aprobaste y en qué hilo de Gmail quedó, para poder seguir esa conversación después: los
recordatorios y las respuestas se enlazan por ese hilo.

---

## Las columnas

| Columna | Qué guarda |
|---|---|
| `contacto_id` | El número del contacto en `backlinks_contactos` |
| `dominio_raiz` | La web, para leer la tabla sin saltar a otra |
| `destinatario` | El email real del contacto, aunque en modo prueba se envíe al buzón de pruebas |
| `direccion` | `salida` si lo escribimos nosotros; `entrada` si es una respuesta |
| `tipo` | `borrador` mientras espera aprobación; `outreach` cuando se envió |
| `idioma` | Idioma del email |
| `asunto` · `cuerpo` | El texto, con la firma y la línea de baja ya incluidas |
| `recurso_ofrecido` | La página propia que se ofreció |
| `thread_id` · `message_id` | Los identificadores de Gmail, para seguir la conversación |
| `revisado_por` | Qué pasó en la aprobación: `aprobado`, `descartado` o `sin_respuesta` |
| `clasificacion` · `confianza` | Para las respuestas: qué tipo de respuesta es y cuánto de segura está la IA |
| `resumen` | Para las respuestas: una frase de la IA |
| `borrador_respuesta` | Para las respuestas con interés: el borrador que se deja en Slack |

Las respuestas las escribe la rama D con `direccion = entrada` y `tipo = respuesta`. En
ellas, `destinatario` guarda **quién la escribió**, y `thread_id` y `message_id`, los de
Gmail.

---

## Avisos

**Contiene el texto de emails a personas reales**, con sus direcciones. Mismo cuidado
que `backlinks_contactos`: no se comparte fuera del equipo.

**Cada borrador cuenta para el cupo del día**, también los descartados. Es a propósito:
con el volumen bajo del arranque, se prefiere pecar de prudente.
