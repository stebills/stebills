import slides from '@/constants/slides';
import storage from '@/lib/utils/storage';
import React, { useRef, useState } from 'react';
import { Animated, FlatList, View, ViewToken, StyleSheet } from 'react-native';
import OnboardingItem from '../lib/ui/components/onboardingItem';
import Paginator from '@/lib/ui/components/paginator';
import NextButton from '@/lib/ui/components/nextButton';
import { useRouter } from 'expo-router';

interface ISlide {
  id: string;
  title: string;
  description: string;
  image: any;
}

const App = () => {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollx = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef<FlatList<ISlide> | null>(null);

  const scrollTo = async () => {
    if (currentIndex < slides.length - 1 && slidesRef.current) {
      slidesRef.current.scrollToIndex({ index: currentIndex + 1 });
      // setCurrentIndex(currentIndex + 1);
    } else {
      await storage.setItem('onboarded', '1');
      router.push('/welcomeScreen');
    }
  };

  const viewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      // console.log('Viewable Items:', viewableItems);
      if (
        viewableItems &&
        viewableItems.length > 0 &&
        viewableItems[0].index !== null
      ) {
        setCurrentIndex(viewableItems[0].index);
      }
    }
  ).current;

  const viewConfig = useRef({
    itemVisiblePercentThreshold: 50,
    // viewAreaCoveragePercentThreshold: 50,
  }).current;

  return (
    <View style={styles.container}>
      <View style={styles.container}>
        <FlatList
          data={slides}
          renderItem={({ item }) => <OnboardingItem item={item} />}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          bounces={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollx } } }],
            {
              useNativeDriver: false,
            }
          )}
          scrollEventThrottle={32}
          onViewableItemsChanged={viewableItemsChanged}
          viewabilityConfig={viewConfig}
          ref={slidesRef}
        />
      </View>
      <Paginator
        data={slides}
        scrollx={scrollx}
      />
      <NextButton scrollTo={scrollTo} />
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
