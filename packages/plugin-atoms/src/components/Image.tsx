import { useComponentUtils } from '@ima/react-page-renderer';
import { ComponentPropsWithoutRef, memo } from 'react';
import type { ValueOf } from 'type-fest';

import { DECODING, LAYOUT, LOADING } from './constants';

export const Image = memo(function ImageComponent({
  src,
  layout,
  className,
  //width,
  //height,
  loading = LOADING.LAZY,
  decoding = DECODING.ASYNC,
  //style = {},
  placeholder = true,
  ...rest
}: {
  src: string;
  /** Responsive image layout requires parent element to be at least position: relative */
  layout?: ValueOf<typeof LAYOUT>;
  className?: string;
  //width?: string | number;
  //height?: string | number;
  //loading?: ValueOf<typeof LOADING>;
  //decoding?: ValueOf<typeof DECODING>;
  //style?: CSSProperties;
  placeholder?: boolean;
} & Omit<ComponentPropsWithoutRef<'img'>, 'placeholder'>) {
  const { $CssClasses, $UIComponentHelper } = useComponentUtils();
  // let imgStyle: CSSProperties = { ...style };

  // if (layout === LAYOUT.RESPONSIVE) {
  //   imgStyle = Object.assign(
  //     imgStyle,
  //     {
  //       color: 'transparent',
  //       width: '100%',
  //       height: 'auto',
  //     },
  //     imgStyle
  //   );
  // }

  // if (layout === LAYOUT.FILL) {
  //   imgStyle = Object.assign(
  //     imgStyle,
  //     {
  //       color: 'transparent',
  //       position: 'absolute',
  //       height: '100%',
  //       width: '100%',
  //       inset: '0',
  //       objectFit: 'cover',
  //     },
  //     imgStyle
  //   );
  // }

  return (
    <img
      {...rest}
      src={$UIComponentHelper.sanitizeUrl(src)}
      // width={width}
      // height={height}
      loading={loading}
      decoding={decoding}
      // style={imgStyle}
      className={$CssClasses(
        {
          'atm-image': true,
          'atm-layout-responsive': layout === LAYOUT.RESPONSIVE,
          'atm-layout-fill': layout === LAYOUT.FILL,
          'atm-placeholder': placeholder, // @TODO
        },
        className
      )}
    />
  );
});
