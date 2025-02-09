import { createContext, useState, useContext } from "react";
import axios from "axios";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// eslint-disable-next-line react/prop-types
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [isAuth, setIsAuth] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [errors, setErrors] = useState(null);

  const signup = async (data) => {
    const response = await axios.post(
      "http://localhost:3000/api/signup",
      data,
      {
        withCredentials: true,
      }
    );
    console.log(response.data);
    setUser(response.data);
  };

  const signin = async (data) => {
    const response = await axios.post(
      "http://localhost:3000/api/signin",
      data,
      {
        withCredentials: true,
      }
    );
    console.log(response.data);
    setUser(response.data);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuth,
        errors,
        signup,
        signin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
