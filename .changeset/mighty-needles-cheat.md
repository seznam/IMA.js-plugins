---
"@ima/plugin-testing-integration": major
---

Refactor: `@ima/plugin-testing-integration` now relies on `@ima/testing-library` for JSDOM initialization, component rendering and environment configuration.

- **What**
    - **Removed JSDOM initialization logic** - The plugin no longer manually sets up JSDOM. This is now handled by `@ima/testing-library/jest-preset`.
    - **Added React Testing Library support** - Re-exported RTL utilities (`renderWithContext`, `renderHookWithContext`, `screen`, `waitFor`, etc.) for easy component testing with IMA context.
    - **Fixed environment configuration** - Environment is now always set from plugin configuration (`environment: 'test'`) instead of being derived from `NODE_ENV`, preventing inconsistent test results.
    - **Removed configuration options**: `masterElementId`, `protocol`, `host`, `locale`, `beforeCreateIMAServer`, `afterCreateIMAServer`, `pageScriptEvalFn`, `processEnvironment`, `applicationFolder` - Use `@ima/testing-library` configuration instead

- **Why** With the introduction of `@ima/testing-library`, much of the infrastructure code for integration testing (JSDOM setup, dictionary generation, server configuration) has been consolidated into a dedicated package. By leveraging this shared infrastructure:
- **How** To migrate existing tests to the new version, follow these steps:

1. **Install required dependencies**:
   ```bash
   npm install @ima/testing-library @testing-library/react --save-dev
   ```

2. **Update jest configuration** to use `@ima/testing-library/jest-preset`:
   ```javascript
   // jest.config.js
   module.exports = {
     preset: '@ima/testing-library/jest-preset',
     // ... rest of config
   };
   ```

3. **Create a setup file** and call `setupImaTestingIntegration()`:
   ```javascript
   // setupTests.js
   import { setupImaTestingIntegration } from '@ima/plugin-testing-integration';
   setupImaTestingIntegration();
   ```

4. **Update jest config** to use the setup file:
   ```javascript
   module.exports = {
     preset: '@ima/testing-library/jest-preset',
     setupFiles: ['<rootDir>/setupTests.js'],
   };
   ```

5. **Remove manual JSDOM initialization** - If you had custom JSDOM setup, remove it.

6. **Update configuration** - Remove unsupported config options (`protocol`, `host`, `locale`, etc.). Use `@ima/testing-library` server configuration if needed.

7. **Optional: Use React Testing Library** for component testing:
   ```javascript
   import { initImaApp, clearImaApp, renderWithContext, screen } from '@ima/plugin-testing-integration';
   
   const { container } = await renderWithContext(<MyComponent />, { app });
   expect(screen.getByText('Hello')).toBeInTheDocument();
   ```

See README.md for complete migration guide and examples.
