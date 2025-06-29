import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  Modal,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  Alert,
  ScrollView,
  Linking,
} from "react-native";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Feather } from "@expo/vector-icons";


const TeachersScreen = ({ onBack }) => {
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTeachers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const endpoint = searchQuery.trim()
        ? `${process.env.EXPO_PUBLIC_API_URL}/deteledForPrivacy/search?q=${encodeURIComponent(searchQuery)}`
        : `${process.env.EXPO_PUBLIC_API_URL}/deteledForPrivacy`;
      
      const response = await axios.get(endpoint);

      const transformedTeachers = response.data.map(teacher => ({
        ...teacher,
        photo_url: teacher.photo_url.startsWith('http') 
          ? teacher.photo_url 
          : `${process.env.EXPO_PUBLIC_API_URL}/routes${teacher.photo_url}` 
      }));
      
      setTeachers(transformedTeachers);
    } catch (error) {
      console.error("Error fetching teachers:", error);
      setError("Deleted for privacy");
      Alert.alert("Error", "Deleted for privacy");
    } finally {
      setLoading(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    const delaySearch = setTimeout(() => {
      fetchTeachers();
    }, 300);

    return () => clearTimeout(delaySearch);
  }, [fetchTeachers]);

  const handleImageError = (teacherId) => {
    setTeachers(prevTeachers => 
      prevTeachers.map(teacher => 
        teacher.id === teacherId 
          ? { ...teacher, photo_url: 'https://via.placeholder.com/150' }
          : teacher
      )
    );
  };

  const renderTeacherItem = ({ item }) => (
    <TouchableOpacity
      style={styles.teacherItem}
      onPress={() => {
        setSelectedTeacher(item);
        setModalVisible(true);
      }}
    >
      <View style={styles.teacherRow}>
        <View style={styles.teacherImageContainer}>
          <Image
            source={{ uri: item.photo_url }}
            style={styles.teacherThumbnail}
            onError={() => handleImageError(item.id)}
          />
        </View>
        <View style={styles.teacherInfo}>
          <Text style={styles.teacherName}>{item.name}</Text>
          <Text style={styles.teacherDepartment}>{item.department}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const handleEmailPress = (email) => {
    const emails = email.split(',').map(e => e.trim());
    if (emails.length > 1) {
      Alert.alert(
        "Выберите email",
        "Выберите адрес электронной почты:",
        emails.map(email => ({
          text: email,
          onPress: () => Linking.openURL(`mailto:${email}`)
        }))
      );
    } else {
      Linking.openURL(`mailto:${emails[0]}`);
    }
  };

  const TeacherModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <ScrollView showsVerticalScrollIndicator={false} style={styles.modalScroll}>
            <View style={styles.modalHeader}>
              <TouchableOpacity
                style={styles.closeModalButton}
                onPress={() => setModalVisible(false)}
              >
                <Feather name="x" size={24} color="#000" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalImageContainer}>
              <Image
                source={{ uri: selectedTeacher?.photo_url }}
                style={styles.teacherPhoto}
                onError={() => handleImageError(selectedTeacher?.id)}
              />
            </View>

            <View style={styles.modalInfoContainer}>
              <Text style={styles.modalName}>{selectedTeacher?.name}</Text>
              <View style={styles.departmentBadge}>
                <Text style={styles.departmentText}>
                  {selectedTeacher?.department}
                </Text>
              </View>

              <View style={styles.contactSection}>
                <Text style={styles.sectionTitle}>Контактная информация</Text>
                
                <TouchableOpacity 
                  style={styles.contactItem}
                  onPress={() => handleEmailPress(selectedTeacher?.email)}
                >
                  <View style={styles.contactIconContainer}>
                    <Text style={styles.contactIcon}>✉️</Text>
                  </View>
                  <View style={styles.contactDetails}>
                    <Text style={styles.contactLabel}>Email</Text>
                    <Text style={styles.contactValue}>{selectedTeacher?.email}</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.contactItem}
                  onPress={() => Linking.openURL(`tel:${selectedTeacher?.phone}`)}
                >
                  <View style={styles.contactIconContainer}>
                    <Text style={styles.contactIcon}>📱</Text>
                  </View>
                  <View style={styles.contactDetails}>
                    <Text style={styles.contactLabel}>Телефон</Text>
                    <Text style={styles.contactValue}>{selectedTeacher?.phone}</Text>
                  </View>
                </TouchableOpacity>

                <View style={styles.contactItem}>
                  <View style={styles.contactIconContainer}>
                    <Text style={styles.contactIcon}>📍</Text>
                  </View>
                  <View style={styles.contactDetails}>
                    <Text style={styles.contactLabel}>Адрес</Text>
                    <Text style={styles.contactValue}>{selectedTeacher?.address}</Text>
                  </View>
                </View>
              </View>

              {selectedTeacher?.experience && (
                <View style={styles.experienceSection}>
                  <Text style={styles.sectionTitle}>Опыт работы</Text>
                  <Text style={styles.experienceText}>
                    {selectedTeacher.experience}
                  </Text>
                </View>
              )}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Feather name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Преподаватели</Text>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Поиск преподавателей..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <FlatList
          data={teachers}
          renderItem={renderTeacherItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Преподаватели не найдены</Text>
          }
        />
      )}

      <TeacherModal />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    backgroundColor: "#f5f5f5",
  },
  backButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: "#F0F0F0",
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
  },
  searchContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  searchInput: {
    height: 40,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: "#f5f5f5",
  },
  listContainer: {
    padding: 16,
  },
  teacherItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  teacherRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  teacherImageContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: "hidden",
    marginRight: 12,
  },
  teacherThumbnail: {
    width: "100%",
    height: "150%",
    resizeMode: "cover",
  },
  teacherInfo: {
    flex: 1,
  },
  teacherName: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  teacherDepartment: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    minHeight: "80%",
    maxHeight: "95%",
    width: "100%",
    overflow: "hidden",
  },
  modalScroll: {
    flex: 1,
  },
  modalHeader: {
    alignItems: "flex-end",
    padding: 16,
  },
  closeModalButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#F0F0F0",
    justifyContent: "center",
    alignItems: "center",
  },
  closeModalButtonText: {
    fontSize: 16,
    color: "#666",
  },
  modalImageContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  teacherPhoto: {
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 3,
    borderColor: "#fff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalInfoContainer: {
    padding: 20,
  },
  modalName: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "#333",
    marginBottom: 10,
  },
  departmentBadge: {
    backgroundColor: "#e3f2fd",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignSelf: "center",
    marginBottom: 20,
  },
  departmentText: {
    color: "#1976d2",
    fontSize: 14,
    fontWeight: "500",
  },
  contactSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 16,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  contactIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  contactIcon: {
    fontSize: 20,
  },
  contactDetails: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  contactValue: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  experienceSection: {
    backgroundColor: "#f8f9fa",
    padding: 16,
    borderRadius: 12,
  },
  experienceText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    textAlign: "center",
    color: "red",
    fontSize: 16,
    marginTop: 20,
  },
  emptyText: {
    textAlign: "center",
    fontSize: 16,
    marginTop: 20,
  },
});

export default TeachersScreen;