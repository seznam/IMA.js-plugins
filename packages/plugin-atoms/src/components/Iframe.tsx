import { useComponentUtils } from '@ima/react-page-renderer';
import {
  memo,
  useEffect,
  useRef,
  useState,
  ComponentPropsWithoutRef,
} from 'react';
import type { ValueOf } from 'type-fest';

import { LAYOUT, LOADING } from './constants';
import { Sizer } from './Sizer';

const MIN_EXTENDED_PADDING = 500;

export const Iframe = memo(function IframeComponent({
  name,
  src,
  layout,
  className,
  width,
  height,
  loading = LOADING.LAZY,
  placeholder,
  ...rest
}: {
  name?: string;
  src: string;
  layout?: ValueOf<typeof LAYOUT>;
  className?: string;
  width: number;
  height: number;
  loading?: ValueOf<typeof LOADING>;
  placeholder?: boolean;
} & ComponentPropsWithoutRef<'iframe'>) {
  const [visibleInViewport, setVisibleInViewport] = useState(
    loading === LOADING.EAGER
  );
  const rootElement = useRef<HTMLDivElement>(null);
  const { $CssClasses, $UIComponentHelper } = useComponentUtils();

  useEffect(() => {
    if (rootElement.current === null) {
      return;
    }

    const extendedPadding = Math.max(
      $UIComponentHelper.componentPositions.getWindowViewportRect().height / 2,
      MIN_EXTENDED_PADDING
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
          'atm-placeholder': !visibleInViewport && placeholder,
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
          className={$CssClasses({
            'atm-fill': true,
          })}
        />
      )}
      {!visibleInViewport && (
        <noscript
          dangerouslySetInnerHTML={{
            __html: `<iframe src="${$UIComponentHelper.sanitizeUrl(
              src
            )}" name="${name ?? src}" width="${width || 'auto'}" height="${
              height || 'auto'
            }" class="${$CssClasses(
              'atm-fill'
            )}" ${$UIComponentHelper.serializeObjectToNoScript(
              rest
            )}></iframe>`,
          }}
        />
      )}
    </div>
  );
});
