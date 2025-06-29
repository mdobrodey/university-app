import { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator
} from "react-native";
import { Link, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from '@expo/vector-icons';
import { useGlobalContext } from "../../context/GlobalProvider";
import FormField from "../../components/FormField";

const SignUp = () => {
  const router = useRouter();
  const { setIsLoggedIn, setUser, isLoggedIn } = useGlobalContext();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    username: "",
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
      username: "",
      email: "",
      password: "",
      general: "",
    };
    let isValid = true;

    if (!form.username.trim()) {
      newErrors.username = "Имя пользователя обязательно";
      isValid = false;
    } else if (form.username.length < 3 || form.username.length > 20) {
      newErrors.username = "Имя пользователя должно быть от 3 до 20 символов";
      isValid = false;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const psuRegex = /@.*psu.*/i;
    
    if (!form.email.trim()) {
      newErrors.email = "Email обязателен";
      isValid = false;
    } else if (!emailRegex.test(form.email)) {
      newErrors.email = "Введите корректный email адрес";
      isValid = false;
    } else if (!psuRegex.test(form.email)) {
      newErrors.email = "Необходимо использовать почту PSU";
      isValid = false;
    }

    if (!form.password.trim()) {
      newErrors.password = "Пароль обязателен";
      isValid = false;
    } else if (form.password.length < 6 || form.password.length > 20) {
      newErrors.password = "Пароль должен быть от 6 до 20 символов";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    setErrors({ username: "", email: "", password: "", general: "" });

    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: form.email.trim(),
          password: form.password.trim(),
          username: form.username.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        switch (data.error) {
          case "Email already exists":
            setErrors(prev => ({ ...prev, email: "Этот email уже используется" }));
            break;
          case "Username already exists":
            setErrors(prev => ({ ...prev, username: "Это имя пользователя уже занято" }));
            break;
          case "Email and username already exist":
            setErrors(prev => ({
              ...prev,
              email: "Этот email уже используется",
              username: "Это имя пользователя уже занято",
            }));
            break;
          default:
            throw new Error(data.error || "Произошла ошибка при регистрации");
        }
        return;
      }

      await AsyncStorage.setItem("userToken", data.token);
      setUser(data.user);
      setIsLoggedIn(true);
      // Alert.alert("Ок", "Вы зарегистрировались");
    } catch (error) {
      setErrors(prev => ({
        ...prev,
        general: error.message || "Произошла ошибка при регистрации"
      }));
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
              
              <Text style={styles.title}>Создать аккаунт</Text>
              <Text style={styles.subtitle}>Зарегистрируйтесь для входа</Text>

              {errors.general ? (
                <View style={styles.errorContainer}>
                  <Ionicons name="alert-circle" size={20} color="#EF4444" />
                  <Text style={styles.errorText}>{errors.general}</Text>
                </View>
              ) : null}

              <View style={styles.formContainer}>
                <FormField
                  title="Имя пользователя"
                  value={form.username}
                  placeholder="Введите ваш никнейм"
                  handleChangeText={handleInputChange("username")}
                  error={errors.username}
                  autoCapitalize="words"
                />

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
                  style={[styles.signUpButton, isSubmitting && styles.signUpButtonDisabled]}
                  onPress={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text style={styles.signUpButtonText}>Зарегистрироваться</Text>
                  )}
                </TouchableOpacity>
              </View>

              <View style={styles.signInLink}>
                <Text style={styles.signInText}>Уже есть аккаунт?</Text>
                <Link href="/sign-in" style={styles.link}>
                  Войти
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
  signUpButton: {
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
  signUpButtonDisabled: {
    backgroundColor: "#93C5FD",
  },
  signUpButtonText: {
    color: "white",
    fontSize: 17,
    fontWeight: "600",
  },
  signInLink: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  signInText: {
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

export default SignUp;