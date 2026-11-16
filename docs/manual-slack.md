# Manual del canal de Slack

Mensaje para **fijar en el canal de Slack** donde llegan los avisos de la automatización (el de
la columna `canal_slack`). Explica al equipo qué significa cada aviso y quién debe actuar.

## Cómo usarlo

1. Copia el texto del bloque de abajo **tal cual**. Está escrito con el formato de Slack
   (`*negrita*`, emojis como `:pushpin:`), así que en GitHub se ve sin formato, pero en Slack se
   verá bien.
2. Sustituye los dos marcadores:
   - `Mi Empresa` → el nombre de tu empresa;
   - `[PEGA AQUÍ EL ENLACE DE TU GOOGLE SHEET]` → el enlace a tu [Google Sheet](./google-sheet.md);
   - y, si tu n8n no está en `tu-n8n.com`, cambia también la dirección del formulario de altas.
3. Ajusta la zona horaria de la última línea si no trabajas con la hora de Madrid.
4. Publícalo en el canal y fíjalo (*⋮ → Pin to channel*).

## El mensaje

```text
:pushpin: *Cómo funciona este canal · Backlinks de Mi Empresa*

Una automatización busca webs que podrían enlazarnos, les escribe y nos avisa aquí. *Ningún email sale sin que el SEO Manager lo apruebe*, y a quien responde con interés le contesta el SEO Manager.

*:bookmark_tabs: El Sheet de backlinks*
[PEGA AQUÍ EL ENLACE DE TU GOOGLE SHEET]
• *Recursos enlazables*: artículos de nuestro blog que se pueden ofrecer a quien muestre interés. Mirad la columna *activo*:
   – *propuesto* → lo sugirió la automatización (cada lunes). Todavía NO se ofrece.
   – *sí* → aprobado: ya se puede ofrecer.
   – Si no os convence, borrad la fila.
• *Lista PR*: medios pequeños que encajan con nosotros. No les escribe la automatización: son para que prensa los contacte. Se llena los lunes.

*:memo: Formulario de altas*
https://tu-n8n.com/form/alta-enlace-backlinks
• Cuando una web publique un enlace a nuestra web, apuntadlo aquí. Cada domingo se comprueba que sigue activo.
• :lock: *Uso interno: NO compartáis este enlace con nadie de fuera del equipo.*
• La contraseña se pide al SEO Manager.

*:bell: Los avisos de este canal*

*Para marketing (con acción):*
• :rotating_light: *LISTA PARA PR* (lunes) → medios pequeños para que prensa los contacte. Están también en el Sheet.
• :books: *Recursos del blog propuestos* (lunes) → revisadlos en el Sheet y cambiad *propuesto* por *sí* en los que valgan.

*Solo para leer (no hay que hacer nada):*
• :inbox_tray: *Prospección semanal* (lunes) → webs nuevas encontradas esa semana.
• :bar_chart: *Resumen diario* (18:00) → envíos, respuestas y gasto del día. Los viernes trae también :chart_with_upwards_trend: *KPIs*.
• :link: *Monitor de enlaces* (domingo) → si los enlaces conseguidos siguen activos.
• :link: *Enlace dado de alta* / :warning: *Alta de enlace rechazada* → resultado del formulario de altas.

*Los gestiona el SEO Manager:*
• :white_check_mark: *Webs esperan tu visto bueno* → qué webs merecen que busquemos su email.
• :envelope_with_arrow: *Borradores para revisar* y :hourglass_flowing_sand: *Recordatorios para revisar* → los emails antes de salir.
• :star2: *Respuesta interesada* / :question: *Pide información* → alguien quiere hablar con nosotros.
• :no_entry: *Pide la baja*, :moneybag: *Pide pago*, :arrow_right: *Nos redirige a otra persona*, :mag: *Respuesta para revisar a mano*.
• :hourglass: *Hunter sin créditos* y :rotating_light: *Error en el workflow* → avisos técnicos.

*:raised_hand: Si apruebas algo en lugar del SEO Manager*
Después de aprobar, responde en el hilo de ese mismo aviso, así queda constancia de quién lo aprobó:
> Aprobado por: Nombre · Rol · DD/MM/AAAA · HH:MM

Los horarios son de Madrid. ¿Dudas? Escribid al SEO Manager.
```
