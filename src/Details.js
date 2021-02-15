import React, {useState, useEffect} from 'react';
import {View} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
} from 'react-native-reanimated';
import DetailsNavbar from './DetailsNavbar';
import CollapsibleImageHeader from './CollapsibleImageHeader';
import DetailsSection from './DetailsSection';

function Details({route, navigation}) {
  const scrollY = useSharedValue(0);
  const [details, setDetails] = useState({});
  const [headerHeight, setHeaderHeight] = useState(0);
  const [stickyHeaderHeight, setStickyHeaderHeight] = useState(0);

  useEffect(() => {
    const {id} = route.params;
    fetch(`https://6005c08875860e0017c5d096.mockapi.io/contacts/${id}`, {
      method: 'GET',
    })
      .then((data) => data.json())
      .then((data) => setDetails(data))
      .catch(console.error);
  }, [route]);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      const {y} = event.contentOffset;
      scrollY.value = y;
    },
  });

  return (
    <>
      <DetailsNavbar
        onPress={() => navigation.navigate('Home')}
        onLayout={setStickyHeaderHeight}
      />
      <CollapsibleImageHeader
        avatar={details.avatar}
        onLayout={setHeaderHeight}
        scrollY={scrollY}
        stickyHeaderHeight={stickyHeaderHeight}
      />
      <Animated.ScrollView
        contentContainerStyle={{paddingTop: headerHeight}}
        onScroll={scrollHandler}
        scrollEventThrottle={1}>
        {Array(20)
          .fill(1)
          .map((_, index) => (
            <DetailsSection key={'' + index} title={`section ${index + 1}`} />
          ))}
      </Animated.ScrollView>
    </>
  );
}

export default Details;
