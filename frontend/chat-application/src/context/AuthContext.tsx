import { createContext, useContext, useState } from "react";
import { UserInterface } from "../interface/user";
import { requestHandler } from "../utils";
import { LocalStorage } from "../utils/LocalStorage";
import { loginUser, registerUser } from "../utils/axios";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";


const AuthContext = createContext<{
  user: UserInterface | null;
  token: string | null;
  login: (data: { username: string, password: string }) => Promise<void>;
  register: (data: { email: string, username: string, password: string }) => Promise<void>;
  logout: () => Promise<void>;
}>({
  user: null,
  token: null,
  login: async () => { },
  register: async () => { },
  logout: async () => { },
})

const useAuth = () => useContext(AuthContext)


const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [user, setUser] = useState<UserInterface | null>(null)
  const [token, setToken] = useState<string | null>(null)

  const navigate = useNavigate();

  const login = async (data: { username: string, password: string }) => {
    await requestHandler(
      async () => await loginUser(data),
      setIsLoading,
      (res) => {
        // TODO : toast for successful login
        const { data } = res;
        setUser(data.user);
        setToken(data.accessToken);
        LocalStorage.set("user", data.user);
        LocalStorage.set("token", data.accessToken);
        navigate("/chat");
      },
      alert
    )
  }

  const register = async (data: { username: string, email: string, password: string }) => {
    await requestHandler(
      async () => await registerUser(data),
      setIsLoading,
      () => {
        // TODO : toast for successful register
        navigate('/login')
      },
      alert
    )
  }

  const logout = async () => {

  }
  

  return (
    <AuthContext.Provider value={{ user, login, register, logout, token }}>
      {isLoading ? <Loader /> : children} {/* Display a loader while loading */}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider, useAuth };
