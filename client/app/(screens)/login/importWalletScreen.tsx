import {
  View,
  Text,
  Platform,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeColor } from '@/hooks/useThemeColor';
import Button from '@/lib/ui/components/button';
import { router } from 'expo-router';
import { getCurrentUser } from '@/lib/api/auth';
import { importWalletForUser } from '@/lib/stellar/bootstrap';

const ImportWalletScreen = () => {
  const [phrase, setPhrase] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const text = useThemeColor({}, 'text');
  const green500 = useThemeColor({}, 'green500');

  const importWallet = async () => {
    setError('');
    setIsSubmitting(true);
    try {
      const user = await getCurrentUser();
      if (!user?._id) {
        throw new Error('No active session found');
      }

      await importWalletForUser(user._id, phrase);
      router.replace('(screens)/dashboard/homeScreen');
    } catch (err: any) {
      setError(err?.message || 'Could not import your wallet');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView
      className={`flex-1 pt-${Platform.OS === 'android' ? '4' : '0'} px-6`}
    >
      <View className='flex-1'>
        <Text
          className='text-2xl font-bold mt-6 mb-2'
          style={{ color: text }}
        >
          Import your wallet
        </Text>
        <Text
          className='text-sm mb-6'
          style={{ color: text }}
        >
          This device doesn't have your Stellar wallet yet. Enter your
          24-word secret recovery phrase to restore access to your accounts.
        </Text>

        <TextInput
          className='bg-gray-900 rounded-2xl p-4 text-base'
          style={{ color: text, minHeight: 120, textAlignVertical: 'top' }}
          placeholder='Enter your 24-word seed phrase, separated by spaces'
          placeholderTextColor={text}
          value={phrase}
          onChangeText={setPhrase}
          multiline
          autoCapitalize='none'
          autoCorrect={false}
        />

        {error ? <Text className='text-red-500 mt-4'>{error}</Text> : null}
      </View>

      <View className='mb-10'>
        {isSubmitting ? (
          <ActivityIndicator color={green500} />
        ) : (
          <Button
            route={importWallet}
            btnText='Import Wallet'
            isDisabled={phrase.trim().split(/\s+/).length < 12}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default ImportWalletScreen;
