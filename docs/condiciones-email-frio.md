# Condiciones del email en frío · Backlinks

Plantilla de condiciones con criterio prudente. **No es asesoría jurídica:** cada empresa debe
revisarlas con su asesoría legal antes de enviar emails reales. Los ejemplos cubren España,
Italia, Francia, Portugal y EE. UU. (idiomas es, en, it, fr, pt).

## A quién se escribe

- **Sí:** empresas y medios pequeños (pymes en el rango `pyme_dr_min`–`pyme_dr_max`), con un email **del propio dominio de la
  web** y publicado: genérico o de un cargo editorial, de prensa o de alianzas (lo encuentra
  Hunter).
- **No:** gran prensa; particulares; direcciones de Gmail u otros correos personales; quien
  pidió la baja o está en `lista_bloqueo`; quien pide dinero por el enlace.

## Qué lleva cada email

- Quién escribe: nombre, cargo y empresa en la firma (`firma_email`).
- Por qué le escribimos: el motivo editorial concreto (su web, su tema).
- De dónde sale su email y cómo darse de baja: la línea de `texto_baja`, en su idioma.
- **Texto fijo** que propone una campaña
  conjunta de backlinks con "una URL mutua" y pide el contacto de la persona de SEO. Riesgo
  a valorar: Google considera el intercambio excesivo de enlaces un esquema de enlaces.
- **Nada de venta:** ni ofertas de producto, ni rentabilidades, ni enlaces en el primer email.
  Es una propuesta editorial, no publicidad. Por eso tampoco lleva
  dirección postal: no se vende nada.

## Cuántos y cómo

- Un primer email y como mucho 2 recordatorios en el mismo hilo (`dias_follow_up = 4,9`).
- Al principio, 3 al día (`limite_diario = 3`), L-V 08:00-18:00 Madrid.
- Nada sale sin aprobación humana en Slack. El enlace mutuo lo pacta una persona, nunca el email.

## Bajas

- La rama D las detecta en 15 minutos o menos: el contacto pasa a `descartado` y su web a
  `lista_bloqueo` al momento. No se le vuelve a escribir.
- A los **15 días** se borran sus datos personales (contacto y mensajes); solo queda su web en
  `lista_bloqueo`.

## Conservación

- Contactos y mensajes **sin respuesta: se borran a los 6 meses** del último envío.
- Lo hace la limpieza automática de la rama G. Las filas de `backlinks_dominios` no llevan datos
  personales y se quedan: son la memoria que evita pagar dos veces.

## Texto de baja (`texto_baja`)

Impersonal, neutro para tú y vosotros. Dice de dónde sale el email (información del RGPD).

```
es: Escribimos a esta dirección porque aparece publicada como contacto de la web. Para no recibir más mensajes nuestros, basta con responder «baja». || en: We are writing to this address because it is published as a contact on the website. To stop receiving messages from us, simply reply "unsubscribe". || it: Scriviamo a questo indirizzo perché è pubblicato come contatto sul sito. Per non ricevere più nostri messaggi, basta rispondere «cancellami». || fr: Nous écrivons à cette adresse car elle est publiée comme contact sur le site. Pour ne plus recevoir de messages de notre part, il suffit de répondre « désinscription ». || pt: Escrevemos para este endereço porque está publicado como contacto no site. Para deixar de receber as nossas mensagens, basta responder «remover».
```

## Riesgos a revisar con asesoría legal

- **España (LSSI art. 21):** pide consentimiento también entre empresas para comunicaciones
  comerciales. Defensa: el email es una propuesta editorial y no vende nada.
- **Italia:** el regulador más estricto. Preferir direcciones genéricas (redazione@, info@).
- **EE. UU. (CAN-SPAM):** exige dirección postal en emails comerciales; no se pone porque el
  email no es comercial.
- **Seguros:** Francia y EE. UU. permiten escribir a empresas con opción de baja; Portugal,
  cuando se escribe a empresas.
