# Las ramas de la automatización de backlinks

Esta carpeta explica, en lenguaje llano, **qué hace cada parte** de la automatización.
Un archivo por rama. No hace falta saber de programación para leerlos.

## La idea en un minuto

Una empresa quiere que otras webs la enlacen, porque cada enlace desde un sitio con
prestigio hace que Google confíe más en su web. Conseguir esos enlaces a mano
es lento: hay que buscar sitios afines, mirar si valen la pena, encontrar a quién
escribir y escribirle.

Esta automatización hace la parte repetitiva y deja para las personas lo único que
no se puede automatizar sin riesgo: **hablar con alguien interesado**.

## Cómo está montado

Todo vive en **un solo workflow de n8n llamado `Backlinks`**. Dentro hay varias
**ramas**, y cada una es una parte del proceso. Cada rama tiene su propio horario y
sus propios nodos, y todas se reconocen porque sus nodos empiezan por su letra:
`B · Leer Config`, `C · Redactar email`, y así.

Las ramas **no se conectan entre sí con cables**. Se comunican a través de lo que
cada una deja escrito en las tablas de datos. Es como una cinta de montaje donde
cada puesto deja la pieza en una bandeja y el siguiente la recoge cuando le toca.

## Las siete ramas

| Rama | Cuándo | Qué hace |
|---|---|---|
| [**A · Prospección**](./rama-a-prospeccion.md) | Lunes, 3:00 | Busca webs que nos mencionan, que enlazan a la competencia, con enlaces rotos de la competencia o que aceptan colaboraciones. Resumen semanal en Slack y lista de pequeña prensa para PR (Slack y Sheet). Además propone posts del blog como recursos en el Sheet |
| [**B · Cualificación**](./rama-b-cualificacion.md) | Lunes a viernes, 4:00 | Filtra hasta 5 webs: las que ya nos enlazan, las flojas, las de otra temática o idioma y las granjas. Gran prensa fuera, pequeña prensa a PR, solo pymes siguen. Tú las apruebas en Slack y después busca y verifica su email |
| [**C · Envío**](./rama-c-envio.md) | Cada hora, dentro de `ventana_envio` | Prepara el primer email de cada contacto. Un formulario en Slack para aprobarlos; los aprobados salen por Gmail |
| [**D · Bandeja de entrada**](./rama-d-bandeja.md) | Cada 15 min | Lee las respuestas en nuestros hilos, las clasifica con IA y avisa en Slack de las que importan, con borrador de respuesta y un recurso del Sheet para los interesados |
| [**E · Follow-up**](./rama-e-follow-up.md) | Diario, 10:00 | Hasta 2 recordatorios en el mismo hilo a quien no contestó, aprobados en Slack |
| [**F · Monitor de enlaces**](./rama-f-monitor.md) | Domingo, 7:00 | Comprueba que los enlaces conseguidos siguen vivos y avisa si se pierde alguno. Los enlaces se dan de alta con un formulario web con contraseña |
| [**G · Resumen y KPIs**](./rama-g-resumen.md) | Diario, 18:00 | Números del día en Slack; los viernes, KPIs acumulados. Después borra los datos personales antiguos (bajas a los 15 días, el resto a los 6 meses) |

La IA es Claude: Haiku en B y en los recursos del blog, Sonnet en C, D y E.

**Nada sale sin aprobación humana.** Mientras `modo_prueba` esté activado, los emails
aprobados van al buzón de pruebas, no a la persona real.

## Los otros workflows

Además del principal hay dos más, cada uno con su archivo o su explicación:

- **`Errores en backlinks`** · Cuando algo falla, deja constancia y avisa por Slack.
  Tiene que ser un workflow aparte porque n8n lo exige así. Ver
  [workflow-errores.md](./workflow-errores.md).
- **`Test APIs`** · Un botón que comprueba de una pasada que las cinco conexiones
  externas responden y cuánto saldo queda de cada una. No gasta nada. Sirve para
  saber en diez segundos si un problema viene de una clave caducada o de un saldo
  agotado.

## Dónde está lo demás

- **La arquitectura completa** (estados, reglas de datos, interruptor de parada y riesgos):
  [`../arquitectura.md`](../arquitectura.md)
- **Las tablas de datos**, qué guarda cada una: [`../tables/`](../tables/)
- **Cómo instalarla:** [`../instalacion.md`](../instalacion.md)
- **Lo que falta por hacer:** [`../../ROADMAP.md`](../../ROADMAP.md)
