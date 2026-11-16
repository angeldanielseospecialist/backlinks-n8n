// Junta el texto de la IA con la firma y la baja de la config, decide el destinatario y anota los avisos para la revisión
const cfg = $('C · Leer Config').first().json;
const c = $('C · Uno por uno').item.json;
const ia = $input.item.json.output;
if (!ia || !ia.asunto || !ia.cuerpo) return { json: { ...c, valido: false } };

// La baja puede ir por idioma: "es: texto || en: texto". Sin prefijo, vale para todos
function porIdioma(texto, idioma) {
  const t = String(texto || '').trim();
  if (!/^[a-z]{2}\s*:/i.test(t)) return { texto: t, en_su_idioma: true };
  const mapa = {};
  for (const p of t.split('||').map(s => s.trim()).filter(Boolean)) {
    const m = p.match(/^([a-z]{2})\s*:\s*([\s\S]*)$/i);
    if (m) mapa[m[1].toLowerCase()] = m[2].trim();
  }
  if (mapa[idioma]) return { texto: mapa[idioma], en_su_idioma: true };
  return { texto: mapa[Object.keys(mapa)[0]] || '', en_su_idioma: false };
}

const idiomaEmail = String(ia.idioma || c.idioma || '').toLowerCase();
const firma = String(cfg.firma_email || '').split('|').map(s => s.trim()).filter(Boolean);
const baja = porIdioma(cfg.texto_baja, idiomaEmail);
const cuerpo = [String(ia.cuerpo).trim(), firma.join('\n'), baja.texto].filter(Boolean).join('\n\n');
// El seguro: solo se escribe al contacto real si modo_prueba es exactamente false
const prueba = cfg.modo_prueba !== false;
const destinatario = prueba ? cfg.email_pruebas : c.email;

const avisos = [];
if (prueba) avisos.push('Modo prueba: se enviará a ' + cfg.email_pruebas + ', no a ' + c.email);
if (c.verificado !== 'valido') avisos.push('Email sin confirmar (' + (c.verificado || 'sin dato') + '): puede rebotar');
if (!firma.length) avisos.push('Falta firma_email en la config');
if (!baja.texto) avisos.push('Falta texto_baja en la config');
else if (!baja.en_su_idioma) avisos.push('La línea de baja no está en su idioma (' + idiomaEmail + ')');

return { json: { ...c, valido: true, asunto: String(ia.asunto).trim(), cuerpo, idioma_email: idiomaEmail, recurso_ofrecido: ia.recurso_ofrecido || '', destinatario, modo_prueba: prueba, remitente: firma[0] || cfg.negocio_nombre, avisos } };
