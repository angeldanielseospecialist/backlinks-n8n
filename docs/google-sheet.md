# Plantilla del Google Sheet de backlinks

La automatización usa **un Google Sheet** que comparte con el equipo de marketing. Hay que crearlo una vez por empresa, con las tres pestañas de abajo.

> **Importante:** los nombres de las pestañas y los de la fila 1 deben escribirse **exactamente** como aparecen aquí (minúsculas, guiones bajos, sin tildes en los nombres de columna). La automatización los busca tal cual.

## Cómo crearlo

1. Crea un Google Sheet nuevo. El nombre del archivo es libre, por ejemplo `Backlinks_MiEmpresa`.
2. Crea las tres pestañas: `Recursos enlazables`, `Lista PR` e `Instrucciones`.
3. Escribe en la fila 1 de cada pestaña los encabezados indicados.
4. Comparte el Sheet con la cuenta de Google de la credencial *Google Sheets Backlinks* de n8n, con permiso de edición.
5. En n8n, selecciona este Sheet en los cuatro nodos que lo usan: *D · Leer recursos*, *A · Lista PR en el Sheet*, *A · Leer recursos del Sheet* y *A · Blog: añadir al Sheet*.

---

## Pestaña 1 · `Recursos enlazables`

**La mantiene marketing.** Son los artículos o guías de la web propia que se ofrecen a otra web cuando responde con interés al primer email. La automatización elige uno por respuesta y lo propone en un borrador que revisa y envía una persona.

| Columna (fila 1) | Qué se escribe | Ejemplo |
|---|---|---|
| `url` | La dirección completa del artículo | `https://www.miempresa.com/blog/guia-ejemplo` |
| `para_que_sirve` | Una frase sobre qué explica y a qué lector le sirve. La IA no abre la página: elige leyendo esta frase | `Explica qué es X y cómo funciona, útil para lectores que empiezan` |
| `idiomas` | Los idiomas del artículo, separados por comas. Vacío = vale para todos | `es,en` |
| `activo` | `sí`, `no` o `propuesto` (ver abajo) | `sí` |

**Valores de `activo`:**

| Valor | Significado |
|---|---|
| `sí` | El recurso se ofrece |
| `no` | Deja de ofrecerse, sin borrar la fila |
| `propuesto` | Lo ha añadido la automatización (rama A, desde el blog). **No se ofrece** hasta que marketing lo cambie a `sí` |

Si la pestaña no tiene ningún recurso activo, el aviso de Slack lo indica.

---

## Pestaña 2 · `Lista PR`

**La escribe la automatización.** Cada lunes añade los medios pequeños y afines que la automatización no contacta, para el equipo de PR. Se puede leer y anotar en columnas a la derecha, pero no conviene editar ni borrar filas ni cambiar la fila 1.

| Columna (fila 1) | Qué contiene | Ejemplo |
|---|---|---|
| `fecha` | El día en que se añadió (`aaaa-mm-dd`) | `2026-01-12` |
| `web` | El dominio del medio | `medioejemplo.com` |
| `dr` | Domain Rating de Ahrefs | `58` |
| `trafico` | Tráfico orgánico mensual estimado | `4200` |
| `idioma` | Idioma del medio (código ISO) | `es` |
| `por_que_encaja` | La frase de la IA que explica por qué es afín | `Cubre la misma temática que la empresa` |

---

## Pestaña 3 · `Instrucciones`

Es solo texto de ayuda para el equipo; la automatización no la lee. Texto sugerido para la columna A:

```
Backlinks · Mi Empresa

Recursos enlazables · la mantiene marketing
Artículos o guías de nuestra web que ofrecemos a otra web cuando responde con interés a nuestro primer email.
La automatización elige uno por respuesta y lo propone en un borrador que revisa y envía una persona.
• url: la dirección completa del artículo.
• para_que_sirve: una frase sobre qué explica y a qué lector le sirve. La IA no abre la página: elige leyendo esta frase.
• idiomas: los idiomas del artículo, separados por comas (es,en). Vacío = vale para todos.
• activo: sí o no. Con no, deja de ofrecerse sin borrar la fila. "propuesto" = lo sugiere la automatización; cámbialo a sí para usarlo.
No cambies los nombres de la fila 1 ni el nombre de la pestaña: la automatización los busca tal cual.

Lista PR · la escribe la automatización
Cada lunes añade los medios pequeños y afines que la automatización no contacta, para el equipo de PR.
Se puede leer y anotar al lado, pero no conviene editar ni borrar filas ni cambiar la fila 1.
```
