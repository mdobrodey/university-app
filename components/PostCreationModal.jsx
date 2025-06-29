import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from "expo-image-picker";

const PostCreationModal = ({
  visible,
  onClose,
  newPost,
  setNewPost,
  createPost,
}) => {
  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets[0].uri) {
        setNewPost({ ...newPost, image: result.assets[0].uri });
      }
    } catch (error) {
      console.error("Error picking image:", error);
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View
        style={styles.modalContainer}
      >
        <View style={styles.modalContent}>
          <LinearGradient
            colors={['#4F6EF7', 'rgb(60, 93, 241)']}
            style={styles.modalHeader}
          >
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Feather name="x" size={24} color="#FFF" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Новая заметка</Text>
            <TouchableOpacity
              onPress={createPost}
              style={styles.postButton}
            >
              <Text style={styles.postButtonText}>Создать</Text>
            </TouchableOpacity>
          </LinearGradient>

          <ScrollView style={styles.formContainer}>
            <TextInput
              style={styles.titleInput}
              value={newPost.title}
              onChangeText={(title) => setNewPost({ ...newPost, title })}
              placeholder="Заголовок"
              placeholderTextColor="#999"
            />
            
            <TextInput
              style={styles.contentInput}
              value={newPost.content}
              onChangeText={(content) => setNewPost({ ...newPost, content })}
              placeholder="Содержание заметки..."
              placeholderTextColor="#999"
              multiline
              textAlignVertical="top"
            />

            {newPost.image && (
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: newPost.image }}
                  style={styles.previewImage}
                />
                <TouchableOpacity 
                  style={styles.removeImageButton}
                  onPress={() => setNewPost({ ...newPost, image: null })}
                >
                  <Feather name="x-circle" size={24} color="#FF3B30" />
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>

          <View style={styles.bottomBar}>
            <TouchableOpacity style={styles.addImageButton} onPress={pickImage}>
              <Feather name="image" size={24} color="#007AFF" />
              <Text style={styles.addImageText}>Добавить фото</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = {
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    flex: 1,
    backgroundColor: '#FFF',
    marginTop: 40,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4F6EF7',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  closeButton: {
    padding: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFF',
  },
  postButton: {
    backgroundColor: '#FFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  postButtonText: {
    color: '#4F6EF7',
    fontWeight: '600',
  },
  formContainer: {
    flex: 1,
    padding: 16,
  },
  titleInput: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
  },
  contentInput: {
    fontSize: 16,
    minHeight: 200,
    padding: 12,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    marginBottom: 16,
  },
  imageContainer: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
  removeImageButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 20,
    padding: 4,
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
    backgroundColor: '#FFF',
  },
  addImageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    padding: 8,
    borderRadius: 20,
  },
  addImageText: {
    marginLeft: 8,
    color: '#007AFF',
    fontWeight: '500',
  },
};

export default PostCreationModal;