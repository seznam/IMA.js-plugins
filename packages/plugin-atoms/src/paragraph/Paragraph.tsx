import { useComponentUtils } from '@ima/react-page-renderer';
import { ComponentPropsWithoutRef, ReactNode, memo } from 'react';

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

  if (children) {
    return (
      <p {...rest} className={paragraphClassName}>
        {children}
      </p>
    );
  } else {
    return (
      <p
        {...rest}
        className={paragraphClassName}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }
});
