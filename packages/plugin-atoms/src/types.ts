import type UIComponentHelper from './UIComponentHelper';

declare module '@ima/core' {
  interface Utils {
    $UIComponentHelper: UIComponentHelper;
  }
}

export {};
