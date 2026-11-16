# Tabla `backlinks_contactos`

**Qué guarda:** la persona a la que escribir en cada web, y en qué punto está la
conversación con ella. **Una fila por contacto.**

**Quién la escribe:** la rama B la crea; las ramas C, D y E van cambiando su estado.
**Quién la lee:** la rama C, para saber a quién toca escribir.

---

## Para qué sirve

Es el pequeño CRM de la operación. Mientras `backlinks_dominios` habla de **webs**,
esta tabla habla de **personas**: a quién escribimos, qué le dijimos y qué contestó.

Una fila aquí significa que esa web superó todos los filtros y tiene un correo
verificado. Es lo más caro de conseguir de todo el proceso, porque es lo único que
gasta créditos de Hunter.

---

## Las columnas

### Quién es

| Columna | Qué guarda | Ejemplo |
|---|---|---|
| `email` | El correo, ya verificado | nombre@ejemplo.com |
| `nombre` | Nombre y apellidos si Hunter los conoce. A menudo viene vacío | Nombre Apellido |
| `cargo` | Su puesto si se conoce | Editor |
| `idioma` | En qué idioma hay que escribirle | es |
| `verificado` | Resultado de la verificación de Hunter: `valido`, o `aceptar_todo` cuando el servidor de esa web acepta cualquier dirección y Hunter no puede confirmar el buzón. Estos se aceptan y la aprobación del email lo avisa. La rama D pone `invalido` si el email rebota, y `sin_verificar` en los contactos que crea cuando alguien nos redirige a otra persona | valido |

### A qué web pertenece

| Columna | Qué guarda |
|---|---|
| `dominio_id` | **El número de su fila en `backlinks_dominios`.** Es el vínculo entre las dos tablas |
| `dominio_raiz` | El dominio repetido aquí, para poder leer la tabla sin saltar a la otra |

### Cómo va la conversación

| Columna | Qué guarda |
|---|---|
| `estado` | En qué punto está. Ver la lista de abajo |
| `n_follow_ups` | Cuántos recordatorios se le han mandado ya. Máximo dos |
| `fecha_ultimo_envio` | Cuándo se le escribió por última vez. Sirve para calcular cuándo toca el recordatorio |
| `fecha_reintento` | Si respondió que está fuera de la oficina, la fecha en que vuelve. La rellena la rama D |

---

## Los estados

Es el recorrido de una conversación, desde que hay un correo hasta que hay un enlace:

| Estado | Qué significa |
|---|---|
| `listo_para_enviar` | Tiene correo verificado y espera turno. Vuelve aquí si nadie aprueba su email en 20 horas |
| `pendiente_revision` | La inteligencia artificial escribió el email y espera que una persona lo apruebe |
| `enviado` | Ya se le escribió |
| `follow_up_1` · `follow_up_2` | Se le mandó el primer o el segundo recordatorio |
| `respondido` | Contestó. **Cualquier respuesta detiene los recordatorios** |
| `negociando` | Mostró interés. A partir de aquí **habla una persona, no la automatización** |
| `conseguido` | El enlace existe y está publicado. Lo confirma la rama F, no se pone a mano |
| `descartado` | No hay nada que hacer: dijo que no, pidió dinero, pidió la baja o nunca contestó |

---

## Avisos

**Esta tabla contiene datos personales.** Correos de personas identificables,
obtenidos de Hunter. Antes de usarla con contactos reales, cada empresa debe revisar con
su asesoría legal la base legal, la información al destinatario y los plazos de
conservación. No se comparte fuera del equipo.

**Quien pida la baja se borra y se bloquea.** Su dominio pasa a la lista negra de la
configuración para que no vuelva a entrar por otro camino.

**Ningún email sale solo a un interesado.** Cuando alguien contesta con interés, la
inteligencia artificial prepara un borrador y lo envía una persona de marketing.
