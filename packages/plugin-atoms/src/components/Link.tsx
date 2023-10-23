import { useComponentUtils } from '@ima/react-page-renderer';
import { ComponentPropsWithoutRef, ReactNode, memo } from 'react';

import { LINK_ATTRIBUTES } from './constants';
import { filterProps } from './filterProps';

export const Link = memo(function LinkComponent({
  href,
  children,
  text,
  className,
  ...rest
}: {
  href: string;
  children?: ReactNode;
  text?: string;
  className?: string;
} & ComponentPropsWithoutRef<'a'>) {
  const { $CssClasses, $UIComponentHelper } = useComponentUtils();
  const linkClassName = $CssClasses(
    {
      'atm-link': true,
    },
    className
  );
  const attributes = filterProps(rest, LINK_ATTRIBUTES);

  return (
    <a
      {...attributes}
      href={$UIComponentHelper.sanitizeUrl(href)}
      className={linkClassName}
    >
      {children || text}
    </a>
  );
});
