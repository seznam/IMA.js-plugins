function isListenerAttributes(key: string) {
  return key.startsWith('on') && key.length > 2;
}

function isDataAttributes(key: string) {
  return key.startsWith('data-') && key.length > 5;
}

function isAriaAttributes(key: string) {
  return key.startsWith('aria-') && key.length > 5;
}

export function filterProps(
  props: Record<string, unknown>,
  attributes: string[]
) {
  return Object.keys(props).reduce((result, key) => {
    const keyLowerCased = key?.toLocaleLowerCase();
    if (
      keyLowerCased &&
      (attributes.includes(keyLowerCased) ||
        isListenerAttributes(keyLowerCased) ||
        isDataAttributes(keyLowerCased) ||
        isAriaAttributes(keyLowerCased))
    ) {
      result[key] = props[key];
    }

    return result;
  }, {} as typeof props);
}
