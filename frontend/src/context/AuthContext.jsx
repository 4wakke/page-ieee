import { createContext, useState, useContext, useEffect } from "react";
import Cookie from "js-cookie";
import axios from "../api/axios";

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
  const [isAuth, setIsAuth] = useState(false);
  const [errors, setErrors] = useState(null);
  const [loading, setLoading] = useState(false); //! LOADING

  // const clearErrors = () => {
  //   setErrors(null);
  // }; //! LIMPIAR ERROR

  const signup = async (data) => {
    try {
      const response = await axios.post("/signup", data);
      setUser(response.data);
      setIsAuth(true);
      return response.data;
    } catch (error) {
      console.log(error);
      if (Array.isArray(error.response.data)) {
        return setErrors(error.response.data);
      }
      setErrors([error.response.data.message]);
    }
  };

  const signin = async (data) => {
    try {
      const response = await axios.post("/signin", data);
      setUser(response.data);
      setIsAuth(true);
      // clearErrors(); //! LIMPIAR ERRORES

      return response.data;
    } catch (error) {
      console.log(error);
      if (Array.isArray(error.response.data)) {
        return setErrors(error.response.data);
      }

      setErrors([error.response.data.message]);
    }
  };

  const signout = async () => {
    await axios.post("/signout");
    setUser(null);
    setIsAuth(false);
  };

  useEffect(() => {
    setLoading(true); //! LOADING
    if (Cookie.get("token")) {
      axios
        .get("/profile")
        .then((res) => {
          setUser(res.data);
          setIsAuth(true);
        })
        .catch((err) => {
          console.log(err); //?
          setUser(null);
          setIsAuth(false);
        });
    }
    setLoading(false); //! LOADING
  }, []);

  useEffect(() => {
    //! LIMPIAR ERRORES CON MÓDULO
    const clean = setTimeout(() => {
      setErrors(null);
    }, 5000);

    return () => clearTimeout(clean);
  }, [errors]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuth,
        errors,
        signup,
        signin,
        signout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
