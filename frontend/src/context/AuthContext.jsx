import { createContext, useState, useContext } from "react";

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
  // eslint-disable-next-line no-unused-vars
  const [user, setUser] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [isAuth, setIsAuth] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [errors, setErrors] = useState(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuth,
        errors,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
