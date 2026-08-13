import { useEffect, useState } from 'react';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import Constants from 'expo-constants';
import { googleSignIn } from './auth';
import { AuthResult } from './types';

WebBrowser.maybeCompleteAuthSession();

const extra = Constants.expoConfig?.extra ?? {};

export function useGoogleSignIn(onSuccess: (result: AuthResult) => void) {
  const [isExchanging, setIsExchanging] = useState(false);
  const [error, setError] = useState('');

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    iosClientId: extra.googleIosClientId || undefined,
    androidClientId: extra.googleAndroidClientId || undefined,
    webClientId: extra.googleWebClientId || undefined,
  });

  useEffect(() => {
    const exchange = async () => {
      if (response?.type !== 'success') return;

      const idToken = response.params.id_token;
      if (!idToken) return;

      setError('');
      setIsExchanging(true);
      try {
        const result = await googleSignIn(idToken);
        onSuccess(result);
      } catch (err: any) {
        setError(err?.response?.data?.message || 'Google sign-in failed');
      } finally {
        setIsExchanging(false);
      }
    };

    exchange();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response]);

  return {
    isReady: Boolean(request),
    isExchanging,
    error,
    promptAsync,
  };
}
