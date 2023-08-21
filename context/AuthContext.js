import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useState, useContext } from "react";
import { useEffect } from "react";
import { loginUser } from "../axios/axios";
import jwtDecode from "jwt-decode";
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [userToken, setUserToken] = useState("");
  const [userInfo, setUserInfo] = useState(null);
  const [userId, setUserId] = useState("");

  const login = async (email, password) => {
    try {
      setIsLoading(true);
      setIsLoading(false);
      const response = await loginUser(email, password);
      if (response) {
        const user = response.userDetails;
        setUserToken(user.token);
        setUserId(user._id);
        await AsyncStorage.setItem("userToken", user.token);
        await AsyncStorage.setItem("email", user.email);
        await AsyncStorage.setItem("_id", user._id);
        await AsyncStorage.setItem("username", user.username);
        await AsyncStorage.setItem("active", user.active);
        console.log("done asygnstorate");
        setUserInfo(JSON.stringify(response));
        setIsLoading(false);
        alert("Login successful");
      } else {
        alert("Invalid username or password");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const checkTokenExpiration = async () => {
    try {
      setIsLoading(true);
      const userToken = await AsyncStorage.getItem("userToken");
      // Thực hiện kiểm tra token tại đây
      const decodedToken = jwtDecode(userToken);
      console.log(decodedToken);

      // if (tokenExpired) { // Thay tokenExpired bằng điều kiện kiểm tra token hết hạn
      //   setUserToken("");
      //   AsyncStorage.removeItem("userToken");
      // }
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };
  const logout = () => {
    setIsLoading(true);
    setUserToken(null);
    AsyncStorage.removeItem("userToken");
    setIsLoading(false);
  };

  const isLoggedIn = async () => {
    try {
      setIsLoading(true);
      let userToken = await AsyncStorage.getItem("userToken");
      console.log(userToken);
      setUserToken(userToken);
      setIsLoading(false);
    } catch (error) {
      console.log(`error ${error}`);
    }
  };

  useEffect(() => {
    isLoggedIn();
    //checkTokenExpiration();
  }, []);

  return (
    <AuthContext.Provider
      value={{ login, logout, isLoading, userToken, userId }}
    >
      {children}
    </AuthContext.Provider>
  );
};
