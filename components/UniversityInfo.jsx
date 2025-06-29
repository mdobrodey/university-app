import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Feather } from "@expo/vector-icons";

const UniversityInfo = ({ onClose }) => {
  const statElements = [
    {
      count: '6,000',
      label: 'Студентов',
      icon: 'users'
    },
    {
      count: '7',
      label: 'Факультетов',
      icon: 'book-open'
    },
    {
      count: '45+',
      label: 'Специальностей',
      icon: 'award'
    },
    {
      count: '500+',
      label: 'Преподавателей',
      icon: 'briefcase'
    }
  ]
  return (
    <View style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>
            О Полоцком государственном университете
          </Text>
          <TouchableOpacity 
            style={styles.closeButton} 
            onPress={onClose}
          >
            <Feather name="x" size={24} color="#333" />
          </TouchableOpacity>
        </View>

        <View style={styles.mainContent}>
          <View style={styles.descriptionCard}>
            <View style={styles.gradientAccent} />
            <Text style={styles.description}>
              ПГУ – интеллектуальный и культурный центр региона, драйвер его
              экономического развития. Это не отдельная структура, а целая
              экосистема, которая объединяет образование и науку, промышленность и
              бизнес, человеческие и организационные ресурсы.
            </Text>
          </View>

          <View style={styles.statsContainer}>
              {statElements.map((el, index) => {
                return (
                  <View key={index} style={styles.statBlock}>
                    <View style={styles.statContent}>
                      <Text style={styles.statNumber}>{el.count}</Text>
                      <Text style={styles.statLabel}>{el.label}</Text>
                    </View>
                    <View style={styles.statIcon}>
                      <Feather name={el.icon} size={20} color="#007AFF" />
                    </View>
                  </View>
                )
              })}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  closeButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: "#F0F0F0",
  },
  title: {
    flex: 1,
    fontSize: 24,
    fontFamily: 'Gilroy-ExtraBold',
    color: "#333",
    marginRight: 16,
  },
  mainContent: {
    flex: 1,
  },
  descriptionCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    overflow: 'hidden',
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    elevation: 2,
  },
  gradientAccent: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: '#007AFF',
  },
  description: {
    fontSize: 16,
    fontFamily: 'Montserrat-Regular',
    color: "#666",
    lineHeight: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  statBlock: {
    width: '47%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    elevation: 2,
  },
  statContent: {
    flex: 1,
  },
  statNumber: {
    fontSize: 24,
    fontFamily: 'Gilroy-ExtraBold',
    color: "#007AFF",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    fontFamily: 'Montserrat-Medium',
    color: "#666",
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,122,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
});

export default UniversityInfo;