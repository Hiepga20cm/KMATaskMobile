import React, { useState, useEffect, useContext } from "react";
import {
  Text,
  View,
  StyleSheet,
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
import {
  connectWithSocketServerAuth,
  loginWithQrCode,
} from "../socket/socketConnection";

import CheckBox from "react-native-check-box";
//import { store } from "../store";
export default function Profile() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [qrData, setQrData] = useState(null);
  const [showScanner, setShowScanner] = useState(false);
  const context = useContext(AuthContext);
  const logout = context.logout;
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [userData, setUserData] = useState({
    _id: "",
    email: "",
    token: "",
    username: "",
    active: "false",
    privateKey: "",
  });

  const [inputValue, setInputValue] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [checked, setChecked] = useState(false);

  const handleCheckboxChange = () => {
    setChecked(!checked);
  };
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
    setScanned(false);
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
    const obj = JSON.parse(data);
    console.log("qrdata :",obj);
    setQrData(obj);
  };
  // useEffect(()=>{
  //   const statusLoginQr = store.getState().LoginQr.status
  //   if (statusLoginQr === true) {
  //     console.log(statusLoginQr);
  //   } else {
  //     console.log(statusLoginQr);
  //   }
  // },[store.getState().LoginQr.status])
  const handleActive = async () => {
    try {
     
      const active = await activeUser(userData.token, inputValue);
      console.log("active", active);
      if (active) {
        AsyncStorage.setItem("active", "true");
        AsyncStorage.setItem("privateKey", String(active.privateKey));
        AsyncStorage.setItem("userToken", active.token);
        setUserData((prevUserData) => ({
          ...prevUserData,
          active: "true",
          token: active.token,
          privateKey: active.privateKey,
        }));
        alert("Active user successfully");
      }
    } catch (error) {
      console.error(error);
    }
  };
  const handleLogin = async () => {
    try {
      if (userData) {
        if (userData.active === "true") {
          userData.active = true;
          
          console.log("userData : ", userData);
          loginWithQrCode(qrData?.socketId,  userData, qrData?.key );
          setQrData(null)
          setShowScanner(false)
          setChecked(false)
        } else {
          console.log("You have to active your account");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleShowPasswordInput = () => {
    console.log("show passInput :", userData);
    setShowPasswordInput(true);
  };
  const handleClosePasswordInput = () => {
    setShowPasswordInput(false);
  };
  const handleGoBack = () => {
    setScanned(false);
    setQrData(null);
  };
  useEffect(() => {
    const getUserData = async () => {
      try {
        const userTokenValue = await AsyncStorage.getItem("userToken");
        const emailValue = await AsyncStorage.getItem("email");
        const userIdValue = await AsyncStorage.getItem("_id");
        const usernameValue = await AsyncStorage.getItem("username");
        const userActiveStatus = await AsyncStorage.getItem("active");
        const privateKey = await AsyncStorage.getItem("privateKey");
        setUserData({
          token: userTokenValue,
          email: emailValue,
          _id: userIdValue,
          username: usernameValue,
          active: userActiveStatus,
          privateKey: privateKey || "",
        });
      } catch (error) {
        console.log(error);
      }
    };
    if (context.userToken != null && context.userId != null) {
      getUserData();
      connectWithSocketServerAuth();
    }
  }, [showScanner]);

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
        <>
          <View style={styles.qrContainer}>
            <Text style={styles.header}>
              Đăng nhập bằng mã QR trên thiết bị lạ
            </Text>
            <Text style={styles.description}>
              Tài khoản có thể bị chiếm đoạn nếu đây không phải thiết bị của
              bạn. Bấm từ chối nếu ai đó yêu cầu bạn đăng nhập mã QR để bình
              chọn, trúng thưởng hoặc nhận khuyến mãi,...
            </Text>
            <View style={styles.info}>
              <Text style={styles.textInfo}>
                Trình duyệt: {qrData?.browser}
              </Text>
              <Text style={styles.textInfo}>Thời gian: {qrData?.time} </Text>
              <Text style={styles.textInfo}>
                Địa điểm: {qrData?.location?.city}/{qrData?.location?.country}
              </Text>
            </View>
          </View>
          <View style={styles.checkbox}>
            <CheckBox
              style={{ padding: 10 }}
              onClick={() => {
                handleCheckboxChange();
              }}
              isChecked={checked}
              rightText={
                "Tôi đã kiểm tra kỹ thông tin và xác nhận đó là thiết bị của tôi"
              }
            />
            <View style={styles.confirm}>
              <Text
                style={[
                  checked
                    ? styles.buttonLoginActive
                    : styles.buttonLoginInactive,
                ]}
                onPress={checked ? handleLogin : null}
              >
                Đăng nhập
              </Text>
              <Text style={styles.buttonRefuse} onPress={handleGoBack}>
                Từ chối
              </Text>
            </View>
          </View>
        </>
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
                      userData.active === "true"
                        ? styles.active
                        : styles.inactive,
                    ]}
                  >
                    {userData.active === "true" ? "Active" : "Inactive"}
                  </Text>
                  {userData.active !== "true" && (
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
  header: {
    marginTop: "20%",
    textAlign: "center",
    fontSize: "30px",
    fontWeight: "bold",
  },
  confirm: {
    textAlign: "center",
    justifyContent: "center",
    width: "100%",
    alignItems: "center",
  },
  buttonRefuse: {
    width: "90%",
    borderRadius: 25,
    textAlign: "center",
    justifyContent: "center",
    padding: 10,
    borderWidth: 2,
    fontWeight: "bold",
    borderColor: "black",
    fontSize: "20px",
  },
  buttonLoginActive: {
    width: "90%",
    borderRadius: 25,
    textAlign: "center",
    justifyContent: "center",
    padding: 10,
    borderWidth: 2,
    borderColor: "black",
    fontWeight: "bold",
    margin: 2,
    fontSize: "20px",
  },
  buttonLoginInactive: {
    width: "90%",
    borderRadius: 25,
    textAlign: "center",
    justifyContent: "center",
    padding: 10,
    borderWidth: 2,
    borderColor: "black",
    fontWeight: "300",
    margin: 2,
    fontSize: "20px",
  },
  checkbox: {
    width: "100%",
    height: "20%",
    marginBottom: "5%",
  },
  info: {
    marginTop: "10%",
  },
  textInfo: {
    fontSize: "20px",
    padding: 5,
    fontWeight: "400",
  },
  description: {
    textAlign: "center",
    marginTop: "5%",
    backgroundColor: "lightgray",
    padding: 20,
    marginHorizontal: 10,
    borderRadius: 10,
  },
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
    borderRadius: 50,
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
  backButton: {
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
  backButtonText: {
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
