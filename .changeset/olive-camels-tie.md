---
"@ima/plugin-http-client": patch
---

Fixed types

- **What?** Allowed partial use of HttpAgentRequestOptions in HttpClientRequestOptions
- **Why?** The create() method (and another in AbstractRecource) expected a parameter of type HttpClientRequestOptions, but passing only fetchOptions caused an error - TypeScript required all mandatory fields from HttpAgentRequestOptions (timeout, ttl atd.).
- **How?** Nothing.