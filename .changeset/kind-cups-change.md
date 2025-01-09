---
"@ima/plugin-select": patch
---

Fix displayName value for components wrapped with `select` HOC. This should resolve the issue with `Component.displayName` being `withContext(undefined)`.
