import {
  View,
  Text,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeColor } from '@/hooks/useThemeColor';
import { ArrowLeft2 } from 'iconsax-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import * as Clipboard from 'expo-clipboard';
import Button from '@/lib/ui/components/button';
import PasswordInput from '@/lib/ui/components/passwordInput';
import { getCurrentUser, verifyTransactionPin } from '@/lib/api/auth';
import { getMnemonic } from '@/lib/stellar/secureStorage';
import { deriveAccount } from '@/lib/stellar/wallet';

const AccountDetailScreen = () => {
  const { publicKey, label, accountIndex } = useLocalSearchParams<{
    publicKey: string;
    label: string;
    accountIndex: string;
  }>();

  const [copied, setCopied] = useState(false);
  const [pin, setPin] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState('');
  const [revealedSecret, setRevealedSecret] = useState<string | null>(null);

  const text = useThemeColor({}, 'text');
  const green500 = useThemeColor({}, 'green500');
  const gray800 = useThemeColor({}, 'gray800');

  const copyAddress = async () => {
    await Clipboard.setStringAsync(publicKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const revealSecret = async () => {
    setError('');
    setIsVerifying(true);
    try {
      const pinValid = await verifyTransactionPin(pin);
      if (!pinValid) {
        setError('Incorrect transaction pin');
        return;
      }

      const user = await getCurrentUser();
      const mnemonic = user?._id ? await getMnemonic(user._id) : null;
      if (!mnemonic) {
        setError('No wallet found on this device');
        return;
      }

      const account = deriveAccount(mnemonic, Number(accountIndex));
      setRevealedSecret(account.secretKey);
    } catch {
      setError('Could not verify your transaction pin');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <SafeAreaView
      className={`flex-1 pt-${Platform.OS === 'android' ? '4' : '0'} px-6`}
    >
      <TouchableOpacity onPress={() => router.back()}>
        <ArrowLeft2
          size={25}
          color={green500}
        />
      </TouchableOpacity>

      <Text
        className='text-2xl font-bold mt-6 mb-1'
        style={{ color: text }}
      >
        {label}
      </Text>

      <View
        className='rounded-2xl p-4 mt-4'
        style={{ backgroundColor: gray800 }}
      >
        <Text
          className='text-xs mb-2'
          style={{ color: text }}
        >
          Public address
        </Text>
        <Text
          className='text-sm mb-3'
          style={{ color: text }}
        >
          {publicKey}
        </Text>
        <TouchableOpacity onPress={copyAddress}>
          <Text className='text-green-500'>
            {copied ? 'Copied!' : 'Copy address'}
          </Text>
        </TouchableOpacity>
      </View>

      <View className='mt-8'>
        <Text
          className='text-lg font-semibold mb-2'
          style={{ color: text }}
        >
          Reveal secret key
        </Text>
        <Text
          className='text-sm mb-4'
          style={{ color: text }}
        >
          Enter your transaction pin to reveal this account's secret key.
          Never share it with anyone.
        </Text>

        {revealedSecret ? (
          <View
            className='rounded-2xl p-4'
            style={{ backgroundColor: gray800 }}
          >
            <Text
              className='text-sm'
              style={{ color: text }}
            >
              {revealedSecret}
            </Text>
          </View>
        ) : (
          <>
            <PasswordInput
              placeholder='Transaction pin'
              value={pin}
              onChangeText={setPin}
            />
            {error ? (
              <Text className='text-red-500 mt-2'>{error}</Text>
            ) : null}
            <View className='mt-4'>
              {isVerifying ? (
                <ActivityIndicator color={green500} />
              ) : (
                <Button
                  route={revealSecret}
                  btnText='Reveal secret key'
                  isDisabled={pin.length < 4}
                />
              )}
            </View>
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

export default AccountDetailScreen;
