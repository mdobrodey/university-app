import { View } from 'react-native';
import { Stack } from "expo-router";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import GlobalProvider from "../context/GlobalProvider";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    "Gilroy-Light": require("../assets/fonts/Gilroy-Light.otf"),
    "Gilroy-ExtraBold": require("../assets/fonts/Gilroy-ExtraBold.otf"),
    "Montserrat-Bold": require("../assets/fonts/Montserrat-Bold.ttf"),
    "Montserrat-Light": require("../assets/fonts/Montserrat-Light.ttf"),
    "Montserrat-Medium": require("../assets/fonts/Montserrat-Medium.ttf"),
    "Montserrat-Regular": require("../assets/fonts/Montserrat-Regular.ttf"),
    "Montserrat-SemiBold": require("../assets/fonts/Montserrat-SemiBold.ttf"),
  });

  if (!fontsLoaded) {
    return <View style={{ flex: 1, backgroundColor: '#fff' }} />;
  }

  return (
    <SafeAreaProvider>
      <GlobalProvider>
        {fontsLoaded && (
          <Stack>
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="NewsWebView" options={{ headerShown: false}} />
          </Stack>
        )}
      </GlobalProvider>
    </SafeAreaProvider>
  );
}