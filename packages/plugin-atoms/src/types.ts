import type UIComponentHelper from './UIComponentHelper';

declare module '@ima/core' {
  interface OCAliasMap {
    $UIComponentHelper: UIComponentHelper;
  }

  interface Utils {
    $UIComponentHelper: UIComponentHelper;
  }
}

export {};
