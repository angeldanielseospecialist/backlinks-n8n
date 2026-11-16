# Workflow `Errores en backlinks`

**Qué hace:** cuando algo falla en la automatización, deja constancia escrita y
avisa por Slack.

**Cuándo:** nunca por su cuenta. Lo llaman los demás workflows cuando se rompen.

---

## Por qué es un workflow aparte

Todo lo demás vive dentro de `Backlinks`, pero este no puede. n8n exige que el
encargado de recoger los errores sea un workflow independiente, y en los ajustes de
cada workflow se elige cuál cumple ese papel. Tras importar los
workflows, hay que asignarlo en los ajustes de `Backlinks` (*Settings → Error Workflow*).

## Qué hace exactamente

Son tres pasos:

1. **Recibe los datos del fallo:** qué workflow se rompió, en qué nodo, con qué
   mensaje y el enlace a la ejecución concreta.
2. **Escribe una fila en `backlinks_log`** con todo eso. Queda para siempre, aunque
   nadie mire Slack ese día.
3. **Publica un aviso en el canal `#backlinks`** con este aspecto:

```
🚨 Error en el workflow `Backlinks`
• Nodo que falló: `B · Hunter: buscar email`
• Mensaje: Credentials not found
• Ejecución: https://tu-n8n.com/execution/...
```

El enlace lleva directamente a la ejecución que se rompió, así que desde Slack se
llega al problema en un clic.

## Lo que hay que saber

**Solo salta en ejecuciones automáticas.** Si lanzas un workflow a mano y falla, no
llega ningún aviso. Es una decisión de n8n, no un error de configuración. Por eso,
cuando se prueba algo a mano, hay que mirar el resultado en pantalla.

**Tiene que estar publicado.** Si no lo está, se puede seleccionar en los ajustes de
otro workflow, pero no llegará a atrapar nada en las ejecuciones automáticas.

**El aviso de Slack se puede apagar.** El nodo que publica en Slack se puede
desactivar si en algún momento molesta. Mientras esté desactivado se sigue
escribiendo la fila en la tabla, solo que en silencio.

## Cómo probarlo

1. **Con datos de ejemplo:** abre `Errores en backlinks` y pulsa *Execute workflow*. n8n
   rellena unos datos inventados (*Example Workflow*, *Example Error Message*): comprueba que se
   escribe la fila en `backlinks_log` y que llega el aviso a Slack.
2. **Con un fallo real:** crea un workflow de prueba con un *Schedule Trigger* cada minuto y una
   petición HTTP a una dirección que no existe, y elige `Errores en backlinks` como su *Error
   Workflow*. Actívalo, espera el aviso en Slack y **desactívalo enseguida**: mientras esté
   activo, falla y avisa cada minuto.
