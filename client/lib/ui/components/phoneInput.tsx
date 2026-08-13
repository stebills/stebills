import React, { FC, useState } from 'react';
import { TextInput, View, Text } from 'react-native';
import Nigeria from '@/assets/svg/nigeria.svg';
import { useThemeColor } from '@/hooks/useThemeColor';

interface PhoneInputProps {
  value: string;
  onChangeText: (text: string) => void;
}

const PhoneInput: FC<PhoneInputProps> = ({ value, onChangeText }) => {
  const [isFocused, setIsFocused] = useState(false);
  const text = useThemeColor({}, 'text');
  const vertical = useThemeColor({}, 'vertical');

  return (
    <View
      className={`flex-row items-center text-lg rounded-xl p-3 w-full bg-gray-800 my-2 ${
        isFocused ? 'border-green-500' : 'border-gray-600'
      }`}
      style={{ borderWidth: 1 }}
    >
      <Nigeria
        className='h-4 w-4'
        style={{ marginRight: 5 }}
      />
      <View>
        <Text style={{ color: text }}> +234 </Text>
      </View>
      <View
        className='w-px h-full mx-3'
        style={{ backgroundColor: vertical }}
      />
      <TextInput
        className='flex-1 h-full text-lg'
        style={[{}, { color: text }]}
        placeholder='Phone number'
        placeholderTextColor={text}
        value={value}
        keyboardType='numeric'
        onChangeText={onChangeText}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
    </View>
  );
};

export default PhoneInput;
