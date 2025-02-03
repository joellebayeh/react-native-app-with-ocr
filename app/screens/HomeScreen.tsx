//  the Home screen is only accessible by the user that have already an account
// (cannot able to see this screen without token)

import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import * as ImagePicker from "expo-image-picker";
import AlertModal from "../components/AlertModal";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/RootNavigator";
import Tesseract from "tesseract.js";

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, "Home">;

type Props = {
  navigation: HomeScreenNavigationProp;
};

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const [image, setImage] = useState(null); // image that user choose/take
  const [text, setText] = useState(""); // extracted text

  // for the custom alert modal
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTextProps, setModalTextProps] = useState({
    title: "",
    message: "",
  });

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const openCamera = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const recognizeText = async () => {
    if (image) {
      try {
        const { data } = await Tesseract.recognize(image, "eng");
        setText(data.text);
      } catch (error) {
        // you can display the error message that you got
        setModalTextProps({
          title: "Error",
          message: "Failed to process image. Try again.",
        });
        // setErrorMessage("Failed to process image. Try again.");
        setModalVisible(true);
      }
    }
  };

  const handleLogout = async () => {
    try {
      // we should remove/destroy the access & refresh token here and navigate to the Login screen
      navigation.replace("Login");
    } catch (error) {
      // you can display the error message that you got
      setModalTextProps({
        title: "Error",
        message: "Failed to log out. Please try again.",
      });
      setModalVisible(true);
    }
  };

  useEffect(() => {
    recognizeText();
  }, [image]);

  return (
    <View style={styles.container}>
      {/* Logout button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      {/* Title */}
      <Text style={styles.title}>Extracted Text</Text>

      {/* Pick Image from your device */}
      <TouchableOpacity style={styles.button} onPress={pickImage}>
        <Text style={styles.buttonText}>Pick Image</Text>
      </TouchableOpacity>

      {/* Open your camera to take an image */}
      <TouchableOpacity style={styles.button} onPress={openCamera}>
        <Text style={styles.buttonText}>Open Camera</Text>
      </TouchableOpacity>

      {/* Display the Image that you take/choose */}
      {image && <Image source={{ uri: image }} style={styles.imagePreview} />}

      {/* the Extract text */}
      <Text style={styles.extractedText}>{text || "No text yet"}</Text>

      {/* Alert Modal Component*/}
      <AlertModal
        visible={modalVisible}
        title={modalTextProps.title}
        message={modalTextProps.message}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    color: "#E0E0E0",
    fontWeight: "bold",
    marginBottom: 20,
  },
  extractedText: {
    fontSize: 18,
    color: "#FFFFFF",
    marginVertical: 20,
  },
  button: {
    backgroundColor: "#3D5AFE",
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
    alignItems: "center",
    width: "80%",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  camera: {
    flex: 1,
    width: "100%",
  },
  captureButton: {
    position: "absolute",
    bottom: 30,
    alignSelf: "center",
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderRadius: 50,
  },
  captureText: {
    fontSize: 24,
  },
  imagePreview: {
    width: 250,
    height: 250,
    borderRadius: 10,
    marginTop: 10,
  },
  logoutButton: {
    position: "absolute",
    top: 40,
    right: 20,
    backgroundColor: "red",
    padding: 10,
    borderRadius: 8,
  },
  logoutText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default HomeScreen;
