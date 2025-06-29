import { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { Link, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FormField from "../../components/FormField";
import { useGlobalContext } from "../../context/GlobalProvider";
import { Ionicons } from '@expo/vector-icons';

const SignIn = () => {
  const router = useRouter();
  const { setIsLoggedIn, setUser, isLoggedIn } = useGlobalContext();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    general: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isLoggedIn) {
      router.replace("/home");
    }
  }, [isLoggedIn, router]);

  const validateForm = () => {
    const newErrors = {
      email: "",
      password: "",
      general: "",
    };

    if (!form.email.trim()) {
      newErrors.email = "Email обязателен";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      newErrors.email = "Введите корректный email адрес";
    }

    const psuRegex = /@.*psu\./i;
    if (!psuRegex.test(form.email)) {
      newErrors.email = "Необходимо использовать почту ПГУ";
    }

    if (!form.password.trim()) {
      newErrors.password = "Пароль обязателен";
    }

    setErrors(newErrors);
    return !newErrors.email && !newErrors.password;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    setErrors({ email: "", password: "", general: "" });

    try {
      const response = await fetch(`/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error === "Invalid credentials"
            ? "Неверный email или пароль"
            : data.error || "Произошла ошибка при авторизации"
        );
      }

      await AsyncStorage.setItem("userToken", data.token);
      setUser(data.user);
      setIsLoggedIn(true);
      // Alert.alert("Ок", "Вы вошли");
    } catch (error) {
      setErrors((prev) => ({ ...prev, general: error.message }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field) => (text) => {
    setForm((prev) => ({ ...prev, [field]: text }));
    setErrors((prev) => ({ ...prev, [field]: "", general: "" }));
  };

  return (
    <View style={styles.container}>
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          
          <View style={styles.content}>
            <Image
              source={require("../../assets/images/logo.png")}
              resizeMode="contain"
              style={styles.logo}
            />

            <Text style={styles.title}>Добро пожаловать</Text>
            <Text style={styles.subtitle}>Войдите в ваш аккаунт</Text>

            {errors.general ? (
              <View style={styles.errorContainer}>
                <Ionicons name="alert-circle" size={20} color="#EF4444" />
                <Text style={styles.errorText}>{errors.general}</Text>
              </View>
            ) : null}

            <View style={styles.formContainer}>
              <FormField
                title="Почта"
                value={form.email}
                placeholder="Введите ваш email"
                handleChangeText={handleInputChange("email")}
                error={errors.email}
                keyboardType="email-address"
              />

              <FormField
                title="Пароль"
                value={form.password}
                placeholder="Введите ваш пароль"
                handleChangeText={handleInputChange("password")}
                error={errors.password}
              />

              <TouchableOpacity
                style={[styles.signInButton, isSubmitting && styles.signInButtonDisabled]}
                onPress={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={styles.signInButtonText}>Войти</Text>
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.signUpLink}>
              <Text style={styles.signUpText}>Нет аккаунта?</Text>
              <Link href="/sign-up" style={styles.link}>
                Зарегистрироваться
              </Link>
            </View>
          </View>
        </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  logo: {
    width: "100%",
    height: 100,
    alignSelf: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    color: "#1F2937",
    fontWeight: "700",
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 17,
    color: "#6B7280",
    textAlign: 'center',
    marginBottom: 32,
  },
  formContainer: {
    marginBottom: 24,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: "#FEE2E2",
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  errorText: {
    color: "#EF4444",
    fontSize: 14,
    marginLeft: 8,
  },
  signInButton: {
    backgroundColor: "#2563EB",
    borderRadius: 12,
    marginTop: 14,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#2563EB",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  signInButtonDisabled: {
    backgroundColor: "#93C5FD",
  },
  signInButtonText: {
    color: "white",
    fontSize: 17,
    fontWeight: "600",
  },
  signUpLink: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  signUpText: {
    fontSize: 16,
    color: "#6B7280",
  },
  link: {
    fontSize: 16,
    color: "#2563EB",
    marginLeft: 5,
    fontWeight: "600",
  },
});

export default SignIn;