import axios from "axios";
import { API_URL } from "../config/endpoints";
import { store } from "../store";
import { logout } from "../slices/authSlice";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Send the session token with every request.
api.interceptors.request.use((config) => {
  const token = store.getState().auth.user?.token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// An expired or invalid token ends the session.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && store.getState().auth.user) {
      store.dispatch(logout());
    }
    return Promise.reject(error);
  }
);

export default api;
