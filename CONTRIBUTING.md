# Cómo contribuir

¡Gracias por tu interés en mejorar **backlinks-n8n**! Esta guía explica cómo reportar problemas,
proponer mejoras y enviar cambios.

> **English speakers:** contributions in English are welcome. Issues and pull requests can be
> written in English or Spanish; the repository documentation is in Spanish.

## Antes de empezar

- Lee el [README](README.md) y, si vas a tocar el workflow, [docs/desarrollo.md](docs/desarrollo.md).
- Revisa los [issues abiertos](https://github.com/angeldanielseospecialist/backlinks-n8n/issues) y
  el [ROADMAP](ROADMAP.md) para no duplicar trabajo.
- Para un cambio grande (una rama nueva, otra fuente de datos, otro proveedor de IA), abre antes
  un issue y coméntalo.

## Reportar un problema

Abre un [issue](https://github.com/angeldanielseospecialist/backlinks-n8n/issues/new) con:

- **Versión de n8n** y dónde corre (n8n Cloud, servidor propio o Docker en local).
- **La rama y el nodo** donde falla (por ejemplo, *B · Hunter: buscar email*).
- **El mensaje de error** y qué esperabas que pasara.
- Los pasos para reproducirlo, si los conoces.

> ⚠️ **No pegues datos reales:** ni claves de API, ni correos, ni dominios de tus contactos, ni
> capturas con datos de tus tablas. Sustitúyelos por ejemplos (`nombre@ejemplo.com`,
> `miempresa.com`).

## Proponer una mejora

Abre un issue explicando **qué problema resuelve** y cómo lo harías. Si encaja, se añadirá al
[ROADMAP](ROADMAP.md).

## Enviar cambios (pull requests)

### Flujo de ramas

| Rama | Para qué |
|---|---|
| `main` | Versión estable. Solo recibe cambios desde `develop` |
| `develop` | Rama de trabajo. **Todos los pull requests van aquí** |

1. Haz un *fork* del repositorio y clónalo.
2. Crea tu rama a partir de `develop`:

   ```bash
   git switch develop
   git switch -c fix/nombre-corto
   ```

   Usa un prefijo según el tipo de cambio: `fix/`, `feat/`, `docs/` o `chore/`.
3. Haz tus cambios siguiendo las reglas de abajo.
4. Abre el pull request **contra `develop`**, explicando qué cambia y por qué.

### Reglas para los workflows

Los JSON de [`workflows/`](workflows/) son una **plantilla**: no pueden llevar nada de tu
instancia de n8n.

- **IDs de Data Tables** → marcador `__DATA_TABLE_<nombre_de_la_tabla>__`.
- **IDs de credenciales** → marcador `__CREDENTIAL_<SERVICIO>__`, conservando su `name`.
- **Sin** `id` ni `versionId` en la raíz, sin bloque `meta`, con `pinData` vacío y sin notas
  adhesivas.
- **Sin datos reales:** correos, dominios, nombres de personas, URLs de tu instancia ni claves.

Cómo convertir una exportación de tu n8n en plantilla: [docs/desarrollo.md](docs/desarrollo.md).

### Reglas generales

- **Mantén `src/` sincronizado:** si cambias un prompt o un nodo *Code* del workflow, actualiza su
  copia en [`src/`](src/), y al revés.
- **No renombres nodos, tablas ni columnas** sin actualizar todas sus referencias: las expresiones
  de n8n usan nombres, como `$('C · Leer Config')`.
- **Actualiza la documentación** de [`docs/`](docs/) si cambias el comportamiento, y el README en
  sus dos idiomas si afecta a la instalación o al uso.
- **La documentación se escribe en español.**

### Mensajes de commit

En **inglés**, breves y en imperativo, describiendo qué cambia:

```
Fix duplicate contacts in branch B
Add sheet_id column to config
Update installation guide
```

### Antes de abrir el pull request

Comprueba que los workflows no llevan IDs reales y que el script de importación sigue funcionando:

```bash
# Los workflows son JSON válido y solo llevan marcadores de Data Tables
node -e "for (const f of ['backlinks','errores-backlinks','test-apis']) { const w = require('./workflows/' + f + '.json'); const malos = w.nodes.filter(n => n.parameters?.dataTableId && !/^__DATA_TABLE_[a-z_]+__$/.test(n.parameters.dataTableId.value)); console.log(f, w.nodes.length, 'nodos', malos.length ? 'IDS REALES: ' + malos.map(n => n.name) : 'ok'); }"

# El script de importación funciona (con un archivo de IDs de prueba)
node scripts/prepare-import.mjs <ruta-a-ids-de-prueba.json>

# No hay correos reales (solo deben salir los de ejemplo)
git grep -nE "[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[a-z]{2,}"
```

Y, si cambiaste el workflow, pruébalo en tu n8n con `modo_prueba` activado.

## Usar un asistente de IA

Si trabajas con Claude Code, Codex, Cursor u otro agente, [AGENTS.md](AGENTS.md) le da el
contexto del repo y estas mismas reglas.

## Licencia

Al contribuir, aceptas que tu aportación se publique bajo la [licencia MIT](LICENSE) del proyecto.
