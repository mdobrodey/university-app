import { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  FlatList,
  Animated,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useGlobalContext } from "../../context/GlobalProvider";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from "expo-image-picker";

import PostCreationModal from "../../components/PostCreationModal";
import SettingsModal from "../../components/SettingsModal";
import { makeAuthenticatedRequest, fetchUserData, fetchPosts, updateUsername, uploadAvatar, getImageUrl } from "../../components/ProfileApi";
import defaultImage from '../../assets/noprofile.png';

const Profile = () => {
  const { setIsLoggedIn, user, setUser } = useGlobalContext();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [editingUsername, setEditingUsername] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [newPost, setNewPost] = useState({ title: "", content: "", image: null });
  const [scrollY] = useState(new Animated.Value(0));

  const headerHeight = scrollY.interpolate({
    inputRange: [0, 120],
    outputRange: [200, 80],
    extrapolate: 'clamp',
  });
  
  const imageSize = scrollY.interpolate({
    inputRange: [0, 120],
    outputRange: [80, 40],
    extrapolate: 'clamp',
  });
  
  const textOpacity = scrollY.interpolate({
    inputRange: [0, 60, 120],
    outputRange: [1, 0.5, 0],
    extrapolate: 'clamp',
  });

  useEffect(() => {
    initializeProfile();
  }, []);

  const initializeProfile = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        handleAuthError();
        return;
      }

      await fetchUserData(token, setUser);
      await fetchPosts(token, setPosts);
      setLoading(false);
    } catch (error) {
      console.error("Error initializing profile:", error);
      handleAuthError();
    }
  };

  const handleAuthError = async () => {
    await AsyncStorage.removeItem("userToken");
    setIsLoggedIn(false);
    router.replace("/sign-in");
  };

  const handleUpdateUsername = async () => {
    if (!newUsername.trim()) {
      Alert.alert("Ошибка", "Никнейм не может быть пустым");
      return;
    }

    try {
      await updateUsername(newUsername, setUser);
      setEditingUsername(false);
    } catch (err) {
      Alert.alert("Ошибка", `Не удалось изменить никнейм: ${err}`);
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0].uri) {
        await uploadAvatar(result.assets[0].uri, setUser);
      }
    } catch (err) {
      Alert.alert("Ошибка", `Не удалось обновить фото профиля: ${err}`);
    }
  };

  const createPost = async () => {
    try {
      if (!newPost.title.trim() && !newPost.content.trim()) {
        Alert.alert("Ошибка", "Добавьте заголовок или текст заметки");
        return;
      }
  
      const formData = new FormData();
      formData.append("text", `${newPost.title}\n\n${newPost.content}`);
      
      if (newPost.image) {
        formData.append("image", {
          uri: newPost.image,
          type: "image/jpeg",
          name: "post_image.jpg",
        });
      }
  
      const response = await makeAuthenticatedRequest(
        `${process.env.EXPO_PUBLIC_API_URL}/user/posts`,
        {
          method: "POST",
          headers: {
            "Content-Type": "multipart/form-data",
          },
          body: formData,
        }
      );
  
      const responseData = await response.json();
      const newPostData = {
        ...responseData.post,
        image: responseData.post.image_url ? getImageUrl(responseData.post.image_url) : null
      };
      
      setPosts((prevPosts) => [newPostData, ...prevPosts]);
      setNewPost({ title: "", content: "", image: null });
      setModalVisible(false);
    } catch (err) {
      Alert.alert("Ошибка", `Не удалось создать заметку: ${err}`);
    }
  };

  const renderPost = ({ item }) => {
    const postLines = item.text.split('\n');
    const title = postLines[0];
    const content = postLines.slice(2).join('\n');
  
    return (
      <View style={styles.postCard}>
        {title && <Text style={styles.postTitle}>{title}</Text>}
        {content && <Text style={styles.postContent}>{content}</Text>}
        {(item.image || item.image_url) && (
          <Image
            source={{ uri: getImageUrl(item.image || item.image_url) }}
            style={styles.postImage}
            resizeMode="cover"
          />
        )}
        <View style={styles.postFooter}>
          <Text style={styles.postDate}>
            {new Date(item.created_at).toLocaleDateString()}
          </Text>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.header, { height: headerHeight }]}>
        <LinearGradient
          colors={['#4F6EF7', '#2E3CAE']}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <TouchableOpacity 
            style={styles.settingsButton} 
            onPress={() => setSettingsVisible(true)}
          >
            <Feather name="settings" size={22} color="#FFF" />
          </TouchableOpacity>
          
          <Animated.View style={[styles.profileInfo, { opacity: textOpacity }]}>
            <TouchableOpacity 
              style={styles.avatarContainer} 
              onPress={pickImage}
            >
              <Animated.Image
                source={getImageUrl(user?.avatar) ? { uri: getImageUrl(user?.avatar) } : defaultImage}
                style={[
                  styles.avatar, 
                  { 
                    width: imageSize, 
                    height: imageSize,
                    borderRadius: 100 
                  }
                ]}
              />
              <View style={styles.editAvatarIcon}>
                <Feather name="camera" size={12} color="#FFF" />
              </View>
            </TouchableOpacity>
            
            {editingUsername ? (
              <View style={styles.editUsernameContainer}>
                <TextInput
                  value={newUsername}
                  onChangeText={setNewUsername}
                  style={styles.usernameInput}
                  placeholder="Новое имя"
                  placeholderTextColor="#FFFFFF80"
                />
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={handleUpdateUsername}
                >
                  <Text style={styles.saveButtonText}>Сохранить</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity 
                style={styles.usernameContainer}
                onPress={() => {
                  setNewUsername(user?.username);
                  setEditingUsername(true);
                }}
              >
                <Text style={styles.username}>{user?.username}</Text>
                <Feather name="edit-2" size={14} color="#FFF" style={styles.editIcon} />
              </TouchableOpacity>
            )}
          </Animated.View>
        </LinearGradient>
      </Animated.View>

      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.postsList}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setModalVisible(true)}
          >
            <Feather name="plus" size={20} color="#FFF" />
            <Text style={styles.addButtonText}>Новая запись</Text>
          </TouchableOpacity>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Feather name="file-text" size={60} color="#C8D1E1" />
            <Text style={styles.emptyText}>Нет записей</Text>
            <Text style={styles.emptySubtext}>
              Создайте свою первую запись
            </Text>
          </View>
        }
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      />
      
      <PostCreationModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        newPost={newPost}
        setNewPost={setNewPost}
        createPost={createPost}
      />
      
      <SettingsModal
        visible={settingsVisible}
        onClose={() => setSettingsVisible(false)}
      />
    </View>
  );
};

const styles = {
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F7FA",
  },
  header: {
    width: "100%",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    overflow: "hidden",
  },
  gradient: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 15,
    flexDirection: "column",
    justifyContent: "flex-end",
  },
  profileInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarContainer: {
    marginRight: 16,
  },
  avatar: {
    borderWidth: 3,
    borderColor: "#FFFFFF",
  },
  editAvatarIcon: {
    position: "absolute",
    right: -2,
    bottom: -2,
    backgroundColor: "#4F6EF7",
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  usernameContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  username: {
    fontSize: 22,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  editIcon: {
    marginLeft: 8,
  },
  editUsernameContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  usernameInput: {
    fontSize: 18,
    color: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#FFFFFF80",
    paddingVertical: 4,
    marginRight: 8,
    width: 150,
  },
  saveButton: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  saveButtonText: {
    color: "#4F6EF7",
    fontWeight: "600",
  },
  settingsButton: {
    position: "absolute",
    top: 10,
    right: 10,
    padding: 10,
  },
  postsList: {
    paddingTop: 210,
    paddingBottom: 20,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4F6EF7",
    margin: 16,
    padding: 14,
    borderRadius: 12,
    shadowColor: "#4F6EF7",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  addButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 16,
    marginLeft: 8,
  },
  postCard: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  postTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2E384D",
    marginBottom: 8,
  },
  postContent: {
    fontSize: 15,
    color: "#4A5568",
    lineHeight: 22,
    marginBottom: 12,
  },
  postImage: {
    width: "100%",
    height: 180,
    borderRadius: 10,
    marginVertical: 8,
  },
  postFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  postDate: {
    fontSize: 12,
    color: "#A0AEC0",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
    marginTop: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2E384D",
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#A0AEC0",
    marginTop: 8,
    textAlign: "center",
  },
};

export default Profile;