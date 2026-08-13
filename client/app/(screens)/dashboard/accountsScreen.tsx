import {
  View,
  Text,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  FlatList,
} from 'react-native';
import React, { useCallback, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeColor } from '@/hooks/useThemeColor';
import { ArrowLeft2, AddCircle } from 'iconsax-react-native';
import { router, useFocusEffect } from 'expo-router';
import { getCurrentUser } from '@/lib/api/auth';
import { getAccounts, StoredStellarAccount } from '@/lib/stellar/secureStorage';
import { getAccountInfo } from '@/lib/stellar/wallet';
import { addAccountForUser } from '@/lib/stellar/bootstrap';

type AccountRow = StoredStellarAccount & { balance: string };

const AccountsScreen = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [accounts, setAccounts] = useState<AccountRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newLabel, setNewLabel] = useState('');
  const [error, setError] = useState('');

  const text = useThemeColor({}, 'text');
  const green500 = useThemeColor({}, 'green500');
  const gray800 = useThemeColor({}, 'gray800');

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const user = await getCurrentUser();
      if (!user?._id) return;
      setUserId(user._id);

      const stored = await getAccounts(user._id);
      const withBalances = await Promise.all(
        stored.map(async (account) => {
          const info = await getAccountInfo(account.publicKey);
          const native = info.balances.find((b) => b.assetType === 'native');
          return { ...account, balance: native?.balance ?? '0' };
        })
      );
      setAccounts(withBalances);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const addAccount = async () => {
    if (!userId || !newLabel.trim()) return;

    setError('');
    setIsAdding(true);
    try {
      await addAccountForUser(userId, newLabel.trim());
      setNewLabel('');
      await load();
    } catch (err: any) {
      setError(err?.message || 'Could not add a new account');
    } finally {
      setIsAdding(false);
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
        className='text-2xl font-bold mt-6 mb-4'
        style={{ color: text }}
      >
        Your Accounts
      </Text>

      {isLoading ? (
        <ActivityIndicator color={green500} />
      ) : (
        <FlatList
          data={accounts}
          keyExtractor={(item) => item.publicKey}
          renderItem={({ item }) => (
            <TouchableOpacity
              className='rounded-2xl p-4 mb-3'
              style={{ backgroundColor: gray800 }}
              onPress={() =>
                router.push({
                  pathname: '(screens)/dashboard/accountDetailScreen',
                  params: {
                    publicKey: item.publicKey,
                    label: item.label,
                    accountIndex: item.accountIndex,
                  },
                })
              }
            >
              <Text
                className='text-sm mb-1'
                style={{ color: text }}
              >
                {item.label}
              </Text>
              <Text
                className='text-xl font-bold mb-2'
                style={{ color: green500 }}
              >
                {item.balance} XLM
              </Text>
              <Text
                className='text-xs'
                style={{ color: text }}
                numberOfLines={1}
              >
                {item.publicKey}
              </Text>
            </TouchableOpacity>
          )}
        />
      )}

      <View className='mt-4'>
        <View className='flex-row items-center bg-gray-900 rounded-xl px-3 py-2'>
          <AddCircle
            size={20}
            color={green500}
            style={{ marginRight: 8 }}
          />
          <TextInput
            className='flex-1 text-base'
            style={{ color: text }}
            placeholder='New account label'
            placeholderTextColor={text}
            value={newLabel}
            onChangeText={setNewLabel}
          />
          {isAdding ? (
            <ActivityIndicator color={green500} />
          ) : (
            <TouchableOpacity
              onPress={addAccount}
              disabled={!newLabel.trim()}
            >
              <Text className='text-green-500 font-semibold'>Add</Text>
            </TouchableOpacity>
          )}
        </View>
        {error ? <Text className='text-red-500 mt-2'>{error}</Text> : null}
      </View>
    </SafeAreaView>
  );
};

export default AccountsScreen;
