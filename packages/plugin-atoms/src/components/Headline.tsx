import { useComponentUtils } from '@ima/react-page-renderer';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { memo } from 'react';

import { HEADLINE_ATTRIBUTES } from './constants';
import { filterProps } from './filterProps';

export const HeadlineType = Object.freeze({
  H1: 'h1',
  H2: 'h2',
  H3: 'h3',
  H4: 'h4',
  H5: 'h5',
  H6: 'h6',
});

export function headlineFactory(factoryType: HeadlineType | null = null) {
  return memo(function HeadlineComponent({
    children,
    html = '',
    className,
    type = HeadlineType.H1,
    ...rest
  }: {
    children?: ReactNode;
    html?: string | TrustedHTML;
    className?: string;
    type?: HeadlineType;
  } & ComponentPropsWithoutRef<'h1'>) {
    const { $CssClasses } = useComponentUtils();
    const Type = factoryType ?? type;
    const attributes = filterProps(rest, HEADLINE_ATTRIBUTES);

    const headlineClassName = $CssClasses(
      {
        'atm-headline': true,
        ['atm-headline-' + Type]: true,
      },
      className
    );

    if (children) {
      return (
        <Type {...attributes} className={headlineClassName}>
          {children}
        </Type>
      );
    } else {
      return (
        <Type
          {...attributes}
          className={headlineClassName}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      );
    }
  });
}

export type HeadlineType = (typeof HeadlineType)[keyof typeof HeadlineType]; // Type alias for constants
export const Headline = headlineFactory();
export const Headline1 = headlineFactory(HeadlineType.H1);
export const Headline2 = headlineFactory(HeadlineType.H2);
export const Headline3 = headlineFactory(HeadlineType.H3);
export const Headline4 = headlineFactory(HeadlineType.H4);
export const Headline5 = headlineFactory(HeadlineType.H5);
export const Headline6 = headlineFactory(HeadlineType.H6);
