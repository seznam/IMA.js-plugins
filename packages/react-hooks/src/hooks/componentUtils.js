import { usePageContext } from './pageContext';

/**
 * Provides direct access to ComponentUtils.
 *
 * @example
 * const utils = useComponentUtils();
 *
 * @return {Object<string, Object>} IMA.js ComponentUtils
 */
function useComponentUtils() {
  const pageContext = usePageContext();

  return pageContext.$Utils || {};
}

export { useComponentUtils };
