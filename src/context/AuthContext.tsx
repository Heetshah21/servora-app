import {
    createContext,
    useContext,
    useEffect,
    useState,
  } from "react";
  
  import AsyncStorage from "@react-native-async-storage/async-storage";
  
  const AuthContext = createContext<any>(null);
  
  export function AuthProvider({ children }: any) {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      loadUser();
    }, []);
  
    async function loadUser() {
      try {
        const stored = await AsyncStorage.getItem("user");
  
        if (stored) {
          setUser(JSON.parse(stored));
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }
  
    async function login(userData: any) {
      setUser(userData);
  
      await AsyncStorage.setItem(
        "user",
        JSON.stringify(userData)
      );
    }
  
    async function logout() {
      setUser(null);
  
      await AsyncStorage.removeItem("user");
    }
  
    return (
      <AuthContext.Provider
        value={{
          user,
          loading,
          login,
          logout,
        }}
      >
        {children}
      </AuthContext.Provider>
    );
  }
  
  export function useAuth() {
    return useContext(AuthContext);
  }