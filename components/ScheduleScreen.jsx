import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar } from "react-native";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";

const ScheduleScreen = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState('polotsk');
  const router = useRouter();

  const openScheduleWebsite = () => {
    const urls = {
      polotsk: 'https://zippybus.com/by/polotsk/',
      novopolotsk: 'https://zippybus.com/by/novopolotsk/'
    };
    
    router.push({
      pathname: "/NewsWebView",
      params: { 
        url: urls[activeTab]
      }
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={onBack}
          style={styles.backButton}
        >
          <Feather name="arrow-left" size={22} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Расписание</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'polotsk' && styles.activeTab]}
          onPress={() => setActiveTab('polotsk')}
        >
          <Text style={[styles.tabText, activeTab === 'polotsk' && styles.activeTabText]}>
            Полоцк
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'novopolotsk' && styles.activeTab]}
          onPress={() => setActiveTab('novopolotsk')}
        >
          <Text style={[styles.tabText, activeTab === 'novopolotsk' && styles.activeTabText]}>
            Новополоцк
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Feather name="clock" size={22} color="rgb(60, 93, 241)" />
          <Text style={styles.cardTitle}>
            {activeTab === 'polotsk' ? 'Расписание Полоцк' : 'Расписание Новополоцк'}
          </Text>
        </View>
        
        <Text style={styles.cardDescription}>
          Актуальное расписание движения общественного транспорта
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={openScheduleWebsite}
        >
          <Text style={styles.buttonText}>Открыть расписание</Text>
          <Feather name="arrow-right" size={18} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  backButton: {
    padding: 8,
    borderRadius: 8,
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1a1a1a",
  },
  tabsContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: 'rgb(60, 93, 241)',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6b7280',
  },
  activeTabText: {
    color: 'rgb(60, 93, 241)',
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginLeft: 10,
  },
  cardDescription: {
    fontSize: 15,
    color: '#6b7280',
    marginBottom: 20,
    lineHeight: 20,
  },
  button: {
    backgroundColor: 'rgb(60, 93, 241)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
});

export default ScheduleScreen;