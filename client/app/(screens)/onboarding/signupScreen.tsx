import {
  View,
  Text,
  Platform,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
} from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeColor } from '@/hooks/useThemeColor';
import { ArrowLeft2, Sms, User } from 'iconsax-react-native';
import Button from '@/lib/ui/components/button';
import FormInput from '@/lib/ui/components/formInput';
import PasswordInput from '@/lib/ui/components/passwordInput';
import PhoneInput from '@/lib/ui/components/phoneInput';
import { router } from 'expo-router';
import { register } from '@/lib/api/auth';

const SignupScreen = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const text = useThemeColor({}, 'text');
  const green500 = useThemeColor({}, 'green500');

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const route = async () => {
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsSubmitting(true);
    try {
      await register({
        firstName: firstname,
        lastName: lastname,
        email,
        number: phoneNumber,
        password,
        confirmPassword,
      });
      router.push('(screens)/onboarding/setupTransactionPinScreen');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Could not create your account');
    } finally {
      setIsSubmitting(false);
    }
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
              <FormInput
                icon={
                  <User
                    size='20'
                    color={green500}
                    style={{ marginRight: 10 }}
                  />
                }
                placeholder='First Name'
                value={firstname}
                onChangeText={setFirstname}
              />

              <FormInput
                icon={
                  <User
                    size='20'
                    color={green500}
                    style={{ marginRight: 10 }}
                  />
                }
                placeholder='Last Name'
                value={lastname}
                onChangeText={setLastname}
              />

              <FormInput
                icon={
                  <Sms
                    size='20'
                    color={green500}
                    style={{ marginRight: 10 }}
                  />
                }
                placeholder='Enter your email address'
                value={email}
                onChangeText={setEmail}
              />

              <PhoneInput
                value={phoneNumber}
                onChangeText={setPhoneNumber}
              />

              <PasswordInput
                placeholder='Enter Password'
                value={password}
                onChangeText={setPassword}
              />

              <PasswordInput
                placeholder='Confirm Password'
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
            </View>
          </View>
          {error ? (
            <Text className='text-red-500 mt-4'>{error}</Text>
          ) : null}
        </View>
        <View>
          {isSubmitting ? (
            <ActivityIndicator color={green500} />
          ) : (
            <Button
              route={route}
              btnText='Next'
            />
          )}
        </View>

        <View className='flex items-center justify-center mb-10 mt-8'>
          <Text style={{ color: text }}>Already have a stebills account</Text>
          <TouchableOpacity>
            <Text className='text-green-500'>Click here to Log in </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};
export default SignupScreen;
