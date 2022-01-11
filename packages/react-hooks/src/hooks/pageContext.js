import { useContext } from 'react';

import { GenericError, PageContext } from '@ima/core';

/**
 * Provides direct access to IMA Page context.
 *
 * @example
 * const pageContext = usePageContext();
 *
 * @return {React.Consumer} IMA.js PageContext
 */
function usePageContext() {
  const context = useContext(PageContext);

  if (typeof context === 'undefined') {
    throw new GenericError(
      'The usePageContext hook must be used within PageContext.Provider.'
    );
  }

  return context;
}

export { usePageContext };
