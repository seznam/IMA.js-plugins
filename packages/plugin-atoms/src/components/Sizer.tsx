import { useComponentUtils } from '@ima/react-page-renderer';
import { ComponentPropsWithoutRef, memo } from 'react';

export const Sizer = memo(function SizerComponent({
  className,
  height,
  width,
  placeholder = false,
  ...rest
}: {
  className?: string;
  height: number;
  width: number;
  placeholder?: boolean;
} & Omit<ComponentPropsWithoutRef<'div'>, 'placeholder'>) {
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
