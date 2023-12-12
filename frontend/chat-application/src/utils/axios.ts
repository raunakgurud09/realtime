import axios from "axios";
import { LocalStorage } from "./LocalStorage";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URI,
  withCredentials: true,
  timeout: 120000,
});

apiClient.interceptors.request.use(
  function (config) {
    // Retrieve user token from local storage
    const token = LocalStorage.get("token");
    // Set authorization header with bearer token
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

export const loginUser = (data: { username: string; password: string }) => {
  console.log("hello");
  return apiClient.post("/users/login", data);
};

export const registerUser = (data: { username: string; password: string }) => {
  return apiClient.post("/users/register", data);
};

export const logoutUser = () => {
  return apiClient.post("/users/logout");
};

export const getUserChats = () => {
  return apiClient.get("/chat-app/chats/");
};

export const getChatMessage = (chatId: string) => {
  return apiClient.get(`/chat-app/messages/${chatId}`);
};

export const sendMessage = (chatId: string, message: string) => {
  console.log('working')
  return apiClient.post(`/chat-app/messages/${chatId}`, { content: message });
};

export const deleteOneOnOneChat = (chatId: string) => {
  return apiClient.delete(`/chat-app/chats/remove/${chatId}`);
};
