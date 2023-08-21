import React, { useState, useEffect, useContext } from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Button,
  Modal,
  TextInput,
} from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import { AuthContext } from "../context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { activeUser } from "../axios/axios";

export default function Profile() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [qrData, setQrData] = useState(null);
  const [showScanner, setShowScanner] = useState(false);
  const context = useContext(AuthContext);
  const logout = context.logout;
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [userData, setUserData] = useState({
    userToken: "",
    email: "",
    userId: "",
    username: "",
    active: false,
  });
  const [inputValue, setInputValue] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const handleLogout = () => {
    logout();
  };
  const handleShowScanner = () => {
    setShowScanner(true);
  };
  const handleCancel = () => {
    setShowScanner(false);
  };
  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    setQrData(data);
  };

  const handleActive = async () => {
    try {
      //console.log("123123123");
      const active = await activeUser(userData.userToken, inputValue);
      if (active) {
        AsyncStorage.setItem("active", true);
        setUserData((prevUserData) => ({
          ...prevUserData,
          active: true,
        }));
        alert("Active user successfully");
      }
    } catch (error) {
      console.error(error);
    }
  };
  const handleLogin = async () => {
    try {
    } catch (error) {
      console.log(error);
    }
  };
  const handleShowPasswordInput = () => {
    setShowPasswordInput(true);
  };
  const handleClosePasswordInput = () => {
    setShowPasswordInput(false);
  };

  useEffect(() => {
    const getUserData = async () => {
      try {
        const userTokenValue = await AsyncStorage.getItem("userToken");
        const emailValue = await AsyncStorage.getItem("email");
        const userIdValue = await AsyncStorage.getItem("_id");
        const usernameValue = await AsyncStorage.getItem("username");
        const userActiveStatus = await AsyncStorage.getItem("active");

        setUserData({
          userToken: userTokenValue,
          email: emailValue,
          userId: userIdValue,
          username: usernameValue,
          active: userActiveStatus,
        });
      } catch (error) {
        console.log(error);
      }
    };
    getUserData();
  }, [userData]);

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  const renderAvatar = (username) => {
    const avatarText = username.charAt(0).toUpperCase();
    return (
      <View style={styles.avatarContainer}>
        <Text style={styles.avatarText}>{avatarText}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {qrData ? (
        <View style={styles.qrContainer}>
          <Image style={styles.qrImage} source={{ uri: qrData }} />
          <View style={styles.buttonContainer}>
            <Text style={styles.buttonText} onPress={handleLogin}>
              Login
            </Text>
          </View>
        </View>
      ) : (
        <>
          {showScanner ? (
            <>
              <BarCodeScanner
                onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                style={StyleSheet.absoluteFillObject}
              />
              <Button
                style={styles.buttonCancel}
                title={"Cancel"}
                onPress={handleCancel}
              />
            </>
          ) : (
            <>
              <TouchableOpacity
                onPress={handleShowScanner}
                style={styles.scanButton}
              >
                <Text style={styles.scanButtonText}>Scan QR Code</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.logoutButton}
                onPress={handleLogout}
              >
                <Text style={styles.logoutButtonText}>Logout</Text>
              </TouchableOpacity>
              <View style={styles.container}>
                <View style={styles.profileContainer}>
                  {renderAvatar(`${userData.username}`)}
                  <Text style={styles.username}>{userData.username}</Text>
                  <Text style={styles.email}>{userData.email}</Text>
                  <Text
                    style={[
                      styles.status,
                      userData.active ? styles.active : styles.inactive,
                    ]}
                  >
                    {userData.active ? "Active" : "Inactive"}
                  </Text>
                  {!userData.active && (
                    <>
                      <TouchableOpacity
                        style={styles.activateButton}
                        onPress={handleShowPasswordInput}
                      >
                        <Text style={styles.buttonText}>Activate Account</Text>
                      </TouchableOpacity>

                      <Modal
                        transparent={true}
                        visible={showPasswordInput}
                        animationType="fade"
                      >
                        <View style={styles.modalContainer}>
                          <View style={styles.modalContent}>
                            <View
                              style={{
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <TextInput
                                style={styles.input}
                                placeholder="Enter value"
                                value={inputValue}
                                onChangeText={(text) => setInputValue(text)}
                                secureTextEntry={!showPassword}
                              />
                              <TouchableOpacity
                                onPress={togglePasswordVisibility}
                              >
                                <Ionicons
                                  name={showPassword ? "eye-off" : "eye"}
                                  size={24}
                                  color="gray"
                                  style={{ marginHorizontal: 5 }}
                                />
                              </TouchableOpacity>
                            </View>
                            <TouchableOpacity
                              style={styles.saveButton}
                              onPress={handleActive}
                            >
                              <Text style={styles.buttonText}>Save</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                              style={styles.cancelButton}
                              onPress={handleClosePasswordInput}
                            >
                              <Text style={styles.buttonText}>Cancel</Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      </Modal>
                    </>
                  )}
                </View>
              </View>
            </>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  qrContainer: {
    flex: 1,
    alignItems: "center",
  },
  qrImage: {
    width: 200,
    height: 200,
    marginBottom: 16,
  },
  buttonContainer: {
    backgroundColor: "#2196F3",
    paddingHorizontal: 16,
    paddingVertical: 8,
    padding: 10,
    borderRadius: 5,
    width: 200, // Tăng chiều rộng
    height: 50, // Tăng chiều cao
  },
  buttonText: {
    color: "black",
    fontWeight: "bold",
  },
  buttonCancel: {
    position: "absolute",
    bottom: 20,
    left: 20,
    padding: 10,
    borderRadius: 5,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "lightgray",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  avatarText: {
    fontSize: 40,
    fontWeight: "bold",
  },
  username: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    marginBottom: 5,
  },
  status: {
    fontSize: 16,
    marginBottom: 10,
  },
  active: {
    color: "green",
  },
  inactive: {
    color: "red",
  },
  activateButton: {
    backgroundColor: "green",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  profileContainer: {
    alignItems: "center",
  },
  logoutButton: {
    position: "absolute",
    top: 10,
    right: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: "lightgray",
    borderRadius: 5,
  },
  logoutButtonText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  scanButton: {
    position: "absolute",
    top: 10,
    left: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: "lightgray",
    borderRadius: 5,
  },
  scanButtonText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  saveButton: {
    backgroundColor: "green",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  cancelButton: {
    backgroundColor: "red",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  input: {
    width: 200,
    height: 40,
    borderWidth: 1,
    borderColor: "gray",
    marginBottom: 10,
    paddingHorizontal: 10,
  },
});
