import React, {
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  useEffect,
} from 'react';
import { ExternalPopupContext } from '../context';
import { PopupContext, Animation, Mutable } from '../types';

interface ProviderProps<T> {
  Component: React.FC<T>;
  internalRef: Mutable<React.RefObject<PopupContext<T>>>;
}

function Provider<T>({ Component, internalRef }: ProviderProps<T>) {
  const prevRef = useRef(internalRef.current);

  const [props, setProps] = useState<T | null>(null);

  const animations = useRef<Animation[]>([]);

  const hide = async () => {
    await Promise.all(animations.current.map((fn) => fn()));
    animations.current = [];
    setProps(null);
  };

  const context = useMemo(
    () => ({
      show: async (p: T) => {
        await hide();
        setProps(p);
      },
      hide,
      addHideAnimation: (a: Animation) => {
        animations.current.push(a);
      },
    }),
    [],
  );

  useImperativeHandle(internalRef, () => context, []);

  useEffect(() => {
    return () => {
      if (prevRef.current) {
        internalRef.current = prevRef.current;
      }
      animations.current = [];
    };
  }, []);

  if (!props) return null;

  return (
    <ExternalPopupContext.Provider value={context}>
      <Component {...props} />
    </ExternalPopupContext.Provider>
  );
}

export default Provider;
