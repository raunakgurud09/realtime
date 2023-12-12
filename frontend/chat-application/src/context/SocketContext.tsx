import socketio from "socket.io-client";
import { LocalStorage } from "../utils/LocalStorage"
import { createContext, useContext, useEffect, useState } from "react";




export const getSocket = () => {
  const token = LocalStorage.get("token")

  return socketio(import.meta.env.VITE_SOCKET_SERVER, {
    withCredentials: true,
    auth: { token },
  })
}
// Create a context to hold the socket instance
const SocketContext = createContext<{
  socket: ReturnType<typeof socketio> | null
}>({
  socket: null,
});

// Custom hook to access the socket instance from the context
export const useSocket = () => useContext(SocketContext);


export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // State to store the socket instance
  const [socket, setSocket] = useState<ReturnType<typeof socketio> | null>(
    null
  );

  // Set up the socket connection when the component mounts
  useEffect(() => {
    setSocket(getSocket());
  }, []);

  return (
    // Provide the socket instance through context to its children
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};