import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useState } from "react";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import TeachersScreen from "../../components/teachersScreen";
import MaterialsScreen from "../../components/MaterialsScreen";
import TransportScreen from "../../components/ScheduleScreen";

const MainNavigationScreen = () => {
  const [selectedSection, setSelectedSection] = useState(null);
  const [selectedSubSection, setSelectedSubSection] = useState(null);

  const handleWebViewNavigation = (url) => {
    router.push({
      pathname: "/NewsWebView",
      params: { url: url },
    });
  };

  const navigationItems = [
    {
      title: "Преподаватели",
      icon: "users",
      color: "#4CAF50",
      onPress: () => setSelectedSection("teachers"),
    },
    {
      title: "Материалы",
      icon: "book-open",
      color: "#FF9800",
      onPress: () => setSelectedSection("maps"),
    },
    {
      title: "Учебные аккаунты",
      icon: "user",
      color: "#2196F3",
      onPress: () => setSelectedSection("accounts"),
    },
    {
      title: "Транспорт и маршруты",
      icon: "map-pin",
      color: "#9C27B0",
      onPress: () => setSelectedSection("transport"),
    },
    {
      title: "Репозиторий ПГУ",
      icon: "database",
      color: "#F44336",
      onPress: () => handleWebViewNavigation("https://elib.psu.by/"),
    },
  ];

  const NavItem = ({ item }) => (
    <TouchableOpacity
      style={styles.navItem}
      onPress={item.onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
        <Feather name={item.icon} size={22} color="#fff" />
      </View>
      <Text style={styles.navItemText}>{item.title}</Text>
      <Feather name="chevron-right" size={20} color="#A0A0A0" />
    </TouchableOpacity>
  );

  const NavigationMenu = () => (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Навигация</Text>
        <Text style={styles.subtitle}>Выберите нужный раздел</Text>
      </View>

      <View style={styles.navList}>
        {navigationItems.map((item, index) => (
          <NavItem key={index} item={item} />
        ))}
      </View>
    </ScrollView>
  );

  const AccountsMenu = () => (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => setSelectedSection(null)}
        >
          <Feather name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.screenTitle}>Учебные аккаунты</Text>
      </View>
      
      <View style={styles.simpleNavList}>
        <TouchableOpacity
          style={styles.simpleNavItem}
          onPress={() => handleWebViewNavigation("https://cit.psu.by/search/index.html")}
        >
          <Text style={styles.simpleNavText}>Поиск аккаунта</Text>
          <Feather name="chevron-right" size={20} color="#A0A0A0" />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.simpleNavItem}
          onPress={() => setSelectedSubSection("accountInfo")}
        >
          <Text style={styles.simpleNavText}>Информация</Text>
          <Feather name="chevron-right" size={20} color="#A0A0A0" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const AccountInfo = () => (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => setSelectedSubSection(null)}
        >
          <Feather name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.screenTitle}>Информация</Text>
      </View>
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.infoCard}>
          <View style={[styles.infoCardAccent, { backgroundColor: "#2196F3" }]} />
          <Text style={styles.infoText}>
            На время обучения в Полоцком государственном университете каждому
            студенту бесплатно предоставляется доступ к облачномым сервисам MS
            Office 365 и Google Classroom. Для доступа к сервисам каждому
            студенту, на основе личных сведений, автоматически созданы учетные
            данные в формате username@students.psu.by{"\n\n"}
            Учетные данные студентов университета{"\n\n"}
            Аккаунт, зарегистрированный в домене @students.psu.by, используется в
            том числе для дистанционного обучения (Google Classroom) и для работы
            с репозиторием Научной библиотеки университета, а также для доступа к
            сети Internet в компьютерных аудиториях и читальных залах Научной
            библиотеки.{"\n\n"}
            По вопросам работы аккаунта можно писать на электронную почту
            msoffice@psu.by или classroom@psu.by. В письме необходимо указать суть
            проблемы, а также личные данные:{"\n"}* ФИО{"\n"}* группа{"\n"}* дата
            рождения{"\n\n"}
          </Text>
        </View>
      </ScrollView>
    </View>
  );

  if (selectedSection === "teachers") {
    return (
      <View style={styles.container}>
        <TeachersScreen onBack={() => setSelectedSection(null)} />
      </View>
    );
  }

  if (selectedSection === "maps") {
    return (
      <View style={styles.container}>
        <MaterialsScreen onBack={() => setSelectedSection(null)} />
      </View>
    );
  }

  if (selectedSection === "accounts") {
    if (selectedSubSection === "accountInfo") {
      return <AccountInfo />;
    }
    return <AccountsMenu />;
  }

  if (selectedSection === "transport") {
    return (
      <View style={styles.container}>
        <TransportScreen onBack={() => setSelectedSection(null)} />
      </View>
    );
  }

  return <NavigationMenu />;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    padding: 20,
    paddingTop: 20,
    backgroundColor: "white",
  },
  title: {
    fontSize: 33,
    color: "#333",
    fontFamily: "Gilroy-ExtraBold",
  },
  subtitle: {
    fontSize: 16,
    fontFamily: "Montserrat-Medium",
    color: "#666",
    marginTop: 8,
  },
  navList: {
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  navItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  navItemText: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    paddingTop: 20,
  },
  backButton: {
    padding: 8,
    borderRadius: 8,
    marginRight: 12,
  },
  screenTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1a1a1a",
  },
  simpleNavList: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 16,
    overflow: "hidden",
  },
  simpleNavItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  simpleNavText: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  infoCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    margin: 16,
    padding: 16,
    overflow: "hidden",
    position: "relative",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  infoCardAccent: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
  },
  infoText: {
    fontSize: 15,
    lineHeight: 22,
    color: "#444",
  },
});

export default MainNavigationScreen;