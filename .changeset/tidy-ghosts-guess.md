---
"@ima/plugin-script-loader": minor
---

Added ESM script loading support with new configuration options:

- `module: true` - Load scripts as ES modules with `type="module"`
- `async: boolean` - Control async loading behavior
- `attributes` - Set custom attributes on script elements

The `load()` method now accepts an optional `ScriptLoaderOptions` parameter while maintaining backward compatibility.
