import React, {useReducer, useEffect} from 'react';
import {StyleSheet} from 'react-native';
import Animated, {
  useAnimatedStyle,
  interpolate,
  useDerivedValue,
  Extrapolate,
} from 'react-native-reanimated';
import useComponentLayout from './useComponentLayout';

const initialState = {
  layoutY: 0,
  layoutHeight: 0,
  stickyHeight: 0,
};

const actions = {
  setLayout: 'setLayout',
  setStickyHeight: 'setStickyHeight',
};

function reducer(state, action) {
  switch (action.type) {
    case actions.setLayout:
      return {
        ...state,
        layoutY: action.payload.layoutY,
        layoutHeight: action.payload.layoutHeight,
        clampedScroll: action.payload.clampedScroll,
      };
    case actions.setStickyHeight:
      return {...state, stickyHeight: action.payload.stickyHeight};
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'black',
  },
});

export default function CollapsibleHeader(props) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const {layoutHeight, stickyHeight} = state;
  const {scrollY, onLayout: onLayoutParent, diff} = props;
  const onLayout = useComponentLayout(
    (height, y) =>
      dispatch({
        type: actions.setLayout,
        payload: {
          layoutY: y,
          layoutHeight: height,
        },
      }),
    onLayoutParent,
  );

  const translateY = useDerivedValue(() => {
    return interpolate(
      scrollY.value,
      [0, layoutHeight - stickyHeight],
      [0, -(layoutHeight - stickyHeight)],
      Extrapolate.CLAMP,
    );
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: translateY.value,
        },
      ],
    };
  });

  useEffect(() => {
    dispatch({
      type: actions.setStickyHeight,
      payload: {stickyHeight: props.stickyHeaderHeight},
    });
  }, [props.stickyHeaderHeight]);

  return (
    <Animated.View
      style={[styles.container, animatedStyle]}
      onLayout={onLayout}>
      {props.children}
    </Animated.View>
  );
}
