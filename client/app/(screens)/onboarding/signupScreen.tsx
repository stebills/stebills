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
import {
  ArrowLeft2,
  Eye,
  Sms,
  User,
  Lock,
  EyeSlash,
} from 'iconsax-react-native';
import Nigeria from '@/assets/svg/nigeria.svg';
import Button from '@/lib/ui/components/button';
import { router } from 'expo-router';

const signupScreen = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const isNextButtonDisabled =
    !firstname ||
    !lastname ||
    !email ||
    !phoneNumber ||
    !password ||
    !confirmPassword;
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [showPassword, setShowPassword] = useState(true);

  const [phoneNumberIsFocused, setPhoneNumberIsFocused] = useState(false);
  const [firstnameIsFocused, setFirstnameIsFocused] = useState(false);
  const [lastnameIsFocused, setLastnameIsFocused] = useState(false);
  const [emailIsFocused, setEmailIsFocused] = useState(false);
  const [passwordIsFocused, setPasswordIsFocused] = useState(false);
  const [confirmPasswordIsFocused, setConfirmPasswordIsFocused] =
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

  const route = () => {
    router.push('(screens)/onboarding/setupTransactionPinScreen');
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
              Create Your Profile
            </Text>
            <Text
              style={[{}, { color: text }]}
              className='text-sm mb-6'
            >
              Please fill the following fields accurately:
            </Text>
            <View className='flex-col justify-between bg-gray-900 px-4 py-3 rounded-2xl'>
              <View
                className={`flex-row items-center text-lg rounded-xl p-3 w-full bg-gray-800 my-2 ${
                  firstnameIsFocused ? 'border-green-500' : 'border-gray-600'
                }`}
                style={{ borderWidth: 1 }}
              >
                <User
                  size='20'
                  color={green500}
                  style={{ marginRight: 10 }}
                />
                <TextInput
                  className='flex-1 h-full text-lg'
                  style={[{}, { color: text }]}
                  placeholder='First Name'
                  placeholderTextColor={text}
                  value={firstname}
                  onChangeText={(text) => setFirstname(text)}
                  onFocus={() => setFirstnameIsFocused(true)}
                  onBlur={() => setFirstnameIsFocused(false)}
                />
              </View>

              <View
                className={`flex-row items-center text-lg rounded-xl p-3 w-full bg-gray-800 my-2 ${
                  firstnameIsFocused ? 'border-green-500' : 'border-gray-600'
                }`}
                style={{ borderWidth: 1 }}
              >
                <User
                  size='20'
                  color={green500}
                  style={{ marginRight: 10 }}
                />
                <TextInput
                  className='flex-1 h-full text-lg'
                  style={[{}, { color: text }]}
                  placeholder='Last Name'
                  placeholderTextColor={text}
                  value={lastname}
                  onChangeText={(text) => setLastname(text)}
                  onFocus={() => setLastnameIsFocused(true)}
                  onBlur={() => setLastnameIsFocused(false)}
                />
              </View>

              <View
                className={`flex-row items-center text-lg rounded-xl p-3 w-full bg-gray-800 my-2 ${
                  firstnameIsFocused ? 'border-green-500' : 'border-gray-600'
                }`}
                style={{ borderWidth: 1 }}
              >
                <Sms
                  size='20'
                  color={green500}
                  style={{ marginRight: 10 }}
                />
                <TextInput
                  className='flex-1 h-full text-lg'
                  style={[{}, { color: text }]}
                  placeholder='Enter your email address'
                  placeholderTextColor={text}
                  value={email}
                  onChangeText={(text) => setEmail(text)}
                  onFocus={() => setEmailIsFocused(true)}
                  onBlur={() => setEmailIsFocused(false)}
                />
              </View>

              <View
                className={`flex-row items-center text-lg rounded-xl p-3 w-full bg-gray-800 my-2 ${
                  firstnameIsFocused ? 'border-green-500' : 'border-gray-600'
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
                  firstnameIsFocused ? 'border-green-500' : 'border-gray-600'
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

              <View
                className={`flex-row items-center text-lg rounded-xl p-3 w-full bg-gray-800 my-2 ${
                  firstnameIsFocused ? 'border-green-500' : 'border-gray-600'
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
                  placeholder='Confirm Password'
                  placeholderTextColor={text}
                  value={confirmPassword}
                  onChangeText={(text) => setConfirmPassword(text)}
                  onFocus={() => setConfirmPasswordIsFocused(true)}
                  secureTextEntry={!isPasswordVisible}
                  onBlur={() => setConfirmPasswordIsFocused(false)}
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
          </View>
        </View>
        <View>
          <Button
            route={route}
            btnText='Next'
          />
        </View>

        <View className='flex items-center justify-center mb-10 mt-8'>
          <Text style={{ color: text }}>Already have an E-Bills Account</Text>
          <TouchableOpacity>
            <Text className='text-green-500'>Click here to Log in </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};
export default signupScreen;
