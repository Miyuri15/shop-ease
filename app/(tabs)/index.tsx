import {
  View,
  Text,
  TouchableHighlight,
  Image,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import axios from "axios";
// @ts-ignore
import { db } from "../config";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";

const DetectObject = () => {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        aspect: [4, 3],
        quality: 1,
      });
      if (!result.canceled && result.assets.length > 0) {
        setImage(result.assets[0].uri);
      }
    } catch (E) {
      console.error("Error picking image", E);
    }
  };

  const analyzeImage = async () => {
    try {
      if (!image) {
        alert("Please select an image");
        return;
      }

      setLoading(true);

      const apiKey = "AIzaSyBNRNAX0bU0XF_Yc7L4P4Ucsdb2WId1yp4";
      const url = `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`;

      // Convert the image to base64
      const base64 = await FileSystem.readAsStringAsync(image, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Request payload for OCR (text detection)
      const requestData = {
        requests: [
          {
            image: {
              content: base64,
            },
            features: [
              {
                type: "TEXT_DETECTION", // Detect text in the image
                maxResults: 1,
              },
            ],
          },
        ],
      };

      // Make the API call
      const response = await axios.post(url, requestData);

      // Extract the detected text from the response
      const detectedText = response.data.responses[0]?.fullTextAnnotation?.text;

      setLoading(false);

      if (detectedText) {
        alert(`Detected Text: ${detectedText}`);
        const newRef = db.ref("detected_text").push(); // Create a new reference with a unique key
        await newRef.set({
          text: detectedText,
          timestamp: Date.now(),
        });
      } else {
        alert("No text detected");
      }
    } catch (E) {
      console.error("Error analyzing image for text", E);
      alert("Error analyzing image for text");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>DetectObject</Text>
      {image && (
        <Image
          source={{ uri: image }}
          style={{ width: 200, height: 200, marginBottom: 20 }}
        />
      )}
      {loading ? (
        // Show loading indicator while waiting for response
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
        <>
          <TouchableHighlight onPress={pickImage} style={styles.button}>
            <Text style={styles.text}>Choose Image</Text>
          </TouchableHighlight>
          <TouchableHighlight onPress={analyzeImage} style={styles.button}>
            <Text style={styles.text}>Analyze Image</Text>
          </TouchableHighlight>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 100,
    marginBottom: 50,
  },
  text: {
    fontSize: 16,
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#dddddd",
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 20,
  },
  outputText: {
    fontSize: 16,
    marginBottom: 20,
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    margin: 64,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
