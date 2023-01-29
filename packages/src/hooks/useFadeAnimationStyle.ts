import { useEffect } from 'react';
import {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  WithTimingConfig,
} from 'react-native-reanimated';
import useUpdateGlobalComponentState from './useUpdateGlobalComponentState';
import { DEFAULT_WITH_TIMING_CONFIG } from '../constant';

const useFadeAnimationStyle = ({
  minOpacity = 0,
  maxOpacity = 1,
  animationConfig = DEFAULT_WITH_TIMING_CONFIG,
}: {
  minOpacity?: number;
  maxOpacity?: number;
  animationConfig?: WithTimingConfig;
} = {}) => {
  const opacity = useSharedValue(minOpacity);

  const { addHideAnimation } = useUpdateGlobalComponentState();

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  useEffect(() => {
    opacity.value = withTiming(maxOpacity, animationConfig);

    addHideAnimation(() => {
      return new Promise((resolve) => {
        opacity.value = withTiming(minOpacity, animationConfig, () =>
          runOnJS(resolve)(),
        );
      });
    });
  }, []);

  return {
    style,
  };
};

export default useFadeAnimationStyle;