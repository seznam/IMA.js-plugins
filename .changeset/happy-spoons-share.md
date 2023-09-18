---
"@ima/plugin-testing-integration": patch
---

Fix error in IMA.js boot methods, when they return an object with circular dependency. This led to an infinite loop and fatal crash of integraiton test.
