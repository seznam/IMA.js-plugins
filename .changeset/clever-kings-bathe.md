---
"@ima/plugin-atoms": minor
---

Use observable instead of Dispatcher to listen on route change events. 

- **What?** Use observable instead of Dispatcher to listen on route change events.
- **Why?** There was a bug that AFTER_HANDLE_ROUTE was triggered before there were any registered items in Circle. So the listener was not listening.
- **How?** Nothing.
