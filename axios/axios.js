import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const BASE_URL = "http://192.168.1.92:5000";
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 3000,
});

export const loginUser = async (email, password) => {
  try {
    const res = await api.post("/api/auth/login", {
      email,
      password,
    });
    return res.data;
  } catch (err) {
    return {
      error: true,
      message: err.response.data,
    };
  }
};
export const activeUser = async (token, password) => {
  try {
    const res = await api.post("/api/auth/activeUser", {
      token,
      password,
    });
    console.log(res.data);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};
