export type CssValue = string | number;

export interface Unit {
  __propertyDeclaration: boolean;
  valueOf: () => CssValue;
  toString: () => string;
}

export interface MediaUnit {
  __mediaQuery: boolean;
  valueOf: () => string;
  toString: () => string;
}
export interface MapUnit {
  __lessMap: boolean;
  valueOf: (key?: string) => Record<string, CssValue | Unit> | CssValue;
  toString: () => string;
}

export interface ThemeUnit {
  __theme: boolean;
  valueOf: (key?: string) => Record<string, CssValue | Unit> | CssValue;
  toString: () => string;
}

export function sizeUnitFactory(unit: string) {
  return (size: number): Unit => asUnit(unit, [size]);
}

export function asUnit(
  unit: string,
  parts: (string | number)[],
  template = '${parts}${unit}'
): Unit {
  return {
    __propertyDeclaration: true,

    valueOf(): string | number {
      if (parts.length !== 1) {
        return this.toString();
      }

      return parts[0]!;
    },

    toString(): string {
      return template
        .replace('${parts}', parts.join(','))
        .replace('${unit}', unit);
    },
  };
}

export function asMedia(query: string): MediaUnit {
  return {
    __mediaQuery: true,

    valueOf(): string {
      return query;
    },

    toString(): string {
      return query;
    },
  };
}
