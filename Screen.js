import React, {useState} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
} from 'react-native-reanimated';
import List from './src/List';
import CollapsibleHeader from './src/CollapsibleHeader';
import NavBar from './src/Navbar';

function clamp(value, min, max) {
  'worklet';
  return Math.min(Math.max(value, min), max);
}

export default function AnimatedStyleUpdateExample(props) {
  const [headerHeight, setHeaderHeight] = useState(0);
  const [stickyHeaderHeight, setStickyHeight] = useState(0);
  const scrollY = useSharedValue(0);
  const diff = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event, ctx) => {
      const {y} = event.contentOffset;
      diff.value = y - (ctx?.lastVal || 0);
      ctx.lastVal = y;
      scrollY.value = clamp(scrollY.value + diff.value, 0, headerHeight);
    },
    onEndDrag: (event) => {},
  });
  return (
    <View style={styles.main}>
      <Animated.ScrollView
        contentContainerStyle={{
          paddingTop: headerHeight,
        }}
        onScroll={scrollHandler}
        scrollEventThrottle={1}
        style={styles.main}>
        <List />
      </Animated.ScrollView>
      <CollapsibleHeader
        onLayout={setHeaderHeight}
        scrollY={scrollY}
        diff={diff}
        stickyHeaderHeight={stickyHeaderHeight}>
        <Text style={styles.sectionTitle}>WhatsApp</Text>
        <NavBar onLayout={setStickyHeight} />
      </CollapsibleHeader>
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: 'white',
    margin: 20,
  },
});
