---
"@ima/plugin-testing-integration": minor
---

Added `beforeCreateIMAServer` and `afterCreateIMAServer` hooks to configuration, allowing custom logic execution before and after IMA server creation. You can use this new options in `setConfig`. If you have some IMA server hooks, that need to be executed in tests, you can now attach them using these new configurations.
