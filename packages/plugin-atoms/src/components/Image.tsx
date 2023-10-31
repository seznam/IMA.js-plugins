import { useComponentUtils } from '@ima/react-page-renderer';
import { ComponentPropsWithoutRef, memo, useCallback, useState } from 'react';
import type { ValueOf } from 'type-fest';

import { LAYOUT, LOADING, IMAGE_ATTRIBUTES } from './constants';
import { filterProps } from './filterProps';

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
  const attributes = filterProps(rest, IMAGE_ATTRIBUTES);
  
  const [loaded, setLoaded] = useState(loading === LOADING.EAGER);
  const loadCallback = useCallback((...params: any[]) => {
    if (typeof attributes?.onLoad === 'function') {
      attributes?.onLoad(...params);
    }
    setLoaded(true);
  }, [attributes.onLoad]);
  const errorCallback = useCallback((...params: any[]) => {
    if (typeof attributes?.onError === 'function') {
      attributes?.onError(...params);
    }
    setLoaded(true);
  }, [attributes.onError]);

  return (
    <img
      {...attributes}
      onLoad={loadCallback}
      onError={errorCallback}
      src={$UIComponentHelper.sanitizeUrl(src)}
      loading={loading}
      decoding={decoding}
      className={$CssClasses(
        {
          'atm-image': true,
          'atm-layout-responsive': layout === LAYOUT.RESPONSIVE,
          'atm-layout-fill': layout === LAYOUT.FILL,
          'atm-placeholder': !loaded && placeholder,
        },
        className
      )}
    />
  );
});
