/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import socketio, { io } from "socket.io-client";
import { LocalStorage } from "../utils/LocalStorage";

const getSocket = () => {
  const token = LocalStorage.get("token"); // Retrieve jwt token from local storage or cookie

  // Create a socket connection with the provided URI and authentication
  return socketio(import.meta.env.VITE_SOCKET_URI, {
    withCredentials: true,
    auth: { token },
  });
};

// Create a context to hold the socket instance
const SocketContext = createContext<{
  socket: ReturnType<typeof socketio> | null;
  io: any | null
}>({
  socket: null,
  io
});

const useSocket = () => useContext(SocketContext);

// SocketProvider component to manage the socket instance and provide it through context
const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [socket, setSocket] = useState<ReturnType<typeof socketio> | null>(
    null
  );

  // Initialize io after socket is set
  const ioInstance = useMemo(() => socket ? socketio("localhost:8080") : null, [socket]);

  useEffect(() => {
    setSocket(getSocket());
  }, []);

  return (
    <SocketContext.Provider value={{ socket, io: ioInstance }}>
      {children}
    </SocketContext.Provider>
  );
};

export { SocketProvider, useSocket };
