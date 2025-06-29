import { useState } from "react";
import { WebView } from "react-native-webview";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import ErrorDisplay from '../components/ErrorDisplay';
import { Ionicons } from '@expo/vector-icons';

const NewsWebView = () => {
  const { url, title = "Просмотр" } = useLocalSearchParams();
  const [error, setError] = useState(null);
  const router = useRouter();

  const INJECTED_JAVASCRIPT = `
    (function() 
      function hideElements() {
        const header = document.getElementById('header');
        if (header) {
          header.style.display = 'none';
        }

        const footer = document.getElementById('footer');
        if (footer) {
          footer.style.display = 'none';
        }

        document.body.style.paddingTop = '0';
        document.body.style.marginTop = '0';
      }

      hideElements();

      document.addEventListener('DOMContentLoaded', hideElements);
    })();
  `;

  const handleError = (syntheticEvent) => {
    const { nativeEvent } = syntheticEvent;
    
    setError({
      message: nativeEvent.description || 'Ошибка загрузки страницы',
      name: 'WebViewError',
      code: nativeEvent.code,
      url: nativeEvent.url,
      status: nativeEvent.statusCode,
    });
  };

  if (!url) {
    return (
      <View style={styles.container}>
        <View style={styles.customHeader}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="close" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{title}</Text>
          <View style={styles.placeholder} />
        </View>
        <ErrorDisplay
          error={{ message: 'URL не найден' }}
          onRetry={() => {}}
        />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.customHeader}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="close" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{title}</Text>
          <View style={styles.placeholder} />
        </View>
        <ErrorDisplay
          error={error}
          onRetry={() => setError(null)}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.customHeader}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="close" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1} ellipsizeMode="tail">{title}</Text>
        <View style={styles.placeholder} />
      </View>
      <WebView
        source={{ 
          uri: url,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
          }
        }}
        style={styles.webview}
        onError={handleError}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        allowsBackForwardNavigationGestures={true}
        injectedJavaScript={INJECTED_JAVASCRIPT}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  webview: {
    flex: 1,
  },
  customHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
    marginHorizontal: 10,
  },
  backButton: {
    padding: 5,
  },
  placeholder: {
    width: 34,
  }
});

export default NewsWebView;