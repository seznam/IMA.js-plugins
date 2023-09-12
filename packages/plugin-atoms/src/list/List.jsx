import { useComponentUtils } from '@ima/react-page-renderer';
import { memo } from 'react';

export function listFactory(Type) {
  return memo(function ListComponent({ children, className, ...rest }) {
    const { $CssClasses } = useComponentUtils();

    const listClassName = $CssClasses(
      {
        'atm-list': true,
        ['atm-list-' + Type]: true,
      },
      className
    );

    return (
      <Type {...rest} className={listClassName}>
        {children}
      </Type>
    );
  });
}

export const List = listFactory('ul');
export const OrderedList = listFactory('ol');
export const UnorderedList = List;
