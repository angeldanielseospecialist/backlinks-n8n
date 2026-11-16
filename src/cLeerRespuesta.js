// Traduce la respuesta del formulario a una decisión por borrador: aprobado, descartado o sin_respuesta
const cfg = $('C · Leer Config').first().json;
const borradores = $('C · Preparar formulario').first().json.borradores;
const datos = $input.first().json.data || {};
const valores = Object.values(datos);
const etiqueta = b => b.dominio_raiz + ' · ' + b.email;

// La pregunta obligatoria sobre los no marcados dice si alguien respondió
const resto = datos['Los que no marques'] ?? valores.find(v => typeof v === 'string' && v.length < 40 && /descart|cola/i.test(v));
const respondio = Boolean(resto);
const descartarResto = respondio && /descart/i.test(String(resto));

let marcados = datos['Emails que apruebas'] ?? valores.find(v => Array.isArray(v)) ?? [];
if (!Array.isArray(marcados)) marcados = String(marcados).split(',').map(s => s.trim()).filter(Boolean);

// Pausa entre envíos, de la config (3 a 8 minutos si está vacía)
const min = Number(cfg.pausa_min_envio) || 3;
const max = Math.max(min, Number(cfg.pausa_max_envio) || 8);

const salida = borradores.map(b => {
  let decision = 'sin_respuesta';
  if (respondio && marcados.includes(etiqueta(b))) decision = 'aprobado';
  else if (descartarResto) decision = 'descartado';
  return { ...b, decision, pausa: min + Math.floor(Math.random() * (max - min + 1)), ultimo: false };
});
// Tras el último envío no hace falta esperar
const aprobados = salida.filter(b => b.decision === 'aprobado');
if (aprobados.length) aprobados[aprobados.length - 1].ultimo = true;

return salida.map(b => ({ json: b }));
