import { View, Text, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import { useState } from "react";

const FormField = ({
  title,
  value,
  placeholder,
  handleChangeText,
  otherStyles,
  error,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={[styles.container, otherStyles]}>
      <Text style={styles.title}>{title}</Text>

      <View
        style={[
          styles.inputContainer,
          isFocused && styles.focusedInput,
          error && styles.errorInput,
        ]}
      >
        <TextInput
          style={styles.input}
          value={value}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          onChangeText={handleChangeText}
          secureTextEntry={title === "Password" && !showPassword}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />

        {title === "Password" && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          </TouchableOpacity>
        )}
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  title: {
    fontSize: 16,
    color: "#4B5563",
    fontWeight: "500",
    marginBottom: 8,
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    width: "100%",
    height: 50,
    paddingHorizontal: 16,
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  focusedInput: {
    borderColor: "#60A5FA",
    borderWidth: 2,
  },
  errorInput: {
    borderColor: "red",
    borderWidth: 2,
  },
  input: {
    flex: 1,
    color: "#1F2937",
    fontWeight: "400",
    fontSize: 16,
  },
  icon: {
    width: 24,
    height: 24,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 4,
  },
});

export default FormField;
