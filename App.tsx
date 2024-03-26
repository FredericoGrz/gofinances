import 'intl';
import 'intl/locale-data/jsonp/pt-BR';
import React, { useCallback } from 'react';
import { ThemeProvider } from 'styled-components';
import { NavigationContainer } from '@react-navigation/native';
import * as SplashScreen from 'expo-splash-screen';

import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';

import theme from './src/global/styles/theme';
import { AppRoutes } from './src/routes/app.routes';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { AuthContext } from './src/AuthContenxt';

import { SignIn } from './src/screens/SignIn';
import { AuthProvider } from './src/hooks/auth';

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold,
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <ThemeProvider theme={theme}>
      <NavigationContainer>
        <StatusBar style="light" />
        <View
          onLayout={onLayoutRootView}
          style={{ width: '100%', height: '100%' }}>
          <AuthProvider>
            <SignIn />
          </AuthProvider>
        </View>
      </NavigationContainer>
    </ThemeProvider>
  );
}
