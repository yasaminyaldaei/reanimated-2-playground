import React, {useState, useEffect} from 'react';
import {StyleSheet} from 'react-native';
import Animated, {
  useDerivedValue,
  interpolate,
  Extrapolate,
  useAnimatedStyle,
} from 'react-native-reanimated';
import useComponentLayout from './useComponentLayout';
import NavBar from './Navbar';

function CollapsibleImageHeader({
  avatar,
  scrollY,
  stickyHeaderHeight,
  onLayout,
}) {
  const [layoutHeight, setLayoutHeight] = useState(0);
  const [stickyHeight, setStickyHeight] = useState(0);
  const [nabvarHeight, setNavbarHeight] = useState(0);
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

  const separatorOpacity = useDerivedValue(() => {
    return interpolate(
      scrollY.value,
      [0, layoutHeight],
      [0, 0.3],
      Extrapolate.CLAMP,
    );
  });

  const translateY = useDerivedValue(() => {
    return interpolate(
      scrollY.value,
      [0, layoutHeight - stickyHeight - nabvarHeight],
      [0, -(layoutHeight - stickyHeight - nabvarHeight)],
      Extrapolate.CLAMP,
    );
  });

  const viewAnimation = useAnimatedStyle(() => {
    return {transform: [{translateY: translateY.value}]};
  });

  const imageAnimation = useAnimatedStyle(() => {
    return {opacity: opacity.value};
  });

  const separatorAnimation = useAnimatedStyle(() => {
    return {opacity: separatorOpacity.value};
  });

  return (
    <Animated.View
      onLayout={onImageLayout}
      style={[styles.container, viewAnimation]}>
      <Animated.Image
        source={{uri: avatar}}
        style={[styles.image, imageAnimation]}
      />
      <Animated.View style={[styles.separator, separatorAnimation]} />
      <NavBar onLayout={setNavbarHeight} />
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
  separator: {
    height: 1,
    flex: 1,
    backgroundColor: 'dimgray',
  },
});

export default CollapsibleImageHeader;
