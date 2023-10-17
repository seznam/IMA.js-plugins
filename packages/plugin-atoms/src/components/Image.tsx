import { useComponentUtils } from '@ima/react-page-renderer';
import { ComponentPropsWithoutRef, memo } from 'react';
import type { ValueOf } from 'type-fest';

import { LAYOUT, LOADING } from './constants';

export const Image = memo(function ImageComponent({
  src,
  layout,
  className,
  loading = LOADING.LAZY,
  decoding = 'async',
  placeholder = true,
  ...rest
}: {
  src: string;
  /** Responsive image layout requires parent element to be at least position: relative */
  layout?: ValueOf<typeof LAYOUT>;
  className?: string;
  loading?: ValueOf<typeof LOADING>;
  placeholder?: boolean;
} & Omit<ComponentPropsWithoutRef<'img'>, 'placeholder'>) {
  const { $CssClasses, $UIComponentHelper } = useComponentUtils();

  return (
    <img
      {...rest}
      src={$UIComponentHelper.sanitizeUrl(src)}
      loading={loading}
      decoding={decoding}
      className={$CssClasses(
        {
          'atm-image': true,
          'atm-layout-responsive': layout === LAYOUT.RESPONSIVE,
          'atm-layout-fill': layout === LAYOUT.FILL,
          'atm-placeholder': placeholder,
        },
        className
      )}
    />
  );
});
