import { useComponentUtils } from '@ima/react-page-renderer';
import { ComponentPropsWithoutRef, ReactNode, memo } from 'react';

import { LIST_ITEM_ATTRIBUTES } from './constants';
import { filterProps } from './filterProps';

export const ListItem = memo(function ListItemComponent({
  children,
  html = '',
  className,
  ...rest
}: {
  children?: ReactNode;
  html?: string;
  className?: string;
} & ComponentPropsWithoutRef<'li'>) {
  const { $CssClasses } = useComponentUtils();
  const listItemClassName = $CssClasses(
    {
      'atm-li': true,
    },
    className
  );
  const attributes = filterProps(rest, LIST_ITEM_ATTRIBUTES);

  if (children) {
    return (
      <li {...attributes} className={listItemClassName}>
        {children}
      </li>
    );
  } else {
    return (
      <li
        {...attributes}
        className={listItemClassName}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }
});
