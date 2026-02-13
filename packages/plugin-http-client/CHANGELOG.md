# @ima/plugin-http-client

## 3.0.1

### Patch Changes

- b0f4411: Remove option OPTION_TRANSFORM_PROCESSORS after it is used in HttpClient.
  - **What?** Remove option OPTION_TRANSFORM_PROCESSORS after it is used in HttpClient.
  - **Why?** We don't want to pass this option to HttpAgent (it tries to serialize it and throws an error).
  - **How?** Nothing.

## 3.0.0

### Major Changes

- 4851e46: Bump to ima@20, set TS target to 2024, drop support for ima@20-rc versions

## 2.1.5

### Patch Changes

- 384a32d: Added compatibility with ima@20 rc versions

## 2.1.4

### Patch Changes

- 8e6bba3: Fixed types
  - **What?** Allowed partial use of HttpAgentRequestOptions in HttpClientRequestOptions
  - **Why?** The create() method (and another in AbstractRecource) expected a parameter of type HttpClientRequestOptions, but passing only fetchOptions caused an error - TypeScript required all mandatory fields from HttpAgentRequestOptions (timeout, ttl atd.).
  - **How?** Nothing.

## 2.1.3

### Patch Changes

- 8f5d01a: Fixed build issues with client server config

## 2.1.2

### Patch Changes

- e2eeb2b: Turbo, eslint update, types exports, new tsconfig

## 2.1.1

### Patch Changes

- 6d92917: Code refactorings, moved type extensions to separate file to cleanup main.ts

## 2.1.0

### Minor Changes

- 3194515: Make some method public for better overriding

## 2.0.1

### Patch Changes

- deb410a: Added method invalidateCache

## 2.0.0

### Major Changes

- e5ba79b: Init version of http-client
