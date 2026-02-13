---
"@ima/plugin-http-client": patch
---

Remove option OPTION_TRANSFORM_PROCESSORS after it is used in HttpClient.

  - **What?** Remove option OPTION_TRANSFORM_PROCESSORS after it is used in HttpClient.
  - **Why?** We don't want to pass this option to HttpAgent (it tries to serialize it and throws an error).
  - **How?** Nothing.
