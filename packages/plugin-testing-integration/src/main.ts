import { initImaApp, clearImaApp } from './app';
import { getConfig, setConfig } from './configuration';

// Re-export React Testing Library functions from @ima/testing-library
export {
  renderWithContext,
  renderHookWithContext,
  getContextValue,
  // Re-export all RTL utilities
  screen,
  waitFor,
  waitForElementToBeRemoved,
  within,
  fireEvent,
  act,
} from '@ima/testing-library';

// Re-export setup function for configuring @ima/testing-library
export { setupImaTestingIntegration } from './setup';

export { getConfig, setConfig, initImaApp, clearImaApp };
