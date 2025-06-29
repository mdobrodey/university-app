import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  StatusBar,
  Modal,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from "@expo/vector-icons";
import UniversityInfo from "../../components/UniversityInfo";

const Home = () => {
  const [news, setNews] = useState([]);
  const [universityModalVisible, setUniversityModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();;

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/news`);
      const data = await response.json();

      const newsWithIds = data.map((item, index) => ({
        ...item,
        id: item.id
      }));
      
      setNews(newsWithIds);
    } catch (error) {
      console.error("Error fetching news:", error);
      Alert.alert(
        "Ошибка",
        "Не удалось загрузить новости. Проверьте подключение к интернету.",
        [{ text: "OK" }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const toggleUniversityModal = () => {
    setUniversityModalVisible(!universityModalVisible);
  };

  const openNewsArticle = (url) => {
    try {
      router.push({
        pathname: "/NewsWebView",
        params: { url }
      });
    } catch (error) {
      console.error("Navigation error:", error);
      Alert.alert(
        "Ошибка",
        "Не удалось открыть новость",
        [{ text: "OK" }]
      );
    }
  };

  const renderNewsItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.newsBlock}
      onPress={() => openNewsArticle(item.link)}
      activeOpacity={0.8}
    >
      <View style={styles.imageContainer}>
        {item.imageUrl ? (
          <Image
            source={{ uri: item.imageUrl }}
            style={styles.newsImage}
          />
        ) : (
          <View style={[styles.newsImage, styles.placeholderImage]} />
        )}
        <Text style={styles.newsDate}>{item.date}</Text>
      </View>
      <View style={styles.newsContent}>
        <Text style={styles.newsTitle} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.readMore}>Читать далее</Text>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Feather name="inbox" size={48} color="#999" />
      <Text style={styles.emptyText}>Нет доступных новостей</Text>
      <TouchableOpacity 
        style={styles.refreshButton}
        onPress={fetchNews}
      >
        <Text style={styles.refreshButtonText}>Обновить</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container} edges={["right", "left"]}>
      <StatusBar barStyle="dark-content" />
      <FlatList
        data={news}
        keyExtractor={(item) => item.id ? item.id.toString() : Math.random().toString()}
        renderItem={renderNewsItem}
        contentContainerStyle={styles.listContent}
        ListHeaderComponentStyle={styles.listHeaderStyle}
        ListEmptyComponent={!isLoading && renderEmptyComponent()}
        refreshing={isLoading}
        showsVerticalScrollIndicator={false}
        onRefresh={fetchNews}
        ListHeaderComponent={() => (
          <>
            <TouchableOpacity
              style={styles.universityBlock}
              onPress={toggleUniversityModal}
              activeOpacity={0.95}
            >
              <Image
                source={require("../../assets/university.jpg")}
                style={styles.universityImage}
              />
              <LinearGradient
                colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.7)']}
                style={styles.gradient}
              />
              <View style={styles.universityContent}>
                <View style={styles.universityTextContainer}>
                  <Text style={styles.universityTitle}>О ПГУ</Text>
                  <Text style={styles.universitySubtitle}>
                    Полоцкий государственный университет
                  </Text>
                </View>
                <View style={styles.iconContainer}>
                  <Feather name="arrow-up-right" size={20} color="#FFF" />
                </View>
              </View>
            </TouchableOpacity>
            <View style={styles.headerContainer}>
              <Text style={styles.headerTitle}>Недавние события</Text>
              <View style={styles.headerUnderline} />
            </View>
          </>
        )}
      />
      
      <Modal
        animationType="slide"
        transparent={false}
        visible={universityModalVisible}
        onRequestClose={toggleUniversityModal}
      >
        <UniversityInfo onClose={toggleUniversityModal} />
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  listContent: {
    paddingHorizontal: 16,
  },
  listHeaderStyle: {
    paddingTop: 16,
  },
  headerTitle: {
    fontFamily: "Gilroy-ExtraBold",
    fontSize: 26,
    color: "black",
    textAlign: "left",
  },
  newsBlock: {
    backgroundColor: "white",
    borderRadius: 8,
    marginBottom: 16,
    overflow: "hidden",
    elevation: 1,
  },
  imageContainer: {
    position: "relative",
  },
  newsImage: {
    width: "100%",
    height: 200,
    backgroundColor: "#E5E5E5",
  },
  placeholderImage: {
    backgroundColor: "#E5E5E5",
  },
  newsDate: {
    position: "absolute",
    bottom: 8,
    right: 8,
    fontFamily: "Montserrat-Bold",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    color: "white",
    padding: 4,
    borderRadius: 4,
    fontSize: 12,
    fontWeight: "bold",
  },
  newsContent: {
    padding: 16,
  },
  newsTitle: {
    fontSize: 16,
    fontFamily: "Montserrat-Bold",
    marginBottom: 8,
    color: "#333",
  },
  readMore: {
    color: "#007AFF",
    fontSize: 13,
    fontFamily: "Montserrat-Bold",
  },
  universityBlock: {
    height: 180,
    borderRadius: 16,
    marginBottom: 24,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    elevation: 5,
  },
  universityImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '100%',
  },
  universityContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  universityTextContainer: {
    flex: 1,
  },
  universityTitle: {
    fontSize: 24,
    fontFamily: "Gilroy-ExtraBold",
    color: '#ffffff',
    marginBottom: 4,
  },
  universitySubtitle: {
    fontSize: 14,
    fontFamily: "Montserrat-Medium",
    color: '#ffffff',
    opacity: 0.9,
  },
  iconContainer: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    padding: 10,
    marginLeft: 16,
  },
  headerContainer: {
    marginBottom: 20,
  },
  headerSubtitle: {
    fontFamily: "Gilroy-ExtraBold",
    fontSize: 26,
    color: "black",
    marginBottom: 8,
  },
  headerUnderline: {
    width: 40,
    height: 3,
    marginTop: 5,
    backgroundColor: '#007AFF',
    borderRadius: 2,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontFamily: "Montserrat-Medium",
    fontSize: 16,
    color: '#999',
    marginTop: 12,
  },
  refreshButton: {
    marginTop: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#007AFF',
    borderRadius: 8,
  },
  refreshButtonText: {
    fontFamily: "Montserrat-Bold",
    fontSize: 14,
    color: '#FFF',
  },
});

export default Home;