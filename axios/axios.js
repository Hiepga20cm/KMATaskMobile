import axios from "axios";

const BASE_URL = "http://192.168.0.164:5001";
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
    if (res) {
      return res.data;
    }
    return;
  } catch (err) {
    console.log("error catch", err);
    return {
      error: true,
      message: err.response,
    };
  }
};
export const activeUser = async (token, password) => {
  try {
    const res = await api.post("/api/auth/activeUser", {
      token,
      password,
    });
    return res.data;
  } catch (error) {
    console.log(error);
  }
};
