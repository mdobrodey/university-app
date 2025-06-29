import { Stack } from "expo-router";
import { View } from 'react-native';

const AuthLayout = () => {
  return (
    <View style={{ flex: 1 }}>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#FFF' },
          animation: 'slide_from_right'
        }}
      >
        <Stack.Screen
          name="sign-up"
          options={{
            title: "Регистрация"
          }}
        />
        <Stack.Screen
          name="sign-in"
          options={{
            title: "Вход"
          }}
        />
      </Stack>
    </View>
  );
};

export default AuthLayout;