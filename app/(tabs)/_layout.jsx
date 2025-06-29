import { Tabs } from "expo-router";
import { View, Text, StyleSheet } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Ionicons from "@expo/vector-icons/Ionicons";

const TabIcon = ({ Icon, iconName, color, focused, title }) => (
  <View style={styles.tabIconContainer}>
    <Icon name={iconName} size={24} color={color} />
    <Text
      style={[
        styles.tabLabel,
        { color, fontFamily: focused ? "Montserrat-SemiBold" : "Montserrat-SemiBold" }
      ]}
    >
      {title}
    </Text>
  </View>
);

const TabLayout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: "#2563EB",
        tabBarInactiveTintColor: "#6B7280",
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          headerShown: true,
          headerTitle: "Актуальное",
          headerTitleStyle: [
            styles.headerTitle,
            { color: 'black' }
          ],
          headerStyle: styles.header,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              Icon={FontAwesome}
              iconName="star"
              color={color}
              focused={focused}
              title="Актуальное"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="schedule"
        options={{
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              Icon={FontAwesome}
              iconName="book"
              color={color}
              focused={focused}
              title="Расписание"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="additional"
        options={{
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              Icon={Ionicons}
              iconName="book"
              color={color}
              focused={focused}
              title="Полезное"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              Icon={FontAwesome}
              iconName="user-circle"
              color={color}
              focused={focused}
              title="Профиль"
            />
          ),
        }}
      />
    </Tabs>
  );
};

const styles = StyleSheet.create({
  tabIconContainer: {
    alignItems: 'center',
    paddingTop: 9,
  },
  tabLabel: {
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
    width: '100%',
  },
  tabBar: {
    height: 58,
    paddingTop: 5,
  },
  headerTitle: {
    fontSize: 33,
    fontFamily: "Gilroy-ExtraBold",
    marginTop: 12,
    borderBlockColor: 'white',
    paddingHorizontal: 4,
  },
  header: {
    height: 70,
    elevation: 0,
  },
});

export default TabLayout;