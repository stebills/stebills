import React, { FC } from 'react';
import { View, Text } from 'react-native';
import LogoMark from '@/assets/svg/logo.svg';
import { useThemeColor } from '@/hooks/useThemeColor';

interface LogoProps {
  size?: number;
  showWordmark?: boolean;
}

const Logo: FC<LogoProps> = ({ size = 32, showWordmark = true }) => {
  const text = useThemeColor({}, 'text');

  return (
    <View className='flex flex-row items-center'>
      <LogoMark
        width={size}
        height={size}
      />
      {showWordmark && (
        <Text
          style={{ color: text, fontWeight: '700' }}
          className='text-2xl ml-2'
        >
          stebills
        </Text>
      )}
    </View>
  );
};

export default Logo;
