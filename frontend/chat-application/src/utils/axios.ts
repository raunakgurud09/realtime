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

export const getChatMessages = (chatId: string) => {
  return apiClient.get(`/chat-app/messages/${chatId}`);
};

export const sendMessage = (
  chatId: string,
  content: string,
  attachedFiles: any
) => {
  const formData = new FormData();

  if (content) {
    formData.append("content", content);
  }
  console.log(attachedFiles);
  return apiClient.post(`/chat-app/messages/${chatId}`, formData);
};

export const deleteOneOnOneChat = (chatId: string) => {
  return apiClient.delete(`/chat-app/chats/remove/${chatId}`);
};

export const createUserChat = (receiverId: string) => {
  return apiClient.post(`/chat-app/chats/c/${receiverId}`);
};

export const createIncomingCall = (chatId: string) => {
  return apiClient.post(`/chat-app/chats/call/${chatId}`);
};

export const createGroupChat = (data: {
  name: string;
  participants: string[];
}) => {
  return apiClient.post(`/chat-app/chats/group`, data);
};

export const getAvailableUsers = () => {
  return apiClient.get("/chat-app/chats/users");
};
