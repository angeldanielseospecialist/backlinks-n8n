# Rama F · Monitor de enlaces

**Qué hace:** cada semana visita las páginas donde nos han enlazado y comprueba que el
enlace sigue ahí y sigue contando para Google.

**Cuándo:** los domingos a las 7:00.

**Dónde:** dentro del workflow `Backlinks`. Sus nodos empiezan por `F ·`.

---

## Por qué existe

Un enlace conseguido puede desaparecer: rediseñan la web, borran el artículo o lo cambian
a `nofollow`. Sin esta rama, el número de backlinks conseguidos sería una suposición.

---

## De dónde saca los enlaces

De la tabla `backlinks_enlaces`. **Las filas las da de alta una persona**, normalmente
quien negoció con esa web, cuando el otro lado confirma dónde publicará. Basta
con `url_origen`, la página que nos enlaza. Si se conocen, conviene rellenar también
`contacto_id`, `dominio_id` y `dominio_raiz`, y `url_destino` si el enlace debe apuntar a
una página nuestra concreta.

**Con un formulario.** Es una página web de n8n protegida con usuario y contraseña
(credencial `Formulario enlaces Backlinks`), dirección `…/form/alta-enlace-backlinks`
cuando el workflow está activo. Cuatro campos: la página que nos enlaza (obligatoria), la
nuestra a la que apunta, el email del contacto y una nota. La rama comprueba que sea una
web pública (rechaza lo que no empieza por https://, las IP y las direcciones internas),
evita duplicados, busca el contacto por su email o por la web, guarda la fila y avisa en
Slack tanto si entra como si se rechaza. Ocho nodos `F · … (alta)`, aparte del disparador
de los domingos.

---

## El recorrido, paso a paso

1. Lee las filas de `backlinks_enlaces` que tienen `url_origen`.
2. Descarga cada página, de una en una, con 3 segundos de pausa y un nombre de robot
   reconocible.
3. Busca un enlace a nuestro dominio (o a `url_destino`, si la fila la tiene). Anota su
   `rel` y su anchor, y mira si la página tiene `noindex` o un canonical que apunta a otra
   URL.
4. Decide:

| Qué ve | Qué hace |
|---|---|
| El enlace aparece por primera vez | La fila pasa a `vivo` con `fecha_conseguido`, y el contacto, a `conseguido` |
| Sigue vivo | Solo actualiza `ultima_comprobacion` |
| Estaba `vivo` y desaparece, o la página pasa a `noindex` | La fila pasa a `perdido` y avisa en Slack |
| No pudo leer la página | Avisa en Slack y lo reintenta la semana siguiente |

5. Si hubo novedades, un mensaje en Slack. Siempre, una fila en `backlinks_log`.

---

## Qué cuesta

Nada: solo descarga páginas públicas.
