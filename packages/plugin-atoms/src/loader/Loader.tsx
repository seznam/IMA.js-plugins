import { useComponentUtils } from '@ima/react-page-renderer';
import React, {
  useEffect,
  useRef,
  useState,
  memo,
  ComponentPropsWithoutRef,
} from 'react';

export const Loader = memo(function LoaderComponent({
  timeout,
  layout,
  mode,
  color,
  className,
  ...rest
}: {
  timeout?: number;
  layout?: 'fill' | 'center';
  mode?: string;
  color?: string;
  className?: string;
} & ComponentPropsWithoutRef<'div'>) {
  const { $CssClasses } = useComponentUtils();

  const [showLoader, setShowLoader] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>();

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
              ['atm-loader-' + mode]: mode,
              ['atm-loader-' + layout]: layout,
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

type Compo = React.FunctionComponent<any> | React.ComponentClass<any>;
const X: Compo = ({ Wtf }: { Wtf: Compo }) => <div>asdasd</div>;

<X />;
