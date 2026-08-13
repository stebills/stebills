import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { Stack } from 'expo-router';
import 'react-native-reanimated';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function DashboardLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen
          name='homeScreen'
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name='accountsScreen'
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name='accountDetailScreen'
          options={{ headerShown: false }}
        />
      </Stack>
    </ThemeProvider>
  );
}
