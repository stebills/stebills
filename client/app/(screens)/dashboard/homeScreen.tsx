import { View, Text, Platform, TouchableOpacity, ActivityIndicator } from 'react-native';
import React, { useCallback, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeColor } from '@/hooks/useThemeColor';
import { router, useFocusEffect } from 'expo-router';
import { getCurrentUser } from '@/lib/api/auth';
import { getAccounts, StoredStellarAccount } from '@/lib/stellar/secureStorage';
import { getAccountInfo } from '@/lib/stellar/wallet';

const HomeScreen = () => {
  const [primaryAccount, setPrimaryAccount] = useState<StoredStellarAccount | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const text = useThemeColor({}, 'text');
  const green500 = useThemeColor({}, 'green500');
  const gray800 = useThemeColor({}, 'gray800');

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const user = await getCurrentUser();
      if (!user?._id) return;

      const accounts = await getAccounts(user._id);
      const main = accounts[0] ?? null;
      setPrimaryAccount(main);

      if (main) {
        const info = await getAccountInfo(main.publicKey);
        const native = info.balances.find((b) => b.assetType === 'native');
        setBalance(native?.balance ?? '0');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  return (
    <SafeAreaView
      className={`flex-1 pt-${Platform.OS === 'android' ? '4' : '0'} px-6`}
    >
      <Text
        className='text-2xl font-bold mt-6 mb-6'
        style={{ color: text }}
      >
        My Stellar Wallet
      </Text>

      {isLoading ? (
        <ActivityIndicator color={green500} />
      ) : primaryAccount ? (
        <View
          className='rounded-2xl p-5'
          style={{ backgroundColor: gray800 }}
        >
          <Text
            className='text-sm mb-1'
            style={{ color: text }}
          >
            {primaryAccount.label}
          </Text>
          <Text
            className='text-3xl font-bold mb-3'
            style={{ color: green500 }}
          >
            {balance ?? '0'} XLM
          </Text>
          <Text
            className='text-xs'
            style={{ color: text }}
            numberOfLines={1}
          >
            {primaryAccount.publicKey}
          </Text>
        </View>
      ) : (
        <Text style={{ color: text }}>No wallet found on this device.</Text>
      )}

      <TouchableOpacity
        className='mt-8'
        onPress={() => router.push('(screens)/dashboard/accountsScreen')}
      >
        <Text className='text-green-500 text-center text-base'>
          Manage accounts
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default HomeScreen;
