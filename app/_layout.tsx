import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet, View } from 'react-native';
import 'react-native-reanimated';

import { PlayerProvider } from '@/contexts/player-context';
import { useColorScheme } from '@/hooks/use-color-scheme';

const IPHONE_17_WIDTH = 430;
const IPHONE_17_HEIGHT = 932;

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <View style={styles.viewportRoot}>
        <View style={styles.viewportFrame}>
          <PlayerProvider>
            <Stack>
              <Stack.Screen name="index" options={{ headerShown: false }} />
              <Stack.Screen name="all-albums" options={{ headerShown: false }} />
              <Stack.Screen name="player" options={{ headerShown: false, presentation: 'modal' }} />
            </Stack>
          </PlayerProvider>
        </View>
      </View>
      <StatusBar style="light" />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  viewportRoot: {
    flex: 1,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewportFrame: {
    flex: 1,
    width: '100%',
    ...(Platform.OS === 'web'
      ? {
          width: IPHONE_17_WIDTH,
          minWidth: IPHONE_17_WIDTH,
          maxWidth: IPHONE_17_WIDTH,
          height: IPHONE_17_HEIGHT,
          minHeight: IPHONE_17_HEIGHT,
          maxHeight: IPHONE_17_HEIGHT,
          overflow: 'hidden',
          borderRadius: 22,
          borderWidth: 1,
          borderColor: '#1a1a1a',
          backgroundColor: '#000000',
        }
      : {}),
  },
});
