import { createContext, useState, useContext, useEffect } from "react";
import Cookie from "js-cookie";
import axios from "../api/axios";
const backRoute = import.meta.env.VITE_APP_BACK_ROUTE;


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
  const [successMessage, setSuccessMessage] = useState(""); //* Mensaje Éxito


  // const clearErrors = () => {
  //   setErrors(null);
  // }; //! LIMPIAR ERROR

  const signup = async (data) => {
    try {
      setUser(data);
      // setIsAuth(true); //!
      return data;
    } catch (error) {
      console.log(error);
      if (Array.isArray(error.response.data)) {
        setErrors(error.response.data);
        return setSuccessMessage(""); //* Limpiamos el mensaje de éxito si hay un error
      }
      setErrors([error.response.data.message]);
      setSuccessMessage(""); //* Limpiamos el mensaje de éxito si hay un error
    }
  };

  const signin = async (data) => {
    try {
      const response = await axios.post(`${backRoute}/api/signin`, data);
      setUser(response.data);
      setIsAuth(true);
      setErrors(null); //* Limpiamos los errores al iniciar sesión correctamente
      setSuccessMessage("Inicio de sesión exitoso!"); // Mensaje de éxito
      // clearErrors(); //! LIMPIAR ERRORES
      return response.data;
    } catch (error) {
      console.log(error);
      if (Array.isArray(error.response.data)) {
        setErrors(error.response.data);
        return setSuccessMessage(""); //* Limpiamos el mensaje de éxito si hay un error
      }
      setErrors([error.response.data.message]);
      setSuccessMessage(""); //* Limpiamos el mensaje de éxito si hay un error
    }
  };

  const signout = async () => {
    await axios.post(`${backRoute}/api/signout`);
    setUser(null);
    setIsAuth(false);
  };

  useEffect(() => {
    setLoading(true); //! LOADING
    if (Cookie.get("token")) {
      axios
        .get(`${backRoute}/profile`)
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
      setSuccessMessage(""); //* Limpiamos el mensaje de éxito después de 5 segundos
    }, 5000);

    return () => clearTimeout(clean);
  }, [errors, successMessage]); //* 

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuth,
        errors,
        successMessage, //*
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
