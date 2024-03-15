import { useComponentUtils } from '@ima/react-page-renderer';
import type { ComponentPropsWithoutRef } from 'react';
import { memo } from 'react';

import { DIV_ATTRIBUTES } from './constants';
import { filterProps } from './filterProps';

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
  const attributes = filterProps(rest, DIV_ATTRIBUTES);

  return (
    <div
      {...attributes}
      className={$CssClasses(
        {
          'atm-sizer': true,
          'atm-placeholder': placeholder,
        },
        className
      )}
      style={{
        paddingTop: (height / width) * 100 + '%',
      }}
    />
  );
});
