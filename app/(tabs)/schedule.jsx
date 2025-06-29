import { useState, useEffect, useCallback, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
  Modal,
  Image,
  Animated,
} from "react-native";
import { WebView } from "react-native-webview";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");
const itemWidth = (width - 40 - 20) / 2;

const courseGradients = [
  ["#FF6B6B", "#FF8E8E"],
  ["#4FACFE", "#00F2FE"],
  ["#43E97B", "#38F9D7"],
  ["#FA709A", "#FEE140"],
  ["#6E45E2", "#89D4CF"],
  ["#FF9A9E", "#FAD0C4"],
  ["#48C6EF", "#6F86D6"],
];

const ScheduleComponent = () => {
  const [faculties, setFaculties] = useState([]);
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [courses, setCourses] = useState([]);
  const [scheduleUrl, setScheduleUrl] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  const slideAnim = useRef(new Animated.Value(width)).current;

  useEffect(() => {
    fetchFaculties();
  }, []);

  const animateTransition = (showCourses) => {
    Animated.spring(slideAnim, {
      toValue: showCourses ? 0 : width,
      useNativeDriver: true,
    }).start();
  };

  const fetchFaculties = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/api/schedule`);
      setFaculties(response.data);
    } catch (error) {
      console.error("Error fetching faculties:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async (faculty) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.EXPO_PUBLIC_API_URL}/api/schedule/${encodeURIComponent(faculty)}`
      );
      setCourses(response.data);
      animateTransition(true);
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchScheduleUrl = async (faculty, course) => {
    try {
      const response = await axios.get(
        `${process.env.EXPO_PUBLIC_API_URL}/api/schedule/${encodeURIComponent(
          faculty
        )}/${course}`
      );
      setScheduleUrl(response.data.link);
      setModalVisible(true);
    } catch (error) {
      console.error("Error fetching schedule URL:", error);
    }
  };

  const handleBack = () => {
    animateTransition(false);
    setTimeout(() => {
      setSelectedFaculty(null);
      setCourses([]);
    }, 300);
  };

  const renderFacultyItem = useCallback(
    ({ item, index }) => (
      <TouchableOpacity
        style={styles.facultyItem}
        onPress={() => {
          setSelectedFaculty(item.name);
          fetchCourses(item.name);
        }}
        activeOpacity={0.9}
      >
        <Image source={{ uri: item.imageUrl }} style={styles.facultyImage} />
        <LinearGradient
          colors={["rgba(0,0,0,0)", "rgba(0,0,0,0.8)"]}
          style={styles.facultyGradient}
        >
          <View style={styles.facultyTextContainer}>
            <Text style={styles.facultyText}>{item.name}</Text>
            <View style={styles.arrowContainer}>
              <Ionicons name="arrow-forward" size={20} color="white" />
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    ),
    []
  );

  const renderCourseItem = useCallback(
    ({ item, index }) => (
      <TouchableOpacity
        style={styles.courseItem}
        onPress={() => fetchScheduleUrl(selectedFaculty, item.course)}
        activeOpacity={0.77}
      >
        <LinearGradient
          colors={courseGradients[index % courseGradients.length]}
          style={styles.courseBackground}
        >
          <Text style={styles.courseNumber}>{item.course}</Text>
          <Text style={styles.courseText}>курс</Text>
          <View style={styles.courseIconContainer}>
            <Ionicons name="calendar-outline" size={24} color="rgba(255,255,255,0.8)" />
          </View>
        </LinearGradient>
      </TouchableOpacity>
    ),
    [selectedFaculty]
  );

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      );
    }

    if (!selectedFaculty) {
      return (
        <FlatList
          data={faculties}
          renderItem={renderFacultyItem}
          keyExtractor={(item) => item.name}
          numColumns={2}
          columnWrapperStyle={styles.row}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContentContainer}
        />
      );
    }

    return (
      <Animated.View
        style={[
          styles.coursesContainer,
          {
            transform: [{ translateX: slideAnim }]
          }
        ]}
      >
        <FlatList
          data={courses}
          renderItem={renderCourseItem}
          keyExtractor={(item) => item.course.toString()}
          numColumns={2}
          columnWrapperStyle={styles.row}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContentContainer}
        />
      </Animated.View>
    );
  };

  return (
    <View style={styles.safeArea}>
      <View style={styles.container}>
        {selectedFaculty ? (
          <View style={styles.headerContainer}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={handleBack}
            >
              <Ionicons name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>
            <Text style={styles.subtitle}>{selectedFaculty}</Text>
          </View>
        ) : (
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Расписание</Text>
            <Text style={styles.titleDescription}>Выберите факультет</Text>
          </View>
        )}

        <View style={styles.listContainer}>
          {renderContent()}
        </View>

        <Modal
          animationType="slide"
          transparent={false}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Просмотр</Text>
            </View>
            {scheduleUrl && (
              <WebView
                source={{ uri: scheduleUrl }}
                startInLoadingState={true}
                onError={(syntheticEvent) => {
                  const { nativeEvent } = syntheticEvent;
                  console.warn("WebView error: ", nativeEvent);
                }}
              />
            )}
          </View>
        </Modal>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "white",
  },
  container: {
    flex: 1,
  },
  titleContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  title: {
    fontSize: 33,
    fontFamily: "Gilroy-ExtraBold",
    color: "#333",
    marginBottom: 8,
  },
  titleDescription: {
    fontSize: 16,
    fontFamily: "Montserrat-Medium",
    color: "#666",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "rgba(255,255,255,0.9)",
  },
  backButton: {
    padding: 8,
    borderRadius: 12,
    marginRight: 15,
  },
  subtitle: {
    fontSize: 20,
    fontFamily: "Gilroy-ExtraBold",
    color: "#333",
    flex: 1,
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  coursesContainer: {
    flex: 1,
    width: "100%",
  },
  listContentContainer: {
    paddingVertical: 10,
  },
  row: {
    justifyContent: "space-between",
    marginBottom: 20,
    gap: 20
  },
  facultyItem: {
    width: itemWidth,
    height: itemWidth * 1.3,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "white",
    shadowColor: "#000",
    elevation: 5,
  },
  facultyImage: {
    width: "100%",
    height: "100%",
    borderRadius: 20,
  },
  facultyGradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "60%",
    justifyContent: "flex-end",
    padding: 15,
  },
  facultyTextContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  facultyText: {
    flex: 1,
    fontSize: 24,
    fontFamily: "Gilroy-ExtraBold",
    color: "white",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  arrowContainer: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 12,
    padding: 8,
    marginLeft: 8,
  },
  courseItem: {
    width: itemWidth,
    height: 140,
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    elevation: 5,
  },
  courseBackground: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  courseNumber: {
    fontSize: 40,
    fontFamily: "Gilroy-ExtraBold",
    color: "#fff",
    marginBottom: 4,
  },
  courseText: {
    fontSize: 16,
    fontFamily: "Montserrat-Medium",
    color: "rgba(255,255,255,0.9)",
  },
  courseIconContainer: {
    position: "absolute",
    top: 20,
    right: 20,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: "Gilroy-ExtraBold",
    color: "#333",
    flex: 1,
    marginRight: 40,
  },
  closeButton: {
    padding: 8,
    borderRadius: 12,
    marginRight: 12,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F8F9FA",
  },
});

export default ScheduleComponent;