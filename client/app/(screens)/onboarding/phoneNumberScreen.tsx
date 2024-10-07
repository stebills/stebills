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
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Logo from '@/assets/images/reactLogo.png';
import { useThemeColor } from '@/hooks/useThemeColor';
import { ArrowLeft2 } from 'iconsax-react-native';
import Nigeria from '@/assets/svg/nigeria.svg';
import Button from '@/lib/ui/components/button';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

const phoneNumberScreen = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneNumberIsFocused, setPhoneNumberIsFocused] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const text = useThemeColor({}, 'text');
  const green500 = useThemeColor({}, 'green500');
  const gray300 = useThemeColor({}, 'gray300');

  const dismissKeyboard = () => {
    Keyboard.dismiss();
    setPhoneNumberIsFocused(false);
  };

  const route = () => {
    router.push({
      pathname: '(screens)/onboarding/verifyPhoneNumber',
      params: { phoneNumber },
    });
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <SafeAreaView
        className={`flex flex-1 pt-${
          Platform.OS === 'android' ? '4' : '0'
        } px-6`}
      >
        <TouchableOpacity className=''>
          <ArrowLeft2
            size={25}
            color={green500}
          />
        </TouchableOpacity>
        <View className='flex-1'>
          <View className=''>
            <View className='flex flex-row justify-center items-center mb-8 mt-8'>
              <Image
                source={Logo}
                className='w-6 h-6'
              />
              <Text
                style={[{}, { color: text }]}
                className='text-2xl'
              >
                -Bills
              </Text>
            </View>
            <View>
              <Text
                style={[{}, { color: text }]}
                className='text-2xl text-left'
              >
                Get an E-Bills account
              </Text>
              <Text
                style={[{}, { color: text }]}
                className='text-sm mb-6'
              >
                We use your Phone Number to identify your account so please
                enter it below
              </Text>

              <View className='flex-col flex'>
                <View className='flex flex-row items-center absolute left-3 top-3 pl-2 bg-gray-900'>
                  <Nigeria
                    width={20}
                    height={20}
                    className=''
                    style={{ marginRight: 10 }}
                  />
                  <Text
                    style={[{}, { color: text }]}
                    className='text-xl'
                  >
                    +234 |
                  </Text>
                </View>

                <TextInput
                  className={`relative border ${
                    phoneNumberIsFocused
                      ? 'border-green-500'
                      : 'border-gray-300'
                  } rounded-xl h-12 text-lg pl-28`}
                  placeholder='Phone Number'
                  placeholderTextColor={text}
                  value={phoneNumber}
                  style={{
                    color: text,
                    paddingVertical: 0,
                    alignItems: 'center',
                    textAlignVertical: 'center',
                  }}
                  onChangeText={(text) => setPhoneNumber(text)}
                  onFocus={() => setPhoneNumberIsFocused(true)}
                  onBlur={() => setPhoneNumberIsFocused(false)}
                />
              </View>
            </View>
            <View className='mt-6'>
              <Button
                route={route}
                btnText='Sign Up'
              />
            </View>
          </View>
          <View className='flex-row justify-center items-center mt-14'>
            <TouchableOpacity
              onPress={() => setIsChecked(!isChecked)}
              className='w-5 h-5 rounded-xl border-2 border-green-500 justify-center items-center'
              style={{ marginTop: -40 }}
            >
              {isChecked && (
                <MaterialIcons
                  name='check'
                  size={16}
                  color={green500}
                />
              )}
            </TouchableOpacity>
            <Text
              className={`text-base text-start mx-4`}
              style={[{ marginTop: -42 }, { color: text }]}
            >
              I have read, understood and agreed to the
              <Text className='text-green-500'>Terms & Conditions</Text> and
              <Text className='text-green-500'>Private Policy</Text>
            </Text>
          </View>
          <View className='absolute bottom-10 left-0 right-0 items-center'>
            <Text style={{ color: text }}>Already have an E-Bills Account</Text>
            <TouchableOpacity>
              <Text className='text-green-500'>Click here to Log in </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};
export default phoneNumberScreen;
