import { useComponentUtils } from '@ima/react-page-renderer';
import { memo } from 'react';

export const Sizer = memo(function SizerComponent({
  className,
  height,
  width,
  placeholder,
  ...rest
}) {
  const { $CssClasses } = useComponentUtils();
  const sizerClassName = $CssClasses(
    {
      'atm-sizer': true,
      'atm-placeholder': placeholder,
    },
    className
  );

  return (
    <div
      {...rest}
      className={sizerClassName}
      style={{
        paddingTop: (height / width) * 100 + '%',
      }}
    />
  );
});
