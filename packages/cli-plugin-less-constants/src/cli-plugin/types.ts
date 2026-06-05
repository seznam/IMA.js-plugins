import type { MapUnit, MediaUnit, ThemeUnit, Unit } from '../units';

export type DefaultTheme = 'light' | 'dark';
export type Themes = [DefaultTheme] | ['light', 'dark', ...string[]];

export type UnitValue =
  | Record<string, unknown>
  | string
  | number
  | boolean
  | Unit
  | MapUnit
  | MediaUnit
  | ThemeUnit;
