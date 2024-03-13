import type AbstractUserAgent from './AbstractUserAgent';

declare module '@ima/core' {
  interface Utils {
    UserAgent: AbstractUserAgent;
  }
}

export {};
