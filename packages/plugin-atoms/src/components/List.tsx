import { useComponentUtils } from '@ima/react-page-renderer';
import { ComponentPropsWithoutRef, ReactNode, memo } from 'react';

export enum ListType {
  UL = 'ul',
  OL = 'ol',
}

export function listFactory(Type: ListType = ListType.UL) {
  return memo(function ListComponent({
    children,
    className,
    ...rest
  }: {
    children?: ReactNode;
    html?: string;
    className?: string;
  } & ComponentPropsWithoutRef<'ul'>) {
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

export const OrderedList = listFactory(ListType.OL);
export const UnorderedList = listFactory(ListType.UL);
export const List = UnorderedList;
