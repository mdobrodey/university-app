import { useState } from "react";
import { 
  Modal, 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  Linking,
  Image,
  Alert,
  StyleSheet
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ReportErrorModal from "./ReportErrorModal";

const SERVICES = [
  {
    name: "React Native",
    description: "Фреймворк для разработки мобильных приложений",
    icon: require("../assets/services/react-native.png"),
    color: "#61DAFB"
  },
  {
    name: "Expo",
    description: "Платформа для упрощения разработки и развертывания",
    icon: require("../assets/services/expo.png"),
    color: "#000020"
  },
  {
    name: "Express.js",
    description: "Веб-фреймворк для создания серверной части",
    icon: require("../assets/services/express.png"),
    color: "#000000"
  },
  {
    name: "MySQL",
    description: "База данных для хранения информации",
    icon: require("../assets/services/mysql.png"),
    color: "#00758F"
  },
  {
    name: "ZippyBus",
    description: "Сервис для получения расписания общественного транспорта",
    icon: require("../assets/services/apibuspng.png"),
    color: "#FF6B6B"
  },
  {
    name: "JWT",
    description: "Система аутентификации пользователей",
    icon: require("../assets/services/jwt.webp"),
    color: "#D63AFF"
  },
  {
    name: "Axios",
    description: "HTTP-клиент для выполнения запросов",
    icon: require("../assets/services/axiospng.png"),
    color: "#5A29E4"
  },
];

const AboutModal = ({ visible, onClose }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.aboutOverlay}>
        <View style={styles.aboutContainer}>
          <Image
            source={require("../assets/logo.png")}
            style={styles.aboutLogo}
            resizeMode="contain"
          />
          <Text style={styles.aboutVersion}>
            Version 1.0.0
          </Text>
          <TouchableOpacity
            onPress={onClose}
            style={styles.aboutCloseButton}
          >
            <Text style={styles.aboutCloseText}>
              Закрыть
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const ServicesModal = ({ visible, onClose }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.servicesOverlay}>
        <View style={styles.servicesContainer}>
          <Text style={styles.servicesTitle}>
            Используемые сервисы
          </Text>
          <ScrollView>
            {SERVICES.map((service, index) => (
              <View
                key={index}
                style={[
                  styles.serviceItem,
                  { borderBottomWidth: index !== SERVICES.length - 1 ? 0.5 : 0 }
                ]}
              >
                <Image
                  source={service.icon}
                  style={styles.serviceIcon}
                  resizeMode="contain"
                />
                <View style={styles.serviceInfo}>
                  <Text style={[styles.serviceName, { color: service.color }]}>
                    {service.name}
                  </Text>
                  <Text style={styles.serviceDescription}>
                    {service.description}
                  </Text>
                </View>
              </View>
            ))}
          </ScrollView>
          <TouchableOpacity
            onPress={onClose}
            style={styles.servicesCloseButton}
          >
            <Text style={styles.servicesCloseText}>
              Закрыть
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const SettingsModal = ({ visible, onClose }) => {
  const [showAbout, setShowAbout] = useState(false);
  const [showServices, setShowServices] = useState(false);
  const [showReportError, setShowReportError] = useState(false);
  const [reportText, setReportText] = useState('');

  const openTelegramSupport = async () => {
    const telegramUrl = 'https://t.me/techtamer';
    try {
      const supported = await Linking.canOpenURL(telegramUrl);
      if (supported) {
        await Linking.openURL(telegramUrl);
      } else {
        console.log("Не удалось открыть Telegram");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      "Выход из аккаунта",
      "Вы уверены, что хотите выйти?",
      [
        {
          text: "Отмена",
          style: "cancel"
        },
        {
          text: "Выйти",
          style: "destructive",
          onPress: async () => {
            try {
              console.log('Начинаем процесс выхода');
              await AsyncStorage.clear();
              console.log('Данные очищены');
              onClose();
              console.log('Модальное окно закрыто');
              router.replace("/(auth)/sign-in");
              console.log('Навигация выполнена');
            } catch (error) {
              console.error('Ошибка при выходе:', error);
              Alert.alert(
                "Ошибка",
                `Не удалось выполнить выход: ${error.message}`
              );
            }
          }
        }
      ]
    );
  };

  const SettingItem = ({ icon, title, onPress, color = "#007AFF", showBorder = true }) => (
    <TouchableOpacity 
      activeOpacity={0.7}
      style={[
        styles.settingItem,
        { borderBottomWidth: showBorder ? 0.5 : 0 }
      ]}
      onPress={onPress}
    >
      <View style={[styles.settingIconContainer, { backgroundColor: `${color}15` }]}>
        <Feather name={icon} size={18} color={color} />
      </View>
      <Text style={[styles.settingTitle, { color }]}>
        {title}
      </Text>
      <Feather name="chevron-right" size={20} color="rgba(60, 60, 67, 0.3)" />
    </TouchableOpacity>
  );

  return (
    <>
      <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
        onRequestClose={onClose}
      >
        <View style={styles.settingsOverlay}>
          <View style={styles.settingsContainer}>
            <View style={styles.handleBar} />

            <View style={styles.settingsHeader}>
              <Text style={styles.settingsHeaderText}>
                Настройки
              </Text>
            </View>

            <ScrollView>
              <View style={styles.settingsSection}>
                <SettingItem 
                  icon="help-circle" 
                  title="Помощь" 
                  onPress={openTelegramSupport}
                  color="#F1C40F"
                />
                <SettingItem 
                  icon="alert-triangle" 
                  title="Сообщить об ошибке" 
                  onPress={() => setShowReportError(true)}
                  color="#E74C3C"
                />
                <SettingItem 
                  icon="layers" 
                  title="Используемые сервисы" 
                  onPress={() => setShowServices(true)}
                  color="#9B59B6"
                />
                <SettingItem 
                  icon="info" 
                  title="О Приложении" 
                  onPress={() => setShowAbout(true)}
                  color="#3498DB"
                />
              </View>

              <View style={styles.accountSection}>
                <Text style={styles.accountSectionTitle}>
                  Аккаунт
                </Text>
              </View>
              
              <SettingItem 
                icon="log-out" 
                title="Выйти" 
                onPress={handleLogout}
                color="#FF3B30"
                showBorder={false}
              />
            </ScrollView>

            <TouchableOpacity 
              activeOpacity={0.7}
              onPress={onClose}
              style={styles.settingsCloseButton}
            >
              <Text style={styles.settingsCloseText}>
                Закрыть
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <AboutModal 
        visible={showAbout} 
        onClose={() => setShowAbout(false)} 
      />

      <ServicesModal
        visible={showServices}
        onClose={() => setShowServices(false)}
      />

      <ReportErrorModal
        visible={showReportError}
        onClose={() => setShowReportError(false)}
        reportText={reportText}
        setReportText={setReportText}
      />
    </>
  );
};

const styles = StyleSheet.create({
  settingsOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  settingsContainer: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
    elevation: 5,
  },
  handleBar: {
    width: 36,
    height: 5,
    backgroundColor: 'rgba(60, 60, 67, 0.3)',
    borderRadius: 2.5,
    alignSelf: 'center',
    marginTop: 8,
    marginBottom: 8,
  },
  settingsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(60, 60, 67, 0.1)',
  },
  settingsHeaderText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  settingsSection: {
    paddingVertical: 8,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomColor: 'rgba(60, 60, 67, 0.1)',
  },
  settingIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingTitle: {
    fontSize: 16,
    flex: 1,
    fontWeight: '400',
  },
  accountSection: {
    marginTop: 16,
    marginBottom: 8,
    paddingHorizontal: 20,
  },
  accountSectionTitle: {
    fontSize: 14,
    color: 'rgba(60, 60, 67, 0.6)',
    marginBottom: 8,
    fontWeight: '500',
  },
  settingsCloseButton: {
    paddingVertical: 16,
    alignItems: 'center',
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(60, 60, 67, 0.1)',
  },
  settingsCloseText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
  },

  aboutOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  aboutContainer: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 24,
    width: '80%',
    alignItems: 'center',
    elevation: 5,
  },
  aboutLogo: {
    width: 210,
    height: 210,
    marginBottom: 16,
  },
  aboutVersion: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  aboutCloseButton: {
    marginTop: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  aboutCloseText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '500',
  },

  servicesOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  servicesContainer: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 24,
    width: '80%',
    maxHeight: '70%',
    elevation: 5,
  },
  servicesTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  serviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomColor: 'rgba(60, 60, 67, 0.1)',
  },
  serviceIcon: {
    width: 40,
    height: 40,
    marginRight: 12,
    borderRadius: 8,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  serviceDescription: {
    fontSize: 14,
    color: 'rgba(60, 60, 67, 0.6)',
  },
  servicesCloseButton: {
    marginTop: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  servicesCloseText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default SettingsModal;