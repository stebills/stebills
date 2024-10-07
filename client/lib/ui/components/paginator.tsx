import { View, Animated, useWindowDimensions, StyleSheet } from 'react-native';
import React, { FC } from 'react';
import SPACING from '../../../constants/spacing';
import { useThemeColor } from '@/hooks/useThemeColor';

interface PaginationProps {
  data: any;
  scrollx: any;
}

const Paginator: FC<PaginationProps> = ({ data, scrollx }) => {
  const { width } = useWindowDimensions();
  const btnBackgroundColor = useThemeColor({}, 'btnBackgroundColor');

  return (
    <View style={{ flexDirection: 'row', height: 50 }}>
      {data.map((_item: any, i: number) => {
        const inputRange = [(i - 1) * width, i * width, (i + 1) * width];

        const dotWidth = scrollx.interpolate({
          inputRange,
          outputRange: [10, 20, 10],
          extrapolate: 'clamp',
        });

        const opacity = scrollx.interpolate({
          inputRange,
          outputRange: [0.3, 1, 0.3],
          extrapolate: 'clamp',
        });

        return (
          <Animated.View
            style={[
              style.dot,
              { width: dotWidth, opacity, backgroundColor: btnBackgroundColor },
            ]}
            key={i.toString()}
          />
        );
      })}
    </View>
  );
};

export default Paginator;

const style = StyleSheet.create({
  dot: {
    height: 10,
    borderRadius: 5,
    marginHorizontal: 8,
    marginTop: SPACING * 2,
  },
});
