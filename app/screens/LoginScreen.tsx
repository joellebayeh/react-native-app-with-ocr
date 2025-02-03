// this login screen is accessible by all visitors (without authorization), while entering with correct
// acess_token, that mean the user is logged in so he should redirect to the home screen

import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { Formik } from "formik";
import * as Yup from "yup";
import Icon from "react-native-vector-icons/Feather";
import AlertModal from "../components/AlertModal";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/RootNavigator";

type LoginScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Login"
>;

type Props = {
  navigation: LoginScreenNavigationProp;
};

// Setup validation schema using Yup
const LoginSchema = Yup.object().shape({
  username: Yup.string().required("Username is required"),
  password: Yup.string().required("Password is required"),
});

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [secureText, setSecureText] = useState(true); // password value visibility
  const [modalVisible, setModalVisible] = useState(false); // For the custom alert modal

  return (
    <Formik
      initialValues={{ username: "", password: "" }}
      validationSchema={LoginSchema}
      onSubmit={(values, { setSubmitting }) => {
        // here we should call an post api that take thoose creadentials, if this user already existing return
        // the access_token and refresh_token than redirect him to the Home screen, else user should get an
        // error message that can be displayed with this AlertModal component
        if (
          values.username.trim() === "User" &&
          values.password.trim() === "Password"
        ) {
          navigation.navigate("Home");
        } else {
          setModalVisible(true); // Show custom alert if credentials are incorrect
          setSubmitting(false);
        }
      }}
    >
      {({ handleChange, handleSubmit, values, errors, touched }) => (
        <View style={styles.container}>
          <Text style={styles.title}>Welcome Back</Text>

          {/* Username Input */}
          <TextInput
            style={styles.input}
            placeholder="Username"
            placeholderTextColor="#A1A1A1"
            onChangeText={handleChange("username")}
            value={values.username}
            autoCapitalize="none"
          />
          {touched.username && errors.username && (
            <Text style={styles.errorText}>{errors.username}</Text>
          )}

          {/* Password Input */}
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Password"
              placeholderTextColor="#A1A1A1"
              onChangeText={handleChange("password")}
              value={values.password}
              secureTextEntry={secureText}
            />
            <TouchableOpacity
              onPress={() => setSecureText(!secureText)}
              style={styles.icon}
            >
              <Icon
                name={secureText ? "eye" : "eye-off"}
                size={20}
                color="#A1A1A1"
              />
            </TouchableOpacity>
          </View>
          {touched.password && errors.password && (
            <Text style={styles.errorText}>{errors.password}</Text>
          )}

          {/* Login Button */}
          <TouchableOpacity
            style={[
              styles.loginButton,
              (!values.username || !values.password) && styles.disabledButton,
            ]}
            onPress={() => handleSubmit()}
            disabled={!values.username || !values.password}
          >
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>

          {/* this hint just for testing purposes */}
          <Text style={styles.hint}>
            Hint: Username is 'User', Password is 'Password'.
          </Text>

          {/* Alert Modal Component */}
          <AlertModal
            visible={modalVisible}
            title="Invalid Credentials"
            message="The username or password is incorrect. Please try again."
            onClose={() => setModalVisible(false)}
          />
        </View>
      )}
    </Formik>
  );
};

// you can implement the style with the static way with the style property such as: <Text style={{_your-style_}} ...>
// or we can put all this styles on one separate file
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 28,
    color: "#E0E0E0",
    marginBottom: 20,
    fontWeight: "bold",
  },
  input: {
    width: "80%",
    padding: 12,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#333333",
    borderRadius: 8,
    backgroundColor: "#1E1E1E",
    color: "#FFFFFF",
  },
  passwordContainer: {
    width: "80%",
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#333333",
    borderRadius: 8,
    backgroundColor: "#1E1E1E",
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  passwordInput: {
    flex: 1,
    padding: 12,
    color: "#FFFFFF",
  },
  icon: {
    padding: 10,
  },
  loginButton: {
    width: "80%",
    backgroundColor: "#3D5AFE",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  disabledButton: {
    backgroundColor: "#666666", // Gray color when disabled
  },
  loginButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  hint: {
    marginTop: 10,
    fontSize: 14,
    color: "#A1A1A1",
    fontStyle: "italic",
  },
  errorText: {
    color: "red",
    fontSize: 10,
  },
});

export default LoginScreen;
