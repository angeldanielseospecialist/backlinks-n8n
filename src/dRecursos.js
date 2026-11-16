// Junta los recursos activos del Sheet de marketing en un texto para la IA
const recursos = $input.all().map(i => i.json)
  .filter(r => r.url && /^s/i.test(String(r.activo || '').trim()))
  .map(r => '- ' + String(r.url).trim() + ' | ' + String(r.para_que_sirve || '').trim() + ' | ' + (String(r.idiomas || '').trim() || 'todos'));
return [{ json: { hay: recursos.length > 0, texto: recursos.join('\n') || '(ninguno todavía)' } }];
