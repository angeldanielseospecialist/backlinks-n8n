// Una fila por servicio, porque cada uno se mide en su unidad
const r = $input.first().json;
return [
  { json: { accion: 'prospeccion_ahrefs', entidad: r.llamadas_ahrefs + ' llamadas a Ahrefs', resultado: r.candidatos_competidor + ' candidatos, ' + r.nuevos_competidor + ' guardados', coste_estimado: r.coste_ahrefs } },
  { json: { accion: 'prospeccion_serpapi', entidad: r.busquedas + ' búsquedas', resultado: r.candidatos_busqueda + ' candidatos, ' + r.nuevos_busqueda + ' guardados', coste_estimado: r.busquedas } }
];