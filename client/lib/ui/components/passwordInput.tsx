import React, { FC } from 'react';
import { TouchableOpacity } from 'react-native';
import { Lock, Eye, EyeSlash } from 'iconsax-react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { usePasswordVisibility } from '@/hooks/usePasswordVisibility';
import FormInput from './formInput';

interface PasswordInputProps {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
}

const PasswordInput: FC<PasswordInputProps> = ({
  placeholder,
  value,
  onChangeText,
}) => {
  const green500 = useThemeColor({}, 'green500');
  const { isVisible, toggle } = usePasswordVisibility();

  return (
    <FormInput
      icon={
        <Lock
          size='20'
          color={green500}
          style={{ marginRight: 10 }}
        />
      }
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      secureTextEntry={!isVisible}
      rightAccessory={
        <TouchableOpacity onPress={toggle}>
          {isVisible ? (
            <EyeSlash
              size='20'
              color={green500}
            />
          ) : (
            <Eye
              size='20'
              color={green500}
            />
          )}
        </TouchableOpacity>
      }
    />
  );
};

export default PasswordInput;
