import SPACING from '@/constants/spacing';
import React, { FC } from 'react';
import {
  Dimensions,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

const { height: windowHeight, width: windowWidth } = Dimensions.get('window');

interface NextButtonProps {
  scrollTo: () => void;
}

const NextButton: FC<NextButtonProps> = ({ scrollTo }) => {
  const backgroundColor = useThemeColor({}, 'btnBackgroundColor');
  const textColor = useThemeColor({}, 'text');

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={scrollTo}
        style={[styles.buttonContainer, { backgroundColor }]}
      >
        <Text style={[styles.buttonText, { color: textColor }]}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
};

export default NextButton;

const styles = StyleSheet.create({
  container: {
    flex: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    width: 0.85 * windowWidth,
    height: 0.07 * windowHeight,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING * 5,
  },
  buttonText: {
    fontSize: 23,
    fontWeight: '500',
  },
});
