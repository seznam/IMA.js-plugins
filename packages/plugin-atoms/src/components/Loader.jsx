import { useComponentUtils } from '@ima/react-page-renderer';
import { useEffect, useRef, useState, memo } from 'react';

export const Loader = memo(function LoaderComponent({
  timeout,
  center,
  color,
  className,
  ...rest
}) {
  const { $CssClasses } = useComponentUtils();

  const [showLoader, setShowLoader] = useState(false);
  const timer = useRef();

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
          {...rest}
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
