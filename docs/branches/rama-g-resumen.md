# Rama G · Resumen y KPIs

**Qué hace:** cada tarde manda a Slack los números del día. Los viernes añade los
indicadores acumulados de toda la campaña.

**Cuándo:** todos los días a las 18:00.

**Dónde:** dentro del workflow `Backlinks`. Sus nodos empiezan por `G ·`.

---

## Por qué existe

Para saber cómo va todo sin abrir n8n ni las tablas. Y para que marketing pueda valorar si
el esfuerzo compensa.

---

## Qué dice el mensaje

**Cada día:**

- Emails enviados hoy frente al límite diario, y borradores del día.
- Respuestas de hoy, por tipo (interesado, no interesado, pide pago…).
- Webs cualificadas hoy.
- Lo que espera: webs en la cola, por aprobar y sin créditos de Hunter.
- Contactos listos para escribir, en revisión y negociando.
- Lo gastado hoy según `backlinks_log`: unidades de Ahrefs, créditos de Hunter y
  búsquedas de SerpAPI.

**Los viernes, además:**

- Primeros emails enviados en total.
- Tasa de respuesta y cuántas respuestas mostraron interés.
- Backlinks conseguidos y su DR medio.

---

## Qué cuesta

Nada: solo lee las tablas.

**Un aviso:** los indicadores acumulados se calculan con lo que hay en las tablas. Como la
rama borra los datos antiguos (ver más abajo), pueden salir algo más bajos de lo real.

---

## Limpieza de datos antiguos

Después del resumen, con las mismas tablas que ya leyó, la rama borra los datos personales
que ya no hacen falta, según las condiciones del email en frío: quien pidió la baja, a los
15 días; el resto de conversaciones cerradas (sin respuesta, descartadas, no interesadas),
a los 6 meses de la última actividad. Nunca toca los contactos en cola, en revisión,
negociando ni con enlace conseguido, ni las webs. Borra el contacto junto con sus mensajes
y lo anota en el log.

Si la rama se lanza a mano, hace lo mismo que la pasada diaria: el resumen y también la
limpieza. El resumen no gasta nada.
