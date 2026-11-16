# Rama C · Envío

**Qué hace:** escribe el primer email a cada contacto cualificado, te lo enseña en
Slack para que lo apruebes y, si lo apruebas, lo envía por Gmail.

**Cuándo:** cada hora, a los 5 minutos, pero solo dentro del horario de envío de la
configuración: de lunes a viernes, de 8:00 a 18:00 hora de Madrid.

**Dónde:** dentro del workflow `Backlinks`. Sus nodos empiezan por `C ·`.

---

## Por qué existe

La rama B deja contactos con su email verificado en estado `listo_para_enviar`. Alguien
tiene que escribirles, y preparar a mano un email por web es lento. Esta rama prepara cada
email a partir de una plantilla (la IA la adapta a cada empresa y la traduce) y reserva
para una persona lo único importante: decidir si ese email sale o no.

**Nada sale sin tu aprobación.** Y mientras `modo_prueba` esté activado, ningún email
llega a un contacto real: todos van al buzón de pruebas.

---

## El recorrido, paso a paso

### 1. ¿Toca enviar ahora?

Mira la columna `ventana_envio` de la configuración, por ejemplo
`L,M,X,J,V 08:00-18:00 Europe/Madrid`: de lunes a viernes, de 8 a 18, hora de Madrid. Si
ahora no toca, la rama se para sin hacer nada. Si la columna está vacía, tampoco envía.

Esto vale también cuando la lanzas a mano: fuera de la ventana no redacta nada. Los días
van separados solo por comas, sin espacios; con `L, M, X` no enviaría nunca.

### 2. ¿Cuántos caben hoy?

El cupo del día es `limite_diario` menos los borradores ya hechos hoy. Si el límite es
10 y ya se hicieron 4, quedan 6. Cuenta también los borradores que descartaste, para ir
con prudencia.

### 3. Elegir a quién escribir

Coge los contactos `listo_para_enviar` que caben en el cupo, primero los de las webs con
más afinidad y, a igualdad, con más autoridad. Antes de empezar los marca todos como
`pendiente_revision`, para que la pasada de la hora siguiente no los vuelva a coger.

### 4. Preparar el email *(plantilla fija + inteligencia artificial)*

El primer email **no lo redacta la IA**: sale de una **plantilla fija** escrita en el prompt del
nodo *C · IA: redactar email* (copia en [`src/cPrompt.txt`](../../src/cPrompt.txt)). La IA solo:

1. Rellena `{Empresa}` con el nombre comercial de la web, sin la terminación del dominio (por
   ejemplo, `grupoejemplo.com` → "Grupo Ejemplo"), y `{Nombre}` con la primera línea de
   `firma_email`.
2. Si el idioma del contacto no es `es`, traduce la plantilla fielmente, con trato formal
   ("ustedes"). "Backlinks", "SEO" y "SEO Manager" no se traducen.
3. Devuelve el asunto y el cuerpo **sin añadir, quitar ni cambiar ninguna frase**.

La plantilla, en español (`{negocio_nombre}` sale de la configuración):

```
Asunto: Campaña conjunta de backlinks · {negocio_nombre} - {Empresa}

Hola, equipo de {Empresa}:

Les escribe {Nombre}, SEO Manager de {negocio_nombre}. Buscamos una colaboración rápida y
efectiva entre nuestras empresas en temas de backlinks. Como sabemos, las campañas de
backlinks son muy costosas, pero hay muchas empresas del sector con las que podemos
apoyarnos mutuamente y de manera gratuita, con una URL mutua.

Si les interesa, ¿nos comparten el contacto de la persona encargada del SEO? Y si no saben
de qué hablamos, se lo explicamos en una reu rápida.

Saludos,
```

Es **el mismo texto para todas las webs**: no cambia según el segmento (pyme o medio) ni
menciona ningún artículo de la web.

La firma y la línea para darse de baja **no las escribe la IA**: se añaden después, desde
`firma_email` y `texto_baja`, para que el texto sea siempre el aprobado. El primer email
**no ofrece ningún artículo ni recurso nuestro**: los recursos se presentan solo si responden
con interés, en el borrador de respuesta de la rama D.

> ⚠️ **Riesgo: esta plantilla propone un intercambio de enlaces** ("con una URL mutua").
> Google considera el intercambio excesivo de enlaces un esquema de enlaces. La aprobación de
> cada email en Slack y un volumen bajo reducen el riesgo, pero no lo eliminan: valóralo antes
> de activar la rama. Si prefieres un enfoque editorial (ofrecerte como fuente experta o
> proponer contenido útil sin pedir el enlace), cambia el texto de la plantilla en el prompt
> del nodo y en `src/cPrompt.txt`. Más contexto en
> [condiciones del email en frío](../condiciones-email-frio.md) y en los
> [riesgos de fondo](../arquitectura.md#6-riesgos-de-fondo).

### 5. Tu aprobación en Slack, todos juntos

Los borradores se guardan en la tabla `backlinks_mensajes` y llega **un solo mensaje** a
Slack con la lista y un botón **Revisar borradores**. Al pulsarlo se abre un formulario
con cada email entero (destinatario, web, segmento, recurso, asunto y texto) y una
casilla para aprobarlo. Cada email avisa cuando:

- estamos en modo prueba, y a qué buzón irá de verdad;
- el email no está confirmado del todo;
- falta la firma o la línea de baja, o no están en el idioma del contacto.

Al final, una pregunta obligatoria: qué hacer con los que no marques.

### 6. Qué pasa según lo que respondas

| Respuesta | Qué hace |
|---|---|
| **Marcado** | Se envía por Gmail desde tu buzón, con tu nombre como remitente. Se guarda la conversación, el contacto pasa a `enviado` y hay una pausa antes del siguiente (de `pausa_min_envio` a `pausa_max_envio` minutos). Tras el último no se espera |
| **No marcado + "Descartarlos"** | El contacto pasa a `descartado` y no se le escribe |
| **No marcado + "Devolverlos a la cola"** | El contacto vuelve a `listo_para_enviar` |
| **Nadie responde en 20 horas** | Todos vuelven a `listo_para_enviar` |

Si la IA falla al redactar, el contacto también vuelve a la cola, sin gastar cupo.

---

## Lo que necesita en la configuración

| Columna | Ejemplo |
|---|---|
| `ventana_envio` | `L,M,X,J,V 08:00-18:00 Europe/Madrid` |
| `limite_diario` | 5, igual que las webs que analiza la rama B al día |
| `pausa_min_envio` · `pausa_max_envio` | 3 y 8 minutos. En pruebas se pueden bajar |
| `firma_email` | `Nombre Apellido \| SEO Manager · Mi Empresa`. La primera parte es el nombre del remitente. Sin dominios: Gmail los convierte en enlace |
| `texto_baja` | Una frase para que el destinatario pueda pedir que no le escribamos más |
| `modo_prueba` | Activado: todo va a `email_pruebas` |

**Otros idiomas:** la baja puede escribirse por idioma, `es: texto || en: text`. Si no
se indica idioma, vale para todos. Si falta el texto en el idioma de un contacto, el
formulario lo avisa.

**Recursos enlazables:** esta rama no los usa. Viven en el Google Sheet de backlinks y
los propone la rama D al responder a un interesado.

---

## Qué cuesta

Solo la IA: una consulta por email redactado.
Gmail no cuesta nada, pero **la reputación del buzón sí**: por eso el volumen es bajo,
hay pausas entre envíos y todo pasa por tu aprobación.

La rama C no usa Ahrefs, Hunter ni SerpAPI.
