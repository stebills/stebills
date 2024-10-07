import React, { useRef } from 'react';
import {
  View,
  StyleSheet,
  Image,
  Text,
  useWindowDimensions,
  SafeAreaView,
} from 'react-native';
import SPACING from '../../../constants/spacing';
import { useThemeColor } from '@/hooks/useThemeColor';
import { RFValue } from 'react-native-responsive-fontsize';

interface Slide {
  id: string;
  title: string;
  description: string;
  image: any;
}

interface OnboardingItemProps {
  item: Slide;
}

const OnboardingItem: React.FC<OnboardingItemProps> = ({ item }) => {
  const { width } = useWindowDimensions();
  const animation = useRef(null);

  const titleColor = useThemeColor({}, 'text');
  const descriptionColor = useThemeColor({}, 'description');

  return (
    <SafeAreaView style={styles.contain}>
      <View style={[styles.container, { width }]}>
        <Image
          className='rounded-lg'
          source={item.image}
          style={[styles.image, { width, resizeMode: 'contain' }]}
        />
        <View style={{ flex: 0.2 }}>
          <Text style={[styles.title, { color: titleColor }]}>
            {item.title}
          </Text>
          <Text
            className=''
            style={[styles.description, { color: descriptionColor }]}
          >
            {item.description}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default OnboardingItem;

const styles = StyleSheet.create({
  contain: {},
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    flex: 0.7,
    justifyContent: 'center',
  },
  title: {
    fontWeight: 'bold',
    fontSize: RFValue(20),
    marginBottom: 10,
    textAlign: 'center',
    marginTop: SPACING * 4,
  },
  description: {
    fontWeight: '500',
    textAlign: 'center',
    paddingHorizontal: 64,
    fontSize: RFValue(15),
  },
});
