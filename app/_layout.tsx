import { Stack } from 'expo-router';
import { CouncilProvider } from '@/contexts/CouncilContext';
import { AlertProvider, AuthProvider } from '@/template';

export default function RootLayout() {
  return (
    <AlertProvider>
      <AuthProvider>
        <CouncilProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="login" />
            <Stack.Screen name="(tabs)" />
          </Stack>
        </CouncilProvider>
      </AuthProvider>
    </AlertProvider>
  );
}
