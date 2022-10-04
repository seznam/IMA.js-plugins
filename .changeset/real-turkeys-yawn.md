---
"@ima/plugin-testing-integration": patch
---

Initialize JSDom before we start importing project files, since some packages can do some client/server detection at this point
