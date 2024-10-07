import {
  View,
  Text,
  Platform,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeColor } from '@/hooks/useThemeColor';
import { ArrowLeft2, Eye, Lock, EyeSlash } from 'iconsax-react-native';
import Bio from '@/assets/svg/bio.svg';
import Nigeria from '@/assets/svg/nigeria.svg';
import Button from '@/lib/ui/components/button';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import BiometricModal from '@/app/(modals)/biometricModal';

const loginScreen = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const [password, setPassword] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);

  const isNextButtonDisabled = !phoneNumber || !password;
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [showPassword, setShowPassword] = useState(true);

  const [phoneNumberIsFocused, setPhoneNumberIsFocused] = useState(false);
  const [passwordIsFocused, setPasswordIsFocused] = useState(false);
  useState(false);

  const text = useThemeColor({}, 'text');
  const green500 = useThemeColor({}, 'green500');
  const vertical = useThemeColor({}, 'vertical');

  const dismissKeyboard = () => {
    Keyboard.dismiss();
    setPhoneNumberIsFocused(false);
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!isPasswordVisible);
  };

  const toggleBiometricModal = () => {
    setModalVisible(!isModalVisible);
  };

  const route = () => {
    router.push('(screens)/login/welcomeBackScreen');
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
        <View className='flex-1'>
          <View>
            <Text
              style={[{}, { color: text }]}
              className='text-2xl text-left mb-4 font-bold mt-6'
            >
              Login to your Account{' '}
            </Text>
            <Text
              style={[{}, { color: text }]}
              className='text-sm mb-6'
            >
              Enter your details to sign in to your account{' '}
            </Text>
            <View className='flex-col justify-between bg-gray-900 px-4 py-3 rounded-2xl'>
              <View
                className={`flex-row items-center text-lg rounded-xl p-3 w-full bg-gray-800 my-2 ${
                  passwordIsFocused ? 'border-green-500' : 'border-gray-600'
                }`}
                style={{ borderWidth: 1 }}
              >
                <Nigeria
                  className='h-4 w-4'
                  style={{ marginRight: 5 }}
                />
                <View>
                  <Text
                    className=''
                    style={{ color: text }}
                  >
                    {' '}
                    +234{' '}
                  </Text>
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
                  value={phoneNumber}
                  keyboardType='numeric'
                  onChangeText={(text) => setPhoneNumber(text)}
                  onFocus={() => setPhoneNumberIsFocused(true)}
                  onBlur={() => setPhoneNumberIsFocused(false)}
                />
              </View>
              <View
                className={`flex-row items-center text-lg rounded-xl p-3 w-full bg-gray-800 my-2 ${
                  passwordIsFocused ? 'border-green-500' : 'border-gray-600'
                }`}
                style={{ borderWidth: 1 }}
              >
                <Lock
                  size='20'
                  color={green500}
                  style={{ marginRight: 10 }}
                />
                <TextInput
                  className='flex-1 h-full text-lg'
                  style={[{}, { color: text }]}
                  placeholder='Enter Password'
                  placeholderTextColor={text}
                  value={password}
                  onChangeText={(text) => setPassword(text)}
                  onFocus={() => setPasswordIsFocused(true)}
                  onBlur={() => setPasswordIsFocused(false)}
                  secureTextEntry={!isPasswordVisible}
                />
                {showPassword ? (
                  <TouchableOpacity onPress={togglePasswordVisibility}>
                    <Eye
                      size='20'
                      color={green500}
                    />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity onPress={togglePasswordVisibility}>
                    <EyeSlash
                      size='20'
                      color={green500}
                    />
                  </TouchableOpacity>
                )}
              </View>
            </View>

            <View className='flex flex-row justify-between items-center mt-12 px-4'>
              <TouchableOpacity
                onPress={() => setIsChecked(!isChecked)}
                className='flex flex-row items-center'
                style={{ marginTop: -40 }}
              >
                <View className='w-5 h-5 rounded-xl border-2 border-green-500 justify-center items-center'>
                  {isChecked && (
                    <MaterialIcons
                      name='check'
                      size={16}
                      color={green500}
                    />
                  )}
                </View>

                <Text
                  className={`text-base text-start mx-4`}
                  style={[{ marginTop: -2 }, { color: text }]}
                >
                  Remember me
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ marginTop: -40 }}>
                <Text style={[{}, { color: green500 }]}>Forget Password</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View className='mt-4'>
            {isNextButtonDisabled && (
              <Button
                route={route}
                btnText='Next'
              />
            )}
          </View>
        </View>
        <View className='absolute bottom-60 left-0 right-0'>
          <TouchableOpacity
            className='flex-row justify-center items-center'
            onPress={toggleBiometricModal}
          >
            <Bio />
            <Text className='text-center text-green-500'>
              Enable biometric authentication{' '}
            </Text>
          </TouchableOpacity>
        </View>

        <View className='flex items-center justify-center mb-10 mt-8'>
          <Text style={{ color: text }}>Don't have an E-Bills Account</Text>
          <TouchableOpacity>
            <Text className='text-green-500'>Click here to Signup </Text>
          </TouchableOpacity>
        </View>
        <BiometricModal
          visible={isModalVisible}
          onClose={toggleBiometricModal}
        />
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};
export default loginScreen;
