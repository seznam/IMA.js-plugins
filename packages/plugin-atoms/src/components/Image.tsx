import { useComponentUtils } from '@ima/react-page-renderer';
import { CSSProperties, ComponentPropsWithoutRef, memo } from 'react';

import { LAYOUT } from './layout';

export const Image = memo(function ImageComponent({
  src,
  layout, // keep for compatability
  className,
  width,
  height,
  loading = 'lazy',
  decoding = 'async',
  style = {},
  placeholder = true,
  ...rest
}: {
  src: string;
  /** Responsive image layout requires parent element to be atleast position: relative */
  layout?: LAYOUT;
  className?: string;
  width?: string | number;
  height?: string | number;
  loading?: 'eager' | 'lazy';
  decoding?: 'sync' | 'async' | 'auto';
  style?: CSSProperties;
  placeholder?: boolean;
} & Omit<ComponentPropsWithoutRef<'img'>, 'placeholder'>) {
  const { $CssClasses, $UIComponentHelper } = useComponentUtils();
  let imgStyle: CSSProperties = { ...style };

  if (layout === LAYOUT.RESPONSIVE) {
    imgStyle = Object.assign(
      imgStyle,
      {
        width: '100%',
        height: 'auto',
      },
      imgStyle
    );
  }

  if (layout === LAYOUT.FILL) {
    imgStyle = Object.assign(
      imgStyle,
      {
        position: 'absolute',
        height: '100%',
        width: '100%',
        inset: '0',
        objectFit: 'cover',
      },
      imgStyle
    );
  }

  return (
    <img
      {...rest}
      src={$UIComponentHelper.sanitizeUrl(src)}
      width={width}
      height={height}
      loading={loading}
      decoding={decoding}
      style={imgStyle}
      className={$CssClasses(
        {
          'atm-image': true,
          'atm-placeholder': placeholder,
        },
        className
      )}
    />
  );
});
