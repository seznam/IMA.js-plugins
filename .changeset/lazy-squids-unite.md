---
"@ima/plugin-testing-integration": patch
---

Fix support for Node 19+, which encounters `TypeError: Failed to execute 'dispatchEvent' on 'EventTarget': parameter 1 is not of type 'Event'.`. As a hotfix, we are now replacing `global.CustomEvent` (which comes with Node 19) with jsdom version of `CustomEvent` to keep the same behavior as in Node 18.
