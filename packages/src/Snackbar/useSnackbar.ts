import React, { useEffect } from 'react';
import { delay, filter, of, switchMap, tap } from 'rxjs';
import { SnackbarProps } from './Snackbar';
import SnackbarManager from './SnackbarManager';
import useGlobalComponent from '../hooks/useGlobalComponent';

const useSnackbar = <S extends SnackbarProps>(name: string) => {
  const { show, visible, state, updateState, hideImmediate } =
    useGlobalComponent<S>(SnackbarManager, name);

  useEffect(() => {
    const subscription = SnackbarManager.observeRender()
      .pipe(
        filter((v): v is { name: string; props: S } => v.name === name),
        switchMap((v) =>
          // TODO:  without delay??
          of(v.props).pipe(tap(hideImmediate), delay(16), tap(show)),
        ),
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return {
    state,
    visible,
    updateState,
  };
};

export default useSnackbar;