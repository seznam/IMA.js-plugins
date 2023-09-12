import { useComponentUtils } from '@ima/react-page-renderer';
import { memo } from 'react';

const IMAGE_LAYOUT = {
  RESPONSIVE: 'responsive',
  FILL: 'fill',
};

export const Image = memo(function ImageComponent({
  src,
  layout, // keep for compatability
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

  if (layout === IMAGE_LAYOUT.RESPONSIVE) {
    style = Object.assign(
      style,
      {
        width: '100%',
        height: 'auto',
      },
      style
    );
  }

  // TODO DOC parent element must set at least position: relative;
  if (layout === IMAGE_LAYOUT.FILL) {
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
            'atm-placeholder': placeholder !== false,
          },
          className
        )}
      />
    </>
  );
});
