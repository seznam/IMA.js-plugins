import { useComponentUtils } from '@ima/react-page-renderer';
import { memo } from 'react';

export const ListItem = memo(function ListItemComponent({
  children,
  html,
  className,
  ...rest
}) {
  const { $CssClasses } = useComponentUtils();
  const listItemClassName = $CssClasses(
    {
      'atm-li': true,
    },
    className
  );

  if (children) {
    return (
      <li {...rest} className={listItemClassName}>
        {children}
      </li>
    );
  } else {
    return (
      <li
        {...rest}
        className={listItemClassName}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }
});
