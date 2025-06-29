import AsyncStorage from "@react-native-async-storage/async-storage";

export const getImageUrl = (url) => {
  if (!url || typeof url !== 'string') return null;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `${process.env.EXPO_PUBLIC_API_URL}${url}`;
};

export const makeAuthenticatedRequest = async (url, options = {}) => {
  const token = await AsyncStorage.getItem("userToken");
  if (!token) {
    throw new Error("No authentication token");
  }
  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  });
  if (response.status === 401) {
    throw new Error("Authentication failed");
  }
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response;
};

export const fetchUserData = async (token, setUser) => {
  try {
    const response = await makeAuthenticatedRequest(
      `${process.env.EXPO_PUBLIC_API_URL}/user/current-user`
    );
    const data = await response.json();
    data.avatar = getImageUrl(data.avatar);
    setUser(data);
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};

export const fetchPosts = async (token, setPosts) => {
  try {
    const response = await makeAuthenticatedRequest(
      `${process.env.EXPO_PUBLIC_API_URL}/user/posts`
    );
    const data = await response.json();
    const updatedPosts = data.map((post) => ({
      ...post,
      image_url: post.image_url ? `${process.env.EXPO_PUBLIC_API_URL}${post.image_url}` : null
    }));
    setPosts(updatedPosts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw error;
  }
};

export const uploadAvatar = async (uri, setUser) => {
  try {
    const formData = new FormData();
    formData.append("avatar", {
      uri,
      type: "image/jpeg",
      name: "avatar.jpg",
    });
    const response = await makeAuthenticatedRequest(
      `${process.env.EXPO_PUBLIC_API_URL}/user/update-avatar`,
      {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      }
    );
    const data = await response.json();
    setUser((prevUser) => ({
      ...prevUser,
      avatar: getImageUrl(data.avatarUrl),
    }));
  } catch (error) {
    console.error("Error uploading avatar:", error);
    throw error;
  }
};

export const updateUsername = async (newUsername, setUser) => {
  try {
    const response = await makeAuthenticatedRequest(
      `${process.env.EXPO_PUBLIC_API_URL}/user/update-username`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: newUsername }),
      }
    );
    const data = await response.json();
    setUser((prevUser) => ({ ...prevUser, username: data.username }));
  } catch (error) {
    console.error("Error updating username:", error);
    throw error;
  }
};