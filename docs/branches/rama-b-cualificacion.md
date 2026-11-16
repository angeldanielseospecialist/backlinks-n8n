# Rama B · Cualificación

**Qué hace:** coge webs candidatas y decide cuáles merecen que les escribamos.
De las que sobreviven, busca el correo de su redacción y lo verifica.

**Cuándo:** todos los días a las 4:00 de la madrugada.

**Dónde:** dentro del workflow `Backlinks`. Sus nodos empiezan por `B ·`.

---

## Por qué existe

No todas las webs valen. Si pedimos un enlace a un sitio sin lectores, no sirve de
nada. Si se lo pedimos a una web que ya nos enlaza, quedamos mal. Y si escribimos a
un sitio de recetas de cocina, hacemos el ridículo.

Filtrar eso a mano son horas. Esta rama lo hace sola y, muy importante, **filtra de
lo barato a lo caro**: primero las comprobaciones gratis, después las que cuestan
dinero. Así no se gasta saldo en una web que iba a descartarse de todos modos.

---

## El recorrido, paso a paso

### 1. Leer la configuración

Lo primero que hace es abrir la tabla `backlinks_config` y leer la ficha del
negocio: su dominio, su temática, los idiomas aceptados y todos los listones que
tiene que superar un sitio.

**Nada del negocio está escrito dentro de los nodos.** Si mañana quisiéramos ser más
exigentes, se cambia la tabla, no la automatización. Y para usarla con otra
empresa basta con cambiar los valores de esa fila.

### 2. Coger unas pocas candidatas

Lee la tabla `backlinks_dominios` y se lleva **las cinco más antiguas** que estén
en estado `prospecto`. Cinco, no todas.

Ese número sale de una cuenta muy concreta: el servicio que busca correos, Hunter,
regala 50 créditos al mes y cada web consume 1,5 (el freno calcula 2,5, por prudencia).
Cinco al día es el ritmo que aguanta ese saldo. Es el cuello de botella de todo el
sistema.

### 3. Limpiar la lista *(gratis)*

Normaliza cada dirección hasta dejar el dominio principal: `blog.ejemplo.com` y
`www.ejemplo.com` se convierten los dos en `ejemplo.com`, porque son el mismo sitio
y no tiene sentido escribir dos veces.

Luego aparta dos tipos de candidatas:

- Las **repetidas**, quedándose con la primera que llegó.
- Las que están en la **lista negra**, que es una columna de la configuración donde
  se apuntan los sitios que nunca queremos contactar: competidores, quien nos pidió
  que no le escribiéramos, o quien nos pidió dinero.

Las apartadas no desaparecen: se marcan como descartadas con su motivo. Así mañana
no vuelven a entrar por la puerta.

### 4. ¿Ya nos enlaza? *(cuesta poco)*

Una sola consulta a Ahrefs pregunta cuáles de estas webs ya enlazan al dominio del negocio.
Las que ya lo hacen se descartan.

Escribirle a alguien que ya te enlaza para pedirle un enlace deja muy mala
impresión, y además no aporta nada.

### 5. Mirar los números *(cuesta unidades de Ahrefs)*

De las que quedan, pide a Ahrefs sus métricas **todas en una sola consulta**, que es
mucho más barato que preguntarlas de una en una. Cuatro datos por web:

| Dato | Qué significa |
|---|---|
| **DR** | Cuánta autoridad tiene el sitio a ojos de Ahrefs, de 0 a 100 |
| **Tráfico orgánico** | Cuánta gente llega al mes desde Google |
| **Dominios de referencia** | Cuántas webs distintas le enlazan a él |
| **Dominios enlazados** | A cuántas webs distintas enlaza él |

### 6. Aplicar los listones

Para seguir adelante hay que superarlos todos:

| Listón | Valor | Por qué |
|---|---|---|
| DR mínimo | 20 | Por debajo el enlace apenas aporta |
| Tráfico mínimo | 500 al mes | Un enlace en una web sin lectores es solo un número |
| Le enlazan al menos | 50 webs | Señal de que el sitio existe para alguien más |
| Enlaza a como mucho | 5 webs por cada una que le enlaza | Por encima, huele a fábrica de enlaces |
| Regla antifábrica | Se descarta si tiene DR 40 o más pero menos de 100 visitas | Autoridad inflada sin lectores reales es señal de enlaces comprados |

Las que no pasan se descartan con un motivo legible, del estilo `trafico_bajo` o
`ratio_granja`, para que al mirar la tabla se entienda de un vistazo qué falló.

### 7. ¿De qué va el sitio? *(inteligencia artificial)*

A las supervivientes las mira una por una, con tres segundos de pausa entre cada una
para no agobiar a nadie:

1. Descarga su portada.
2. Extrae el título, los encabezados, los párrafos y los enlaces.
3. Se lo pasa a la inteligencia artificial, que devuelve cuatro cosas: una **nota de
   afinidad del 0 al 10**, el **motivo** de esa nota en una frase, el **idioma** del
   sitio y **un artículo real** con su título y su dirección.

El artículo queda guardado en la tabla de dominios y se enseña en el formulario de
aprobación, para ayudarte a juzgar la web. El prompt de la rama C también lo recibe, pero
la plantilla del primer email no lo menciona.

Se descarta a quien saque menos de 7, y también a quien publique en un idioma que
no está en nuestra lista.

### 7 bis. ¿Qué tipo de web es?

La inteligencia artificial dice también si la web es un **medio**, una **empresa** u
**otra cosa** (blog personal, foro, directorio). Con eso y los números de Ahrefs, cada
web cae en un grupo:

| Grupo | Cómo se reconoce | Qué pasa |
|---|---|---|
| **Gran prensa** | Medio con DR de 70 o más, o más de 100.000 visitas al mes | No se toca: se descarta con el motivo `gran_prensa`, sin gastar Hunter |
| **Pequeña prensa** | Medio por debajo de eso | Queda en `lista_pr`. Los lunes se avisa a PR en Slack con la lista |
| **Pyme** | Empresa con un DR parecido al del negocio (46 a 76 en la plantilla) | Sigue al visto bueno de siempre |
| **El resto** | Empresas fuera de ese rango, blogs personales, foros… | Se descarta con el motivo `fuera_de_segmento` |

Los números salen de la configuración, así que se pueden cambiar sin tocar el workflow.
Si esas casillas están vacías, todo va al visto bueno como antes.

### 8. El visto bueno de una persona

Antes de gastar créditos de Hunter, llega a Slack un mensaje con un botón que abre
un formulario: **una casilla por web**, y al lado de cada una sus números, la nota
de afinidad con su motivo, el idioma y el artículo que encontró la inteligencia
artificial. Marcas las que te convencen y envías.

- Las **aprobadas** siguen al paso siguiente.
- Para las **no marcadas**, el formulario pregunta siempre qué hacer: rechazarlas, y
  quedan descartadas con el motivo `rechazado_manual`, o dejarlas para mañana.
- Si **nadie contesta en 20 horas**, esperan en estado `pendiente_aprobacion` y
  vuelven a salir en el formulario del día siguiente. No se pierden.

Por qué aquí y no antes: en este punto la web ya tiene datos para juzgarla, son como
mucho cinco al día, y lo que se protege es lo más escaso de todo, los créditos de
Hunter. Este visto bueno es sobre **la web**; el del texto del email llega en la
rama C.

### 9. El freno de los créditos

Antes de buscar ningún correo, se pregunta a Hunter cuántos créditos quedan y se
calcula cuántas webs caben. Las que caben siguen. **Las que no caben no se pierden:**
se quedan esperando en estado `pendiente_email` y son las primeras de la cola al día
siguiente, sin repetir lo ya gastado en Ahrefs ni en la inteligencia artificial.

Si no cabe ninguna, llega un aviso a Slack diciendo cuántas están esperando.

### 10. Buscar y verificar el correo *(gasta créditos de Hunter)*

Pide a Hunter hasta dos correos de ese dominio y elige el mejor, dando preferencia a
quien tenga un cargo de redacción, contenidos, prensa, comunicación o alianzas. Si no
hay ninguno así, se queda con el de mayor confianza, aunque sea de dirección.

Después lo verifica. Entran los que Hunter marca como **válidos** y
también los de webs cuyo servidor **acepta cualquier dirección**, algo
habitual en los medios grandes. Estos quedan marcados como `aceptar_todo`, y el
mensaje de aprobación del email en la rama C lo avisa para que decidas. Un correo que
rebota daña la reputación del buzón desde el que escribimos, y esa reputación cuesta
meses de construir y un día de perder.

### 11. Dejarlo todo anotado

La web que llega hasta aquí queda marcada como `cualificado`, y se crea su ficha en
`backlinks_contactos` con el correo, el nombre si se conoce y el estado
`listo_para_enviar`. Ahí la recoge la rama C.

---

## Los motivos de descarte

Al mirar la tabla de dominios, la columna `motivo` explica por qué se cayó cada uno:

| Motivo | Qué pasó |
|---|---|
| `duplicado` | Ya había otra fila con ese mismo dominio |
| `bloqueado` | Está en la lista negra de la configuración |
| `ya_enlaza` | Ya enlaza al dominio del negocio |
| `dr_bajo`, `trafico_bajo`, `pocos_refdomains`, `ratio_granja`, `dr_sin_trafico` | No superó ese listón. Pueden aparecer varios juntos separados por `+` |
| `relevancia_baja` | La inteligencia artificial le puso menos de 7 |
| `idioma_no_aceptado` | Publica en un idioma que no está en nuestra lista |
| `rechazado_manual` | Una persona no la aprobó en Slack |
| `gran_prensa` | Medio grande: marketing no quiere que se le escriba |
| `fuera_de_segmento` | No es una pyme de tamaño parecido ni un medio |
| `sin_contenido` | No se pudo leer su portada. Conviene revisarla a mano |
| `error_ia` | La inteligencia artificial falló con esa web. La pasada sigue con las demás |
| `sin_email` | Hunter no encontró ningún correo |
| `email_invalid` y similares | El correo encontrado no superó la verificación |
| `sin_creditos_hunter` | No es un descarte: espera turno para el día siguiente |

---

## Qué cuesta cada pasada

| Recurso | Consumo |
|---|---|
| Ahrefs | Unas 100 a 150 unidades por pasada |
| Inteligencia artificial | Una consulta por web que llega al paso 7 |
| Hunter | 1,5 créditos por web que llega al paso 10: 1 por la búsqueda y 0,5 por verificar. El freno calcula 2,5, por prudencia |

El recurso escaso es Hunter: con 50 créditos al mes da para unas 30 webs, aunque el
freno, que es prudente, calcula 20.

---

## Si algo va mal

1. **Ejecuta `Test APIs`.** En diez segundos sabrás si el problema es una clave o un
   saldo agotado. No gasta nada.
2. **Mira la pestaña *Executions*** del workflow y abre la ejecución que falló. Cada
   nodo enseña lo que recibió y lo que devolvió.
3. **Mira `backlinks_log`.** Si el fallo ocurrió en una ejecución automática, habrá
   una fila con el nodo que falló y el mensaje de error, y habrá llegado un aviso a
   Slack.

Un aviso importante: n8n **solo llama al workflow de errores en las ejecuciones
automáticas**. Si lanzas una a mano y falla, no salta ningún aviso.
