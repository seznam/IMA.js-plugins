import { useComponentUtils } from '@ima/react-page-renderer';
import { memo } from 'react';

export const Paragraph = memo(function ParagraphComponent({
  className,
  children,
  html,
  ...rest
}) {
  const { $CssClasses } = useComponentUtils();
  let paragraphClassName = $CssClasses(
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
