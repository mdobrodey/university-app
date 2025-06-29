import { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from 'react-native';
import { Feather } from "@expo/vector-icons";


const TELEGRAM_API_URL = `https://api.telegram.org/bot${process.env.EXPO_PUBLIC_TELEGRAM_BOT_TOKEN}/sendMessage`;

const ReportErrorModal = ({
  visible,
  onClose,
  reportText,
  setReportText,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const sendToTelegram = async () => {
    if (!reportText.trim()) {
      Alert.alert('Ошибка', 'Необходимо описать проблему');
      return;
    }

    setIsLoading(true);

    try {
      const message = `🚨 Новый репорт\n\n` +
        `📝 Report:\n${reportText}\n\n` +
        `⏰ Time: ${new Date().toLocaleString()}\n` +
        `Версия приложения 1.0.0`;

      const response = await fetch(TELEGRAM_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: process.env.EXPO_PUBLIC_TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: 'HTML',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send report');
      }

      setReportText('');
      Alert.alert(
        'Success',
        'Успешно отправлено!',
        [{ text: 'OK', onPress: onClose }]
      );

    } catch (error) {
      console.error('Ошибка:', error);
      Alert.alert(
        'Error',
        'Ошибка, попробуйте позже.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.handleBar} />
          <View style={styles.header}>
            <Feather name="alert-triangle" size={24} color="#FF3B30" style={styles.headerIcon} />
            <Text style={styles.headerText}>
              Сообщить о проблеме
            </Text>
          </View>

          <TextInput
            style={styles.textInput}
            multiline
            numberOfLines={4}
            value={reportText}
            onChangeText={setReportText}
            placeholder=" Опишите, что произошло, и как..."
            placeholderTextColor="#8E8E93"
            editable={!isLoading}
          />

          <TouchableOpacity
            style={[
              styles.sendButton,
              { backgroundColor: isLoading ? '#999' : '#007AFF' }
            ]}
            onPress={sendToTelegram}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFF" style={styles.buttonIcon} />
            ) : (
              <Feather name="send" size={18} color="#FFF" style={styles.buttonIcon} />
            )}
            <Text style={styles.sendButtonText}>
              {isLoading ? 'Отправка...' : 'Отправить'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={onClose}
            disabled={isLoading}
          >
            <Text style={[
              styles.cancelButtonText,
              { opacity: isLoading ? 0.5 : 1 }
            ]}>
              Отмена
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    elevation: 5,
  },
  handleBar: {
    width: 36,
    height: 5,
    backgroundColor: 'rgba(60, 60, 67, 0.3)',
    borderRadius: 2.5,
    alignSelf: 'center',
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  headerIcon: {
    marginRight: 8,
  },
  headerText: {
    fontSize: 19,
    fontWeight: '600',
    color: '#000',
  },
  textInput: {
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    minHeight: 120,
    textAlignVertical: 'top',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(60, 60, 67, 0.1)',
  },
  sendButton: {
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buttonIcon: {
    marginRight: 8,
  },
  sendButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    padding: 16,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#FF3B30',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default ReportErrorModal;