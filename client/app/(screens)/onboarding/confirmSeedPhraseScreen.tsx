import { View, Text, Platform, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeColor } from '@/hooks/useThemeColor';
import { ArrowLeft2 } from 'iconsax-react-native';
import Button from '@/lib/ui/components/button';
import FormInput from '@/lib/ui/components/formInput';
import { router } from 'expo-router';
import { getCurrentUser } from '@/lib/api/auth';
import { getMnemonic } from '@/lib/stellar/secureStorage';

function pickQuizIndices(wordCount: number): number[] {
  const indices = new Set<number>();
  while (indices.size < 3 && indices.size < wordCount) {
    indices.add(Math.floor(Math.random() * wordCount));
  }
  return Array.from(indices).sort((a, b) => a - b);
}

const ConfirmSeedPhraseScreen = () => {
  const [words, setWords] = useState<string[]>([]);
  const [quizIndices, setQuizIndices] = useState<number[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [error, setError] = useState('');

  const text = useThemeColor({}, 'text');
  const green500 = useThemeColor({}, 'green500');

  useEffect(() => {
    const load = async () => {
      const user = await getCurrentUser();
      const mnemonic = user?._id ? await getMnemonic(user._id) : null;
      const wordList = mnemonic ? mnemonic.trim().split(/\s+/) : [];
      setWords(wordList);
      setQuizIndices(pickQuizIndices(wordList.length));
    };
    load();
  }, []);

  const isFormValid = quizIndices.every((index) => (answers[index] || '').trim().length > 0);

  const submit = () => {
    setError('');
    const allCorrect = quizIndices.every(
      (index) => (answers[index] || '').trim().toLowerCase() === words[index]
    );

    if (!allCorrect) {
      setError('One or more words are incorrect. Please check your backup and try again.');
      return;
    }

    router.push('(screens)/dashboard/homeScreen');
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
          Confirm your backup
        </Text>
        <Text
          className='text-sm mb-6'
          style={{ color: text }}
        >
          Enter the requested words from your seed phrase to confirm you've
          saved it correctly.
        </Text>

        {quizIndices.map((index) => (
          <FormInput
            key={index}
            placeholder={`Word #${index + 1}`}
            value={answers[index] || ''}
            onChangeText={(value) =>
              setAnswers((prev) => ({ ...prev, [index]: value }))
            }
          />
        ))}

        {error ? <Text className='text-red-500 mt-2'>{error}</Text> : null}
      </View>

      <View className='mb-10'>
        <Button
          route={submit}
          btnText='Confirm'
          isDisabled={!isFormValid}
        />
      </View>
    </SafeAreaView>
  );
};

export default ConfirmSeedPhraseScreen;
