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
import OTP from '@/assets/images/otp2.jpeg';
import { router, useGlobalSearchParams } from 'expo-router';

const verifyPhoneNumber = () => {
  const { phoneNumber } = useGlobalSearchParams();
  console.log(phoneNumber);

  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [phoneNumberIsFocused, setPhoneNumberIsFocused] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);

  const inputRefs = useRef<Array<TextInput | null>>([]);

  const text = useThemeColor({}, 'text');
  const green500 = useThemeColor({}, 'green500');
  const gray300 = useThemeColor({}, 'gray300');

  // Function to update individual code boxes and auto-focus next
  const handleCodeChange = (value: string, index: any) => {
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Move to next input or submit if last
    if (value !== '' && index < code.length - 1) {
      inputRefs.current[index + 1]?.focus();
    } else if (index === code.length - 1) {
      // All fields are filled, navigate to the next screen
      const isComplete = newCode.every((digit) => digit !== '');
      if (isComplete) {
        router.push('(screens)/onboarding/signupScreen');
      }
    }
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

        <View className='mt-8 bg-gray-800 rounded-lg p-4'>
          <Text
            className='text-lg font-semibold'
            style={[{}, { color: text }]}
          >
            Step 1 - Check the Code You Received
          </Text>
          <View className='flex-row items-center w-full'>
            <View className='flex-1'>
              <Text
                className='mt-2'
                style={[{}, { color: text }]}
              >
                A verification code has been sent to your phone number{' '}
                <Text
                  className='font-bold'
                  style={[{}, { color: text }]}
                >
                  {phoneNumber}
                </Text>
                , please take a look.
              </Text>
            </View>
            <Image
              className='w-16 h-16 rounded-xl'
              source={OTP}
            />
          </View>
        </View>

        <View className='mt-8  bg-gray-800 rounded-lg p-4'>
          <Text
            className='text-lg font-semibold'
            style={[{}, { color: text }]}
          >
            Step 2 - Fill in the Box below with the Code
          </Text>

          <View className={`flex-row mt-4 justify-between`}>
            {code.map((digit, index) => (
              <TextInput
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                className={`border-gray-300 rounded-lg w-10 h-10 text-center text-xl border ${
                  phoneNumberIsFocused ? 'border-green-500' : 'border-gray-300'
                }`}
                style={[{}, { color: text }]}
                maxLength={1}
                keyboardType='numeric'
                value={digit}
                onChangeText={(value) => handleCodeChange(value, index)}
                onKeyPress={(event) => handleKeyPress(event, index)}
                // onFocus={() => inputRefs.current[index]?.focus()}
                onFocus={() => setPhoneNumberIsFocused(true)}
                onBlur={() => setPhoneNumberIsFocused(false)}
              />
            ))}
          </View>

          <TouchableOpacity>
            <Text
              className='mt-4 text-sm text-gray-500'
              style={[{}, { color: text }]}
            >
              Didn't receive the code? Resend{' '}
              <Text className='text-green-500'>({resendTimer}s)</Text>
            </Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity className='mt-2 h-7 w-28 bg-green-500 rounded-3xl flex-row items-center justify-center ml-auto'>
          <Text
            className=''
            style={[{}, { color: text }]}
          >
            Resend code
          </Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text className='mt-10 text-green-500'>
            Get OTP via Other Methods {'>'}
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};
export default verifyPhoneNumber;
