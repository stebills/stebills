import React from 'react';
import {
  Text,
  View,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useThemeColor } from '@/hooks/useThemeColor';
import Button from '@/lib/ui/components/button';
import Logo from '@/lib/ui/components/logo';
import { useGoogleSignIn } from '@/lib/api/useGoogleSignIn';
import { hasLocalWallet } from '@/lib/stellar/bootstrap';

function WelcomeScreen() {
  const text = useThemeColor({}, 'text');
  const gray800 = useThemeColor({}, 'gray800');
  const green500 = useThemeColor({}, 'green500');

  const createAccountRoute = () => {
    router.push('(screens)/onboarding/phoneNumberScreen');
  };

  const loginRoute = () => {
    router.push('(screens)/login/loginScreen');
  };

  const { isReady, isExchanging, error, promptAsync } = useGoogleSignIn(
    async (result) => {
      if (result.isNewUser) {
        router.push('(screens)/onboarding/createWalletScreen');
        return;
      }

      const walletExists = await hasLocalWallet(result.user._id);
      router.push(
        walletExists
          ? '(screens)/dashboard/homeScreen'
          : '(screens)/login/importWalletScreen'
      );
    }
  );

  return (
    <SafeAreaView
      className={`flex-1 pt-${Platform.OS === 'android' ? '4' : '0'}`}
    >
      <View className='flex-1 justify-center items-center p-6'>
        <Logo size={64} />
        <Text
          className={`text-2xl font-bold text-center mt-6`}
          style={[{}, { color: text }]}
        >
          Welcome to stebills
        </Text>
        <Text
          className={`text-lg text-center mx-5 my-4 leading-7`}
          style={[{}, { color: text }]}
        >
          stebills is your go-to solution for simplified bill payments. Create an
          account or sign in to this innovative platform.
        </Text>
        <View className='w-full mt-4'>
          <Button
            bgColor={gray800}
            route={createAccountRoute}
            btnText='Create an account'
          />
        </View>
        <View className='w-full m-4'>
          <Button
            // bgColor={gray800}
            route={loginRoute}
            btnText='Login'
          />
        </View>
        <View className='w-full mb-4'>
          {isExchanging ? (
            <ActivityIndicator color={green500} />
          ) : (
            <TouchableOpacity
              disabled={!isReady}
              onPress={() => promptAsync()}
              style={{
                borderWidth: 1,
                borderColor: green500,
                borderRadius: 10,
                paddingVertical: 10,
                alignItems: 'center',
              }}
            >
              <Text style={{ color: green500, fontSize: 16, fontWeight: '600' }}>
                Continue with Google
              </Text>
            </TouchableOpacity>
          )}
        </View>
        {error ? (
          <Text className='text-red-500 text-center mb-2'>{error}</Text>
        ) : null}
        <Text
          className={`text-base text-center mx-5`}
          style={[{}, { color: text }]}
        >
          By clicking on{' '}
          <Text className='text-green-500'>"Create an account"</Text> or{' '}
          <Text className='text-green-500'>"Login",</Text> you have agreed to
          our terms and conditions.
        </Text>
      </View>
    </SafeAreaView>
  );
}

export default WelcomeScreen;
