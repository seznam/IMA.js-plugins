import { useComponentUtils } from '@ima/react-page-renderer';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { memo } from 'react';

import { PARAGRAPH_ATTRIBUTES } from './constants';
import { filterProps } from './filterProps';

export const Paragraph = memo(function ParagraphComponent({
  className,
  children,
  html = '',
  ...rest
}: {
  children?: ReactNode;
  html?: string | TrustedHTML;
  className?: string;
} & ComponentPropsWithoutRef<'p'>) {
  const { $CssClasses } = useComponentUtils();
  const paragraphClassName = $CssClasses(
    {
      'atm-paragraph': true,
    },
    className
  );
  const attributes = filterProps(rest, PARAGRAPH_ATTRIBUTES);

  if (children) {
    return (
      <p {...attributes} className={paragraphClassName}>
        {children}
      </p>
    );
  } else {
    return (
      <p
        {...attributes}
        className={paragraphClassName}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }
});
