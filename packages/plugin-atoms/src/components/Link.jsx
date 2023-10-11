import { useComponentUtils } from '@ima/react-page-renderer';
import { memo } from 'react';

export const Link = memo(function LinkComponent({
  href,
  children,
  text,
  className,
  ...rest
}) {
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
