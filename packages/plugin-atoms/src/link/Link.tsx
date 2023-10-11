import { useComponentUtils } from '@ima/react-page-renderer';
import { ComponentPropsWithoutRef, ReactNode, memo } from 'react';

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

  return (
    <a
      {...rest}
      href={$UIComponentHelper.sanitizeUrl(href)}
      className={linkClassName}
    >
      {children || text}
    </a>
  );
});
