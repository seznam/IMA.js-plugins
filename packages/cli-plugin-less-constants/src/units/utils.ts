export type PropertyValue = string | number | Unit;

export interface Unit {
  __propertyDeclaration: true;
  valueOf: () => string | number;
  toString: () => string;
}

export interface MediaUnit {
  __mediaQuery: true;
  valueOf: () => string;
  toString: () => string;
}
export interface MapUnit {
  __lessMap: true;
  valueOf: (key?: string) => Record<string, PropertyValue> | PropertyValue;
  toString: () => string;
}

export interface ThemeUnit {
  __theme: true;
  valueOf: (key?: string) => Record<string, PropertyValue> | PropertyValue;
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
