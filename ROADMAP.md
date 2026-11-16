# Roadmap

Posibles mejoras de la automatización. Al cerrar una, se borra de aquí.

- [ ] **Rama D: reconocer los acuses automáticos de soporte** (Intercom, Zendesk, Freshdesk… "hemos recibido tu mensaje, te atenderemos en breve"). Hoy caen en `no_claro`, avisan en Slack y dejan el contacto en `respondido`, así que E ya no manda recordatorios. Mejora: una categoría nueva en el prompt de D, en el esquema del parser y en *D · Decidir acción* que los trate como un "fuera de la oficina" sin fecha: sin aviso, el contacto sigue en `enviado` y E puede recordar.
  - **Pista:** estos acuses suelen traer cabeceras que los delatan sin necesidad de IA, como `X-Auto-Response-Suppress: OOF, AutoReply`, `Auto-Submitted: auto-replied` o `Precedence: auto_reply`. *D · Gmail: leer hilo* trae las cabeceras porque lleva *Simplify* desactivado, así que un filtro en código antes de la IA podría reconocerlos gratis.
- [ ] **Menciones en más idiomas.** Hoy solo se buscan en el primer mercado de la config. Cada idioma añadido cuesta 3 búsquedas de SerpAPI más por semana.
- [ ] **Pasar de Data Tables a PostgreSQL para escalar:** más volumen, consultas y copias de seguridad, sin los límites de las tablas de n8n.
