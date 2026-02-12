---
"@ima/plugin-http-client": patch
---

Remove option OPTION_TRANSFORM_PROCESSORS after use it in HttpClient.

  - **What?** Remove option OPTION_TRANSFORM_PROCESSORS after use it in HttpClient.
  - **Why?** We don't want to pass this option to HttpAgent (it tries to serialize it and throws an error).
  - **How?** Nothing.
