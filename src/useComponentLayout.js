import {useCallback} from 'react';
export default function useComponentLayout(dispatch, callback) {
  const onLayout = useCallback(
    (event) => {
      const {y, height} = event.nativeEvent.layout;
      dispatch && dispatch(height, y);
      callback && callback(height, y);
    },
    [dispatch, callback],
  );
  return onLayout;
}
