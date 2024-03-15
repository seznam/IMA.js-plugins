import { useComponentUtils } from '@ima/react-page-renderer';
import type { ComponentPropsWithoutRef } from 'react';
import { useEffect, useRef, useState, memo } from 'react';

import { DIV_ATTRIBUTES } from './constants';
import { filterProps } from './filterProps';

export const Loader = memo(function LoaderComponent({
  timeout,
  center,
  color,
  className,
  ...rest
}: {
  timeout?: number;
  center?: boolean;
  color?: 'black' | 'white';
  className?: string;
} & ComponentPropsWithoutRef<'div'>) {
  const { $CssClasses } = useComponentUtils();

  const [showLoader, setShowLoader] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>();
  const attributes = filterProps(rest, DIV_ATTRIBUTES);

  useEffect(() => {
    if (!timeout) {
      setShowLoader(true);
    }

    if (timeout && !timer.current) {
      timer.current = setTimeout(() => {
        setShowLoader(true);
      }, timeout);
    }

    return () => {
      clearTimeout(timer.current);
    };
  }, [timeout]);

  return (
    <>
      {showLoader && (
        <div
          {...attributes}
          className={$CssClasses(
            {
              'atm-loader': true,
              ['atm-loader-center']: center,
            },
            className
          )}
        >
          <div
            className={$CssClasses({
              'atm-loader-animation': true,
              ['atm-loader-animation-' + color]: color,
            })}
          />
        </div>
      )}
    </>
  );
});
