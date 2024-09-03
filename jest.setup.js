/**
 * Load the main plugin file to trigger the pluginLoader registration.
 */
beforeAll(async () => {
  await import('src/main.ts');
});
