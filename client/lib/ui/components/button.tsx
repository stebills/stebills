import SPACING from '@/constants/spacing';
import React, { FC } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

interface ButtonProps {
  route: () => void;
  btnText: string;
  bgColor?: string;
  isDisabled?: boolean;
}

const Button: FC<ButtonProps> = ({ route, btnText, isDisabled, bgColor }) => {
  const text = useThemeColor({}, 'text');
  const green500 = useThemeColor({}, 'green500');
  const gray800 = useThemeColor({}, 'gray800');

  return (
    <View>
      <TouchableOpacity
        disabled={isDisabled}
        onPress={route}
        style={[
          {
            backgroundColor: isDisabled ? gray800 : bgColor || green500,
            // backgroundColor: isDisabled ? gray800 : green500,
            borderRadius: 10,
            paddingVertical: 10,
            alignItems: 'center',
          },
        ]}
      >
        <Text
          style={{
            color: isDisabled ? green500 : text,
            fontSize: 18,
            fontWeight: '600',
          }}
        >
          {btnText}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Button;
