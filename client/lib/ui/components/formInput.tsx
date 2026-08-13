import React, { FC, ReactNode, useState } from 'react';
import { TextInput, View, KeyboardTypeOptions } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

interface FormInputProps {
  icon?: ReactNode;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  rightAccessory?: ReactNode;
}

const FormInput: FC<FormInputProps> = ({
  icon,
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
  keyboardType,
  rightAccessory,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const text = useThemeColor({}, 'text');

  return (
    <View
      className={`flex-row items-center text-lg rounded-xl p-3 w-full bg-gray-800 my-2 ${
        isFocused ? 'border-green-500' : 'border-gray-600'
      }`}
      style={{ borderWidth: 1 }}
    >
      {icon}
      <TextInput
        className='flex-1 h-full text-lg'
        style={[{}, { color: text }]}
        placeholder={placeholder}
        placeholderTextColor={text}
        value={value}
        keyboardType={keyboardType}
        onChangeText={onChangeText}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        secureTextEntry={secureTextEntry}
      />
      {rightAccessory}
    </View>
  );
};

export default FormInput;
