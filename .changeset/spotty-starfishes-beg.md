---
"@ima/plugin-atoms": patch
---

Summary enum unification

- **What:** replaced enum HeadlineType for plain object
- **Why:** enum is not supported type (TypeScript enums are not part of the TC39 proposal)
- **How:** nothing