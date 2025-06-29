import { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";

const GlobalContext = createContext();
export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState(null);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      const savedToken = await AsyncStorage.getItem("userToken");
      if (savedToken) {
        setToken(savedToken);
        await getCurrentUser(savedToken);
      }
    } catch (error) {
      console.error("Error initializing auth:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentUser = async (currentToken = token) => {
    if (!currentToken) {
      await handleLogout();
      return;
    }

    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/user/current-user`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${currentToken}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        setIsLoggedIn(true);
        return userData;
      } else if (response.status === 401) {
        await handleLogout();
      } else {
        throw new Error(`Server responded with status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error fetching current user:", error);
      Alert.alert(
        "Ошибка",
        "Не удалось получить данные пользователя. Пожалуйста, попробуйте позже."
      );
    }
    return null;
  };

  const handleLogin = async (newToken, userData) => {
    try {
      await AsyncStorage.setItem("userToken", newToken);
      setToken(newToken);
      setUser(userData);
      setIsLoggedIn(true);
    } catch (error) {
      console.error("Error handling login:", error);
      Alert.alert(
        "Ошибка",
        "Не удалось сохранить данные входа. Пожалуйста, попробуйте снова."
      );
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("userToken");
      setToken(null);
      setUser(null);
      setIsLoggedIn(false);
    } catch (error) {
      console.error("Error handling logout:", error);
      Alert.alert(
        "Ошибка",
        "Не удалось выполнить выход. Пожалуйста, попробуйте снова."
      );
    }
  };

  const updateUserData = async (updatedData) => {
    try {
      setUser((prevUser) => ({
        ...prevUser,
        ...updatedData,
      }));
    } catch (error) {
      console.error("Error updating user data:", error);
      Alert.alert(
        "Ошибка",
        "Не удалось обновить данные пользователя. Пожалуйста, попробуйте позже."
      );
    }
  };

  const makeAuthenticatedRequest = async (url, options = {}) => {
    if (!token) {
      throw new Error("No authentication token");
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 401) {
        await handleLogout();
        throw new Error("Authentication failed");
      }

      return response;
    } catch (error) {
      console.error("Error making authenticated request:", error);
      throw error;
    }
  };

  const contextValue = {
    isLoggedIn,
    setIsLoggedIn,
    user,
    setUser,
    isLoading,
    getCurrentUser,
    handleLogin,
    handleLogout,
    updateUserData,
    makeAuthenticatedRequest,
  };

  return (
    <GlobalContext.Provider value={contextValue}>
      {!isLoading && children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
