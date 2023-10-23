function isListenerAttributes(key: string) {
  return key.startsWith('on');
}

function isDataAttributes(key: string) {
  return key.startsWith('data-');
}

function isAriaAttributes(key: string) {
  return key.startsWith('aria-');
}

export function filterProps(
  props: Record<string, unknown>,
  attributes: string[]
) {
  return Object.keys(props).reduce((result, key) => {
    const keyLowerCased = key?.toLocaleLowerCase();
    if (
      attributes.includes(keyLowerCased) ||
      isListenerAttributes(keyLowerCased) ||
      isDataAttributes(keyLowerCased) ||
      isAriaAttributes(keyLowerCased)
    ) {
      result[key] = props[key];
    }

    return result;
  }, {} as typeof props);
}
