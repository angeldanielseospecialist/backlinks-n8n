// Convierte lo que eligió la IA en filas para el Sheet: solo URLs de la lista y sin repetir
const candidatos = $('A · Blog: candidatos por idioma').all().map(i => i.json);
const filas = [];
const vistas = new Set();
$input.all().forEach((item, k) => {
  const c = candidatos[k] || {};
  const recursos = (item.json.output && item.json.output.recursos) || [];
  for (const r of recursos) {
    const url = String(r.url || '').trim();
    if (!url || !(c.urls || []).includes(url) || vistas.has(url)) continue;
    vistas.add(url);
    // "propuesto" no cuenta como activo: marketing lo cambia a "sí" si lo quiere usar
    filas.push({ json: { url, para_que_sirve: String(r.para_que_sirve || '').trim(), idiomas: c.idioma, activo: 'propuesto' } });
  }
});
return filas;
