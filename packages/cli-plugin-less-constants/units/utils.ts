export interface Unit {
  __propertyDeclaration: boolean;
  valueOf: () => string | number;
  toString: () => string;
}

export interface MapUnit {
  __lessMap: boolean;
  valueOf: (key?: string) => Record<string, number> | number;
  toString: () => string;
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

      return parts[0];
    },

    toString(): string {
      return template
        .replace('${parts}', parts.join(','))
        .replace('${unit}', unit);
    },
  };
}
