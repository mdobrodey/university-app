import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from "@expo/vector-icons";

const ErrorDisplay = ({ error, onRetry, onOpenBrowser }) => {
  const renderErrorDetail = (label, value) => {
    if (!value) return null;
    
    return (
      <View style={styles.errorDetailContainer}>
        <Text style={styles.errorLabel}>{label}:</Text>
        <Text style={styles.errorValue}>
          {typeof value === 'object' ? JSON.stringify(value, null, 2) : value.toString()}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Feather name="alert-triangle" size={48} color="#FF3B30" />
      <Text style={styles.errorTitle}>Ошибка загрузки страницы</Text>
      
      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent}>
        {renderErrorDetail("Сообщение", error.message)}
        {renderErrorDetail("Тип ошибки", error.name)}
        {renderErrorDetail("Код ошибки", error.code)}
        {renderErrorDetail("Статус", error.status)}
        {renderErrorDetail("Описание статуса", error.statusText)}
        {renderErrorDetail("URL", error.config?.url)}
        {renderErrorDetail("Метод", error.config?.method)}
        {renderErrorDetail("Заголовки запроса", error.config?.headers)}
        {renderErrorDetail("Данные ответа", error.responseData)}
        {error.stack && (
          <View style={styles.stackTraceContainer}>
            <Text style={styles.stackTraceTitle}>Stack Trace:</Text>
            <Text style={styles.stackTraceText}>{error.stack}</Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, styles.retryButton]} 
          onPress={onRetry}
        >
          <Feather name="refresh-cw" size={20} color="#FFF" />
          <Text style={styles.buttonText}>Повторить</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.browserButton]}
          onPress={onOpenBrowser}
        >
          <Feather name="external-link" size={20} color="#FFF" />
          <Text style={styles.buttonText}>Открыть в браузере</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    padding: 20,
  },
  errorTitle: {
    fontSize: 20,
    fontFamily: 'Gilroy-ExtraBold',
    color: '#000',
    marginTop: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  scrollContainer: {
    flex: 1,
    width: '100%',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    marginBottom: 20,
  },
  scrollContent: {
    padding: 16,
  },
  errorDetailContainer: {
    marginBottom: 16,
  },
  errorLabel: {
    fontSize: 14,
    fontFamily: 'Montserrat-Bold',
    color: '#666',
    marginBottom: 4,
  },
  errorValue: {
    fontSize: 14,
    fontFamily: 'Montserrat-Regular',
    color: '#333',
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e1e4e8',
  },
  stackTraceContainer: {
    marginTop: 16,
  },
  stackTraceTitle: {
    fontSize: 14,
    fontFamily: 'Montserrat-Bold',
    color: '#666',
    marginBottom: 8,
  },
  stackTraceText: {
    fontSize: 12,
    fontFamily: 'Montserrat-Regular',
    color: '#666',
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e1e4e8',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 12,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    gap: 8,
  },
  retryButton: {
    backgroundColor: '#007AFF',
  },
  browserButton: {
    backgroundColor: '#5856D6',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'Montserrat-Bold',
  },
});

export default ErrorDisplay;