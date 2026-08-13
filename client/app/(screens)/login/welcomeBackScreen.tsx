import {
  View,
  Text,
  Platform,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeColor } from '@/hooks/useThemeColor';
import { ArrowLeft2, Message } from 'iconsax-react-native';
import Bio from '@/assets/svg/bio.svg';
import Button from '@/lib/ui/components/button';
import PasswordInput from '@/lib/ui/components/passwordInput';
import { MaterialIcons } from '@expo/vector-icons';
import BiometricModal from '@/app/(modals)/biometricModal';

const WelcomeBackScreen = () => {
  const [isChecked, setIsChecked] = useState(false);
  const [password, setPassword] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);

  const isFormValid = Boolean(password);

  const text = useThemeColor({}, 'text');
  const green500 = useThemeColor({}, 'green500');
  const gray800 = useThemeColor({}, 'gray800');

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const toggleBiometricModal = () => {
    setModalVisible(!isModalVisible);
  };

  const route = () => {
    // TODO: wire up authentication once the auth API integration lands
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
              <PasswordInput
                placeholder='Enter Password'
                value={password}
                onChangeText={setPassword}
              />
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
            <Button
              route={route}
              btnText='Next'
              isDisabled={!isFormValid}
            />
          </View>
          <View className='mt-4'>
            <Button
              bgColor={gray800}
              route={route}
              btnText='Create an account'
            />
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

        <View className='flex flex-row items-center justify-center mb-10 mt-8'>
          <Message color={green500} />
          <Text style={{ color: text }}>Need help?</Text>
          <TouchableOpacity>
            <Text className='text-green-500'> Contact stebills Support </Text>
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
export default WelcomeBackScreen;
