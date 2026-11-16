# Tabla `backlinks_enlaces`

**Qué guarda:** cada enlace conseguido, o prometido, y si sigue vivo. **Una fila por
enlace.**

**Quién la escribe:** una persona da de alta la fila; la rama F la mantiene al día.
**Quién la lee:** la rama F, cada domingo.

---

## Para qué sirve

Es la prueba de que el trabajo funciona. Un backlink solo cuenta si existe, está publicado
y Google puede verlo. Esta tabla lo deja anotado y la rama F lo comprueba cada semana.

---

## Cómo se da de alta un enlace

**Con el formulario de la rama F** (`https://tu-n8n.com/form/alta-enlace-backlinks`,
con usuario y contraseña): rellena `url_origen`, `url_destino`, `nota` y, si
encuentra el contacto por su email o por la web, `contacto_id`, `dominio_id` y
`dominio_raiz`. También se puede añadir una fila a mano. Basta con `url_origen`. El resto ayuda:

| Columna | Qué poner | ¿Obligatoria? |
|---|---|---|
| `url_origen` | La página que nos enlaza, con `https://` | Sí |
| `url_destino` | La página nuestra a la que debe apuntar. Vacía = vale cualquier enlace al dominio del negocio | No |
| `contacto_id` | El número del contacto en `backlinks_contactos`. Si se pone, el contacto pasa solo a `conseguido` | Recomendable |
| `dominio_id` · `dominio_raiz` | La web en `backlinks_dominios` | Recomendable |
| `nota` | Cualquier cosa útil: qué se pactó, si es recíproco… | No |

**No rellenes `estado`:** lo pone la rama F cuando ve el enlace.

---

## Las columnas que rellena la rama F

| Columna | Qué guarda |
|---|---|
| `estado` | `vivo` cuando lo ve; `perdido` si estaba vivo y desaparece o la página pasa a `noindex` |
| `rel` | Cómo es el enlace: vacío (normal), `nofollow`, `sponsored`, `ugc` |
| `anchor` | El texto del enlace |
| `indexable` | Sí o no: si la página deja que Google la indexe |
| `fecha_conseguido` | Cuándo lo vio vivo por primera vez |
| `ultima_comprobacion` | Cuándo lo revisó por última vez |
