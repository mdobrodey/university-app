import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Modal,
  Image,
} from "react-native";
import { useState } from "react";
import { Feather } from "@expo/vector-icons";
import ImageViewer from "react-native-image-zoom-viewer";
import { LinearGradient } from "expo-linear-gradient";

const campusMap1 = require("../assets/11.jpg");
const campusMap2 = require("../assets/22.jpg");

const MaterialsScreen = ({ onBack }) => {
  const [isImageViewerVisible, setIsImageViewerVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = [
    {
      url: "",
      props: {
        title: "Карта корпусов ПГУ 1",
        source: campusMap1,
      },
    },
    {
      url: "",
      props: {
        title: "Карта корпусов ПГУ 2",
        source: campusMap2,
      },
    },
  ];

  const handleImagePress = (index) => {
    setCurrentImageIndex(index);
    setIsImageViewerVisible(true);
  };

  const MapThumbnail = ({ imageSource, title, onPress }) => (
    <TouchableOpacity
      style={styles.mapCard}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <LinearGradient
        colors={["rgba(255,255,255,0.8)", "rgba(255,255,255,0.4)"]}
        style={styles.mapCardGradient}
      >
        <View style={styles.thumbnailContainer}>
          <View style={styles.thumbnail}>
            <Text style={styles.thumbnailText}>{title}</Text>
          </View>
          <View style={styles.chevronContainer}>
            <Feather name="maximize" size={20} color="#007AFF" />
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={onBack}
          activeOpacity={0.7}
        >
          <Feather name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Материалы</Text>
      </View>

      <View style={styles.content}>
        <MapThumbnail
          imageSource={images[0].props.source}
          title="Карта корпусов, общежитий"
          onPress={() => handleImagePress(0)}
        />
        <MapThumbnail
          imageSource={images[1].props.source}
          title="Общественный транспорт"
          onPress={() => handleImagePress(1)}
        />
      </View>

      <Modal visible={isImageViewerVisible} transparent={true}>
        <ImageViewer
          imageUrls={images}
          index={currentImageIndex}
          onCancel={() => setIsImageViewerVisible(false)}
          renderImage={(props) => (
            <Image
              {...props}
              source={images[currentImageIndex].props.source}
              style={{ width: "100%", height: "100%" }}
              resizeMode="contain"
            />
          )}
          renderHeader={() => (
            <View>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setIsImageViewerVisible(false)}
              >
                <Feather name="x" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          )}
        />
      </Modal>
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
  },
  backButton: {
    padding: 8,
    borderRadius: 12,
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1a1a1a",
  },
  content: {
    flex: 1,
    padding: 16,
    gap: 16,
  },
  mapCard: {
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 1.5,
  },
  mapCardGradient: {
    padding: 16,
    backgroundColor: "#fff",
  },
  thumbnailContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  thumbnail: {
    flex: 1,
  },
  thumbnailText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1a1a1a",
    fontFamily: "Montserrat-Medium",
  },
  chevronContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(0,122,255,0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  closeButton: {
    position: "absolute",
    top: 20,
    right: 20,
    zIndex: 999,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default MaterialsScreen;