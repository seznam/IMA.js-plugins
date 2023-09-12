import { useComponentUtils } from '@ima/react-page-renderer';
import { memo } from 'react';

export function headlineFactory(factoryType) {
  return memo(function HeadlineComponent({
    children,
    html,
    className,
    type,
    ...rest
  }) {
    const { $CssClasses } = useComponentUtils();
    const Type = factoryType ?? type;

    const headlineClassName = $CssClasses(
      {
        'atm-headline': true,
        ['atm-headline-' + Type]: true,
      },
      className
    );

    if (children) {
      return (
        <Type {...rest} className={headlineClassName}>
          {children}
        </Type>
      );
    } else {
      return (
        <Type
          {...rest}
          className={headlineClassName}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      );
    }
  });
}

export const Headline = headlineFactory();
export const Headline1 = headlineFactory('h1');
export const Headline2 = headlineFactory('h2');
export const Headline3 = headlineFactory('h3');
export const Headline4 = headlineFactory('h4');
export const Headline5 = headlineFactory('h5');
export const Headline6 = headlineFactory('h6');
