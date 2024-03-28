import type LocalStorage from './LocalStorage';

declare module '@ima/core' {
  interface Utils {
    LocalStorage: LocalStorage;
  }
}

export {};
