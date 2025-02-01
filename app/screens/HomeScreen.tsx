//  the Home screen is only accessible by the user that have already an account
// (cannot able to see this screen without token)

import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  Platform,
} from "react-native";
import { Camera, CameraType, CameraView } from "expo-camera";
import * as ImageManipulator from "expo-image-manipulator";
import TextRecognition from "react-native-text-recognition";
import * as ImagePicker from "expo-image-picker";
// import Tesseract from "tesseract.js";
import AlertModal from "../components/AlertModal";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/RootNavigator";

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, "Home">;

type Props = {
  navigation: HomeScreenNavigationProp;
};

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  // for the camera
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const cameraRef = useRef<Camera | null>(null);
  
  const [extractedText, setExtractedText] = useState<string>(""); // extract text state

  // for the custom alert modal
  const [modalVisible, setModalVisible] = useState(false); 
  const [modalTextProps, setModalTextProps] = useState({
    title: "",
    message: "",
  });
  

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
      if (status !== "granted") {
        setModalTextProps({
          title: "Permission Required",
          message: "Camera permission is required to use this feature.",
        });
        setModalVisible(true);
      }
    })();
  }, []);

  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      setCapturedImage(photo.uri);
      setIsCameraOpen(false);
      processImage(photo.uri);
    }
  };

  const processImage = async (imageUri: string) => {
    try {
      const resizedImage = await ImageManipulator.manipulateAsync(
        imageUri,
        [{ resize: { width: 800 } }],
        { base64: true }
      );
      const recognizedText = await TextRecognition.recognize(resizedImage.uri);
      setExtractedText(recognizedText.toString() || "No text found");
    } catch (error) {
      // you can display the error message that you got
      setModalTextProps({
        title: "Error",
        message: "Failed to process image. Try again.",
      });
      // setErrorMessage("Failed to process image. Try again.");
      setModalVisible(true);
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

  return (
    <View style={styles.container}>
      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      {isCameraOpen && hasPermission ? (
        <CameraView
          style={styles.camera}
          ref={(ref) => (cameraRef.current = ref)}
        >
          <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
            <Text style={styles.captureText}>📸</Text>
          </TouchableOpacity>
        </CameraView>
      ) : (
        <>
          <Text style={styles.title}>Extracted Text</Text>
          <Text style={styles.extractedText}>
            {extractedText || "No text yet"}
          </Text>

          {capturedImage && (
            <Image
              source={{ uri: capturedImage }}
              style={styles.imagePreview}
            />
          )}

          <TouchableOpacity
            style={styles.button}
            onPress={() => setIsCameraOpen(true)}
          >
            <Text style={styles.buttonText}>Open Camera</Text>
          </TouchableOpacity>
        </>
      )}

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
    marginBottom: 20,
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
