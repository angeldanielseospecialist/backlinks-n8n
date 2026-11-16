# Rama E · Follow-up

**Qué hace:** a quien no contestó nuestro primer email, le manda un recordatorio corto
en la misma conversación. Como mucho dos recordatorios; después, se da por cerrado.

**Cuándo:** todos los días a las 10:00, pero solo actúa dentro del horario de envío de
la configuración (por ejemplo, de lunes a viernes de 8:00 a 18:00, hora de Madrid).

**Dónde:** dentro del workflow `Backlinks`. Sus nodos empiezan por `E ·`.

---

## Por qué existe

Mucha gente no contesta al primer email porque se le pasa, no porque no le interese. Un
recordatorio breve recupera parte de esas respuestas. Pero hay que hacerlo con cuidado:
sin insistir de más y nunca a quien ya contestó.

---

## El recorrido, paso a paso

### 1. ¿A quién le toca?

Mira los contactos en `enviado` o `follow_up_1` y cuántos días han pasado desde el último
email. Los plazos salen de la columna `dias_follow_up` de la configuración:

| Valor | Qué significa |
|---|---|
| `4,9` | Primer recordatorio a los 4 días, segundo a los 9 días del anterior. Se descarta a los 14 días del último |
| `4,9,14` | Igual, con el plazo de descarte escrito: 14 días |
| vacía | **La rama no hace nada** |

Si alguien avisó de que estaba fuera de la oficina, la rama espera a su fecha de vuelta.

### 2. ¿Ya contestaron?

Antes de escribir, lee la conversación en Gmail. Si hay un mensaje que no es nuestro,
**no manda nada**: marca el contacto como `respondido` y deja que la rama D lo clasifique.
Si Gmail falla al leerla, tampoco envía: lo intenta al día siguiente.

### 3. Preparar el recordatorio *(plantilla fija + inteligencia artificial)*

Igual que en la rama C, **la IA no redacta**: copia la plantilla del recordatorio que toca,
escrita en el prompt del nodo *E · IA: redactar recordatorio* (copia en
[`src/ePrompt.txt`](../../src/ePrompt.txt)). Rellena `{Empresa}` con el mismo nombre que usó el
primer email y, si el idioma del contacto no es `es`, la traduce con trato formal ("ustedes").

**Recordatorio 1:**

```
Hola, equipo de {Empresa}: les escribo de nuevo por si se perdió mi mensaje. Seguimos
buscando empresas del sector para apoyarnos mutuamente con backlinks, de forma gratuita.
¿Nos comparten el contacto de la persona encargada del SEO?

Saludos,
```

**Recordatorio 2:**

```
Hola, equipo de {Empresa}: último mensaje por mi parte. Si en algún momento les interesa
una colaboración de backlinks entre nuestras empresas, aquí estaremos.

Saludos,
```

El asunto no lo escribe la IA: al ir en el mismo hilo, es el del primer email con "Re:".
La firma y la línea de baja salen de la configuración, como en la rama C. Las plantillas
mantienen la misma propuesta de intercambio de enlaces que el primer email (ver el aviso de
riesgo de la [rama C](./rama-c-envio.md#4-preparar-el-email-plantilla-fija--inteligencia-artificial)).

### 4. Tu aprobación en Slack

Igual que la rama C: **un solo mensaje** con un botón que abre un formulario con todos los
recordatorios y una casilla para cada uno. Para los no marcados eliges: dejarlos para otro
día o descartar el contacto.

### 5. Enviar en el mismo hilo

Los aprobados se envían como **respuesta a nuestro email anterior**, así que el
destinatario los ve en la misma conversación. Hay una pausa entre envíos, como en la
rama C. El contacto pasa a `follow_up_1` o `follow_up_2`.

---

## El cupo es compartido

`limite_diario` cuenta **todos** los emails del día: primeros emails de la rama C y
recordatorios de la rama E. Así el buzón nunca pasa del límite.

---

## Qué cuesta

Una consulta a la IA por recordatorio. Gmail no cuesta nada.
