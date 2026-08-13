import {
  View,
  Text,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeColor } from '@/hooks/useThemeColor';
import { ArrowLeft2 } from 'iconsax-react-native';
import Button from '@/lib/ui/components/button';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { getCurrentUser } from '@/lib/api/auth';
import { getMnemonic } from '@/lib/stellar/secureStorage';

const RevealSeedPhraseScreen = () => {
  const [words, setWords] = useState<string[]>([]);
  const [isChecked, setIsChecked] = useState(false);
  const [copied, setCopied] = useState(false);

  const text = useThemeColor({}, 'text');
  const green500 = useThemeColor({}, 'green500');

  useEffect(() => {
    const load = async () => {
      const user = await getCurrentUser();
      const mnemonic = user?._id ? await getMnemonic(user._id) : null;
      setWords(mnemonic ? mnemonic.trim().split(/\s+/) : []);
    };
    load();
  }, []);

  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(words.join(' '));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const route = () => {
    router.push('(screens)/onboarding/confirmSeedPhraseScreen');
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

      <View className='flex-1'>
        <Text
          className='text-2xl font-bold mt-6 mb-2'
          style={{ color: text }}
        >
          Your secret recovery phrase
        </Text>
        <Text
          className='text-sm mb-6'
          style={{ color: text }}
        >
          Write these 24 words down in order and keep them somewhere safe.
          Anyone with this phrase can access your funds. stebills cannot
          recover it for you.
        </Text>

        {words.length === 0 ? (
          <ActivityIndicator color={green500} />
        ) : (
          <View className='flex-row flex-wrap bg-gray-900 rounded-2xl p-4'>
            {words.map((word, index) => (
              <View
                key={index}
                className='w-1/2 flex-row items-center py-2'
              >
                <Text
                  className='w-6 text-xs text-green-500'
                >
                  {index + 1}.
                </Text>
                <Text style={{ color: text }}>{word}</Text>
              </View>
            ))}
          </View>
        )}

        <TouchableOpacity
          onPress={copyToClipboard}
          className='mt-4'
        >
          <Text className='text-green-500 text-center'>
            {copied ? 'Copied!' : 'Copy to clipboard'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setIsChecked(!isChecked)}
          className='flex-row items-center mt-8'
        >
          <View className='w-5 h-5 rounded-xl border-2 border-green-500 justify-center items-center mr-4'>
            {isChecked && (
              <MaterialIcons
                name='check'
                size={16}
                color={green500}
              />
            )}
          </View>
          <Text
            className='flex-1'
            style={{ color: text }}
          >
            I've written down my seed phrase and stored it safely
          </Text>
        </TouchableOpacity>
      </View>

      <View className='mb-10'>
        <Button
          route={route}
          btnText='Continue'
          isDisabled={!isChecked || words.length === 0}
        />
      </View>
    </SafeAreaView>
  );
};

export default RevealSeedPhraseScreen;
