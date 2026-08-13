import { View, Text, Platform, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeColor } from '@/hooks/useThemeColor';
import Button from '@/lib/ui/components/button';
import { router } from 'expo-router';
import { getCurrentUser } from '@/lib/api/auth';
import { createWalletForUser } from '@/lib/stellar/bootstrap';

const CreateWalletScreen = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');

  const text = useThemeColor({}, 'text');
  const green500 = useThemeColor({}, 'green500');

  const createWallet = async () => {
    setError('');
    setIsCreating(true);
    try {
      const user = await getCurrentUser();
      if (!user?._id) {
        throw new Error('No active session found');
      }

      await createWalletForUser(user._id);
      router.push('(screens)/onboarding/revealSeedPhraseScreen');
    } catch (err: any) {
      setError(err?.message || 'Could not create your Stellar wallet');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <SafeAreaView
      className={`flex-1 pt-${Platform.OS === 'android' ? '4' : '0'} px-6`}
    >
      <View className='flex-1 justify-center items-center'>
        <Text
          className='text-2xl font-bold text-center mb-4'
          style={{ color: text }}
        >
          Create your Stellar Wallet
        </Text>
        <Text
          className='text-sm text-center mb-8'
          style={{ color: text }}
        >
          We're about to generate a secure Stellar wallet for you on the
          testnet. You'll get a 24-word secret recovery phrase that only you
          control — stebills never sees or stores it.
        </Text>
        {error ? (
          <Text className='text-red-500 mb-4 text-center'>{error}</Text>
        ) : null}
        {isCreating ? (
          <ActivityIndicator color={green500} />
        ) : (
          <View className='w-full'>
            <Button
              route={createWallet}
              btnText='Create Wallet'
            />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default CreateWalletScreen;
