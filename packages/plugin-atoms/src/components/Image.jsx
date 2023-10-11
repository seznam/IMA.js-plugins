import { useComponentUtils } from '@ima/react-page-renderer';
import { memo } from 'react';

import { LAYOUT } from './layout';

export const Image = memo(function ImageComponent({
  src,
  layout,
  className,
  width,
  height,
  loading,
  decoding,
  style,
  placeholder,
  ...rest
}) {
  const { $CssClasses, $UIComponentHelper } = useComponentUtils();
  style = style ?? {};

  if (layout === LAYOUT.RESPONSIVE) {
    style = Object.assign(
      style,
      {
        width: '100%',
        height: 'auto',
      },
      style
    );
  }

  if (layout === LAYOUT.FILL) {
    style = Object.assign(
      style,
      {
        position: 'absolute',
        height: '100%',
        width: '100%',
        inset: '0',
        objectFit: 'cover',
      },
      style
    );
  }

  return (
    <>
      <img
        {...rest}
        src={$UIComponentHelper.sanitizeUrl(src)}
        width={width}
        height={height}
        loading={loading ?? 'lazy'}
        decoding={decoding ?? 'async'}
        style={style}
        className={$CssClasses(
          {
            'atm-image': true,
            // 'atm-layout-fill': layout === LAYOUT.FILL,
            // 'atm-layout-responsive': layout === LAYOUT.RESPONSIVE,
            'atm-placeholder': placeholder !== false,
          },
          className
        )}
      />
    </>
  );
});
