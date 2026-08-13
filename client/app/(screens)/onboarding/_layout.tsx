import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import 'react-native-reanimated';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  useFonts({
    SpaceMono: require('../../../assets/fonts/SpaceMono-Regular.ttf'),
  });

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen
          name='phoneNumberScreen'
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name='signupScreen'
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name='verifyPhoneNumber'
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name='setupTransactionPinScreen'
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name='createWalletScreen'
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name='revealSeedPhraseScreen'
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name='confirmSeedPhraseScreen'
          options={{ headerShown: false }}
        />
      </Stack>
    </ThemeProvider>
  );
}
