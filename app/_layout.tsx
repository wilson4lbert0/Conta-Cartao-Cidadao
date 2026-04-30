import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="meu-cartao" options={{ headerShown: false }} />
        <Stack.Screen name="ativar-conta" options={{ presentation: 'modal', headerShown: false }} />
        <Stack.Screen name="historico" options={{ headerShown: false }} />
        <Stack.Screen name="receber" options={{ headerShown: false }} />
        <Stack.Screen name="nova-transferencia" options={{ headerShown: false }} />
        <Stack.Screen name="pagar" options={{ headerShown: false }} />
        <Stack.Screen name="notificacoes" options={{ headerShown: false }} />
        <Stack.Screen name="contas" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
