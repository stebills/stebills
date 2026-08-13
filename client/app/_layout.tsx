import '@/lib/polyfills';
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, Href, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import { useColorScheme } from '@/hooks/useColorScheme';
import { storage } from '@/lib/utils';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const PERSISTENCE_KEY = 'NAVIGATION_STATE';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const [isReady, setIsReady] = useState(false);
  const [initialRoute, setInitialRoute] = useState<string | null>(null); // Change to a string
  const router = useRouter();
  const segments = useSegments();

  // Restore saved navigation state on load
  useEffect(() => {
    const restoreState = async () => {
      try {
        const savedRoute = await storage.getItem(PERSISTENCE_KEY);
        if (savedRoute) {
          setInitialRoute(savedRoute); // Set saved route directly as a string
        }
      } catch (e) {
        console.error('Error restoring route:', e);
      }
      setIsReady(true);
    };

    restoreState();
  }, []);

  // Save the current route whenever it changes
  useEffect(() => {
    const saveRoute = async () => {
      const currentRoute = `/${segments.join('/')}`;
      await storage.setItem(PERSISTENCE_KEY, currentRoute);
    };

    saveRoute();
  }, [segments]);

  // Navigate to the saved route once the app is ready
  useEffect(() => {
    if (initialRoute && isReady && loaded) {
      router.replace(initialRoute as Href);
    }
  }, [initialRoute, isReady, loaded, router]);

  useEffect(() => {
    if (loaded && isReady) {
      SplashScreen.hideAsync();
    }
  }, [loaded, isReady]);

  if (!loaded || !isReady) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen
          name='index'
          options={{ headerShown: false }}
        />
        {/* <Stack.Screen
          name='(tabs)'
          options={{ headerShown: false }}
        /> */}
        <Stack.Screen
          name='(screens)'
          options={{ headerShown: false }}
        />
      </Stack>
    </ThemeProvider>
  );
}
