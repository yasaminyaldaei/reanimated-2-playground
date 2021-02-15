import React, {useState, useEffect} from 'react';
import {StyleSheet} from 'react-native';
import Animated, {
  useDerivedValue,
  interpolate,
  Extrapolate,
  useAnimatedStyle,
} from 'react-native-reanimated';
import useComponentLayout from './useComponentLayout';

function CollapsibleImageHeader({
  avatar,
  scrollY,
  stickyHeaderHeight,
  onLayout,
}) {
  const [layoutHeight, setLayoutHeight] = useState(0);
  const [stickyHeight, setStickyHeight] = useState(0);
  const onImageLayout = useComponentLayout(setLayoutHeight, onLayout);

  useEffect(() => {
    setStickyHeight(stickyHeaderHeight);
  }, [stickyHeaderHeight]);

  const opacity = useDerivedValue(() => {
    return interpolate(
      scrollY.value,
      [0, layoutHeight],
      [1, 0],
      Extrapolate.CLAMP,
    );
  });

  const translateY = useDerivedValue(() => {
    return interpolate(
      scrollY.value,
      [0, layoutHeight - stickyHeight],
      [0, -(layoutHeight - stickyHeight)],
      Extrapolate.CLAMP,
    );
  });

  const viewAnimation = useAnimatedStyle(() => {
    return {transform: [{translateY: translateY.value}]};
  });

  const imageAnimation = useAnimatedStyle(() => {
    return {opacity: opacity.value};
  });

  return (
    <Animated.View style={[styles.container, viewAnimation]}>
      <Animated.Image
        onLayout={onImageLayout}
        source={{uri: avatar}}
        style={[styles.image, imageAnimation]}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    backgroundColor: 'black',
    zIndex: 2,
  },
  image: {
    height: 300,
  },
});

export default CollapsibleImageHeader;
