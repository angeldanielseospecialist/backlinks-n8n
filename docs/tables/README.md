# Las tablas de datos de la automatización

Esta carpeta explica **qué se guarda en cada tabla** y para qué sirve cada columna.
Un archivo por tabla. Sin tecnicismos.

## Qué son estas tablas

Son las *Data Tables* de n8n, que se ven en el menú **Overview → Data tables**. Son
hojas de cálculo que viven dentro de n8n: tienen filas y columnas, se pueden mirar y
editar a mano, y la automatización escribe y lee en ellas.

Se eligieron en vez de una hoja de Google porque no tienen cupo de uso, no se pisan
cuando dos procesos escriben a la vez, y no necesitan contraseña ni permisos aparte.
A cambio, solo las ve quien tiene acceso a n8n.

## Tres cosas que valen para todas

**Toda fila trae tres columnas de regalo:** un `id` numérico único, la fecha de
creación (`createdAt`) y la de última modificación (`updatedAt`). No hay que
rellenarlas, se ponen solas.

**Las tablas se relacionan por ese número.** No hay vínculos automáticos: cuando una
ficha de contacto tiene que apuntar a su web, se guarda el número de esa web en la
columna `dominio_id`. Por eso **no se deben borrar filas de las que dependa otra
tabla**: el contacto se quedaría huérfano.

**Los números se reutilizan.** Una fila nueva toma el número más
alto que queda más 1. Si borras la última fila de una tabla, la siguiente que se cree
tendrá su mismo número, y las filas de otras tablas que apuntaban a la borrada pasarían a
apuntar a la nueva. Al borrar una fila, borra también las que dependen de ella.

**Las listas se guardan como texto separado por comas.** Por ejemplo, los idiomas
aceptados se escriben `es,en,it,fr,pt` en una sola casilla.

## Las tablas

| Tabla | Qué guarda |
|---|---|
| [backlinks_config](./backlinks_config.md) | La ficha del negocio y todos los ajustes |
| [backlinks_dominios](./backlinks_dominios.md) | Cada web candidata y qué se decidió con ella |
| [backlinks_contactos](./backlinks_contactos.md) | La persona a la que escribir en cada web |
| [backlinks_log](./backlinks_log.md) | El diario de todo lo que hace la automatización |
| [backlinks_mensajes](./backlinks_mensajes.md) | Cada email, del borrador al enviado, y las respuestas |
| [backlinks_enlaces](./backlinks_enlaces.md) | Los enlaces conseguidos y si siguen vivos |

## Un aviso sobre los estados

Varias columnas guardan un **estado**, y ese estado es texto libre: n8n no comprueba
que esté bien escrito. Una palabra mal puesta a mano deja esa fila fuera de todo,
porque ninguna parte de la automatización la reconoce y nadie avisa del fallo.

Si hay que cambiar un estado a mano, cópialo tal cual de la lista que aparece en el
archivo de esa tabla.

## Cómo mirar el contenido

Dentro de n8n, en **Overview → Data tables**. Desde ahí también se puede **exportar a
CSV**, que es la forma de compartir el contenido con alguien de fuera o de revisarlo
con calma en una hoja de cálculo.
