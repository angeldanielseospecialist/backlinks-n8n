# Rama A · Prospección

**Qué hace:** busca webs que podrían enlazar al negocio y las apunta en la lista de
candidatas, para que la rama B decida después cuáles valen la pena.

**Cuándo:** todos los lunes a las 3:00 de la madrugada.

**Dónde:** dentro del workflow `Backlinks`. Sus nodos empiezan por `A ·`.

---

## Por qué existe

Sin esta rama, cada web candidata hay que buscarla y apuntarla a mano. La rama A lo
hace sola cada semana, mirando en tres sitios distintos, y deja las candidatas en la
tabla `backlinks_dominios` con el estado `prospecto`. Ahí las recoge la rama B.

Tiene dos reglas que no se saltan nunca:

- **No toca lo que ya existe.** Si encuentra una web que ya está en la tabla, la
  ignora, aunque esté descartada. Así un descarte no se deshace solo y no se paga dos
  veces por analizar la misma web.
- **No se pasa del tope.** Solo apunta tantas webs como huecos haya en la cola. La
  rama B analiza cinco al día, y no tiene sentido apuntar cien si se van a quedar
  meses esperando.

---

## El recorrido, paso a paso

### 1. Leer la configuración y la cola

Abre `backlinks_config` para saber quién es el negocio, quiénes son sus competidores,
qué búsquedas hacer y cuál es el tope. Y cuenta cuántas webs esperan ya en estado
`prospecto`.

### 2. Buscar en cuatro sitios a la vez

| Fuente | Dónde busca | Qué trae | Prioridad |
|---|---|---|---|
| **Menciones de marca** | Google, a través de SerpAPI: el nombre del negocio fuera de su propia web, en las tres primeras páginas. Se busca en el idioma y el país del primer mercado de la configuración (por ejemplo, Google España en español) | Webs que ya hablan del negocio. Es el email más fácil: "ya nos mencionas, ¿añadirías el enlace?" | 1ª |
| **Competidores** | Ahrefs: las webs que enlazan a cada competidor de la configuración | Solo las que enlazan a **dos o más** competidores. Ya han demostrado que enlazan a empresas como la nuestra | 2ª |
| **Enlaces rotos** | Ahrefs: las webs que enlazan a páginas muertas de cada competidor, hasta 100 por competidor y con DR de 20 o más | Webs cuyo enlace ya no lleva a ningún sitio: se les puede proponer algo vivo | 3ª |
| **Búsquedas** | Google, a través de SerpAPI: las consultas de la columna `busquedas_serpapi` | Webs que aceptan colaboraciones, del tipo "escribe para nosotros" | 4ª |

Si una fuente no tiene nada que buscar, por ejemplo porque la lista de competidores
está vacía, no falla: termina sin candidatas y las otras dos siguen.

### 3. Limpiar la lista *(gratis)*

Junta lo que trajeron las tres fuentes y:

1. Deja cada web en su dominio principal: `blog.ejemplo.com` pasa a `ejemplo.com`.
2. Quita las que nunca se contactan: la propia web del negocio, los competidores, las
   de la lista negra y las **plataformas** donde no hay una redacción a la que
   escribir, como YouTube, LinkedIn, Wikipedia, las tiendas de aplicaciones o los
   blogs gratuitos de WordPress.com y Medium.
3. Si una web sale en varias fuentes, se queda con la de más prioridad.
4. **Quita las de DR demasiado alto**. Con los segmentos de marketing,
   la rama B descarta toda web con DR mayor de 76: si es un medio, por gran prensa; si es
   una empresa, por estar fuera de segmento. Guardarlas solo ocuparía sitio. El 76 sale
   de la configuración (`pyme_dr_max` y `gran_prensa_dr_min`). Las webs de las que aún no
   se sabe el DR, las de menciones y búsquedas, pasan.
5. Las ordena: primero menciones, después competidores (antes las que enlazan a más
   competidores y, a igualdad, las de más autoridad), luego enlaces rotos y por último
   búsquedas.

### 4. Quedarse solo con las nuevas

Compara cada web con la tabla `backlinks_dominios`. Las que ya están se ignoran, sea
cual sea su estado.

### 5. Aplicar el tope

Calcula los huecos: `limite_cola_prospectos` menos las webs que ya esperan. Si el
tope es 35 y hay 30 esperando, solo entran 5.

**Los huecos se reparten por turnos entre las fuentes**: en cada vuelta
entra una web de menciones, una de competidores, una de enlaces rotos y una de búsquedas,
hasta llenar. Dentro de cada fuente van primero las de DR entre 46 y 69, que sirven tanto si
resultan ser un medio pequeño como una pyme.

**Las que no caben no se guardan.** Si son buenas, la fuente las volverá a encontrar
la semana siguiente.

### 6. Apuntarlas

Cada web nueva entra en `backlinks_dominios` con estado `prospecto` y su fuente. Las
de competidores llevan en la columna `nota` a cuántos competidores enlazan.

### 7. Contarlo

Manda un resumen a Slack, sin botones, y deja dos filas en `backlinks_log`, una por
servicio. El mensaje se ve así:

```
📥 Prospección semanal · Mi Empresa
• Nuevos en la cola: 5
   – de menciones de marca: 2
   – de competidores: 3
   – de búsquedas SerpAPI: 0
• Ya estaban en la tabla (no se tocan): 41
• Fuera por el tope: 12 (tope 35, había 30 esperando)
• Cola total en prospecto: 35 → unas 1,0 semanas de trabajo para la rama B
• Coste estimado: 5250 unidades de Ahrefs · 9 búsquedas de SerpAPI
• Muestra: …
```

### 8. La lista para PR

En la misma pasada del lunes, si la rama B dejó webs de **pequeña prensa** en estado
`lista_pr`, llega a Slack un mensaje aparte, con un encabezado bien visible
(`LISTA PARA PR`), con cada web, su DR, su tráfico, su idioma y por qué encaja. Esas webs
pasan a `pr_notificado`, así que la semana siguiente solo salen las nuevas. La
automatización no les escribe: son para el equipo de PR.

**También quedan en un Google Sheet**: cada
web se añade como una fila en la pestaña *Lista PR* del Google Sheet de backlinks, con la
fecha, la web, su DR, su tráfico, su idioma y por qué encaja. Así PR la ve sin entrar en
n8n. Si Google falla, la pasada sigue y el aviso de Slack llega igual.

### 9. Recursos del blog para el Sheet

Después de la prospección, si la columna `blog_api` de la configuración tiene la dirección
de la API de posts del blog (WordPress), la rama lee los posts, quita los que ya están en
la pestaña *Recursos enlazables* del Sheet, y la IA elige como mucho 3 por idioma que
sirvan como recurso enlazable: guías que no caducan, no noticias. Los añade al Sheet con
`activo = propuesto` y avisa en Slack. La rama D solo los usa cuando marketing cambia
"propuesto" por "sí". Si `blog_api` está vacía, no se propone nada. Son los nodos
`A · Blog: …` y `A · Leer recursos del Sheet`.

---

## Cómo leer el resumen

| Si ves… | Qué significa |
|---|---|
| Nuevos: 0 varias semanas seguidas | Alguna fuente está rota, o la lista de competidores y búsquedas se ha agotado |
| "Fuera por el tope" alto semana tras semana | Entra más de lo que la rama B puede atender. Toca subir el ritmo de la rama B, y para eso Hunter Starter |
| Un aviso de llamadas con error | Una llamada a Ahrefs o SerpAPI falló. Ejecuta `Test APIs` para ver si es una clave o un saldo |
| Un aviso de tope vacío | `limite_cola_prospectos` no tiene valor en la config. Se usa 7 veces el límite diario de la rama B |

---

## Qué cuesta cada pasada

| Recurso | Consumo aproximado |
|---|---|
| Ahrefs | Unas 720 unidades por competidor en la fuente de competidores. La fuente de enlaces rotos suma hasta 100 filas por competidor, a 2 unidades por fila y con un mínimo de 50 por consulta |
| SerpAPI | 3 búsquedas de menciones más 1 por cada consulta de `busquedas_serpapi` |

Ahrefs es la fuente más cara. El resumen de Slack anota el coste estimado de cada pasada.
