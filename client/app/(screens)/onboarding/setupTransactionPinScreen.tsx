import {
  View,
  Text,
  Platform,
  Image,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import React, { useRef, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeColor } from '@/hooks/useThemeColor';
import { ArrowLeft2 } from 'iconsax-react-native';
import Bio from '@/assets/svg/bio.svg';
import OTP from '@/assets/images/otp2.jpeg';
import { router } from 'expo-router';
import BiometricModal from '@/app/(modals)/biometricModal';

const SetupTransactionPinScreen = () => {
  const [code, setCode] = useState(['', '', '', '']);
  const [isDisabled, setIsDisabled] = useState(true);
  const [phoneNumberIsFocused, setPhoneNumberIsFocused] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);

  const inputRefs = useRef<Array<TextInput | null>>([]);

  const text = useThemeColor({}, 'text');
  const green500 = useThemeColor({}, 'green500');
  const gray800 = useThemeColor({}, 'gray800');

  // Function to update individual code boxes and auto-focus next
  const handleCodeChange = (value: string, index: any) => {
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value !== '' && index < code.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    const isComplete = newCode.every((digit) => digit !== '');
    setIsDisabled(!isComplete);
  };

  // Function to handle backspace and move to previous input
  const handleKeyPress = (event: any, index: number) => {
    if (event.nativeEvent.key === 'Backspace' && code[index] === '') {
      if (index > 0) {
        // Move focus to the previous input and clear it
        inputRefs.current[index - 1]?.focus();
        const newCode = [...code];
        newCode[index - 1] = '';
        setCode(newCode);
      }
    }
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const route = () => {
    router.push('(screens)/login/loginSreen');
  };

  const toggleBiometricModal = () => {
    setModalVisible(!isModalVisible);
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <SafeAreaView
        className={`flex-1 pt-${Platform.OS === 'android' ? '4' : '0'} px-6`}
      >
        <TouchableOpacity className=''>
          <ArrowLeft2
            size={25}
            color={green500}
          />
        </TouchableOpacity>

        <View className='mt-10 bg-gray-800 rounded-lg p-3'>
          <Text
            className='text-xl font-semibold'
            style={[{}, { color: text }]}
          >
            Set-up Transaction Pin{' '}
          </Text>
          <View className='flex-row items-center w-full'>
            <View className='flex-1'>
              <Text style={[{}, { color: text }]}>
                This pin will be required to authenticate your transactions
              </Text>
            </View>
            <Image
              className='w-16 h-16 rounded-xl m-2'
              source={OTP}
            />
          </View>
        </View>

        <View className='mt-8  bg-gray-800 rounded-lg p-3'>
          <View className={`flex-row justify-between`}>
            {code.map((digit, index) => (
              <TextInput
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                className={`border-gray-300 rounded-lg w-14 h-14 text-center text-xl border ${
                  phoneNumberIsFocused ? 'border-green-500' : 'border-gray-300'
                }`}
                style={[{}, { color: text }]}
                maxLength={1}
                keyboardType='numeric'
                value={digit}
                onChangeText={(value) => handleCodeChange(value, index)}
                onKeyPress={(event) => handleKeyPress(event, index)}
                onFocus={() => setPhoneNumberIsFocused(true)}
                onBlur={() => setPhoneNumberIsFocused(false)}
              />
            ))}
          </View>
        </View>

        <TouchableOpacity
          className='flex-row justify-center items-center mt-4'
          onPress={toggleBiometricModal}
        >
          <Bio />
          <Text className='text-center text-green-500'>
            Enable biometric authentication{' '}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          disabled={isDisabled}
          onPress={route}
          style={[
            {
              backgroundColor: isDisabled ? gray800 : green500,
              borderRadius: 10,
              paddingVertical: 10,
              alignItems: 'center',
              marginTop: 65,
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
            Next
          </Text>
        </TouchableOpacity>
        <BiometricModal
          visible={isModalVisible}
          onClose={toggleBiometricModal}
        />
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};
export default SetupTransactionPinScreen;
