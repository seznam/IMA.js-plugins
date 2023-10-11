import { useComponentUtils } from '@ima/react-page-renderer';
import { memo, useEffect, useRef, useState } from 'react';

import { LAYOUT } from './layout';
import { Sizer } from './Sizer';

export const Iframe = memo(function IframeComponent({
  name,
  src,
  layout,
  className,
  width,
  height,
  loading,
  placeholder,
  ...rest
}) {
  const [visibleInViewport, setVisibleInViewport] = useState(false);
  const rootElement = useRef();
  const { $CssClasses, $UIComponentHelper } = useComponentUtils();

  useEffect(() => {
    let extendedPadding = Math.max(
      $UIComponentHelper.componentPositions.getWindowViewportRect().height / 2,
      500
    );

    const registeredVisibilityId = $UIComponentHelper.visibility.register(
      $UIComponentHelper.getVisibilityReader(rootElement.current, {
        useIntersectionObserver: true,
        extendedPadding,
        width,
        height,
      }),
      $UIComponentHelper.wrapVisibilityWriter((visibility, observer) => {
        if (visibility > 0) {
          observer && observer.disconnect();
          $UIComponentHelper.visibility.unregister(registeredVisibilityId);

          if (visibleInViewport === false) {
            setVisibleInViewport(true);
          }
        }
      })
    );

    return () => {
      $UIComponentHelper.visibility.unregister(registeredVisibilityId);
    };
  }, []);

  return (
    <div
      ref={rootElement}
      className={$CssClasses(
        {
          'atm-iframe': true,
          'atm-overflow': true,
          'atm-responsive': layout === LAYOUT.RESPONSIVE,
          'atm-fill': layout === LAYOUT.FILL,
          'atm-placeholder': !visibleInViewport,
        },
        className
      )}
      style={
        layout === LAYOUT.RESPONSIVE
          ? {}
          : {
              width: width ?? 'auto',
              height: height ?? 'auto',
            }
      }
    >
      {layout === LAYOUT.RESPONSIVE ? (
        <Sizer width={width} height={height} />
      ) : null}
      {visibleInViewport && (
        <iframe
          {...rest}
          src={$UIComponentHelper.sanitizeUrl(src)}
          name={name ?? src}
          width={width}
          height={height}
          loading={loading ?? 'lazy'}
          className={$CssClasses({
            'atm-fill': true,
            //'atm-placeholder': placeholder !== false,
          })}
        />
      )}
    </div>
  );
});
