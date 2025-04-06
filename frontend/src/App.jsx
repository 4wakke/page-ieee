import { Routes, Route } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { ToastContainer } from "react-toastify"; //! 🆕 Importación
import "react-toastify/dist/ReactToastify.css"; //! 🆕 Estilos necesarios



import Navbar from "./components/navbar/Navbar";
import { Container } from "./components/ui";
import { ProtectedRoute } from "./components/protectedRoute";

import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import NotFound from "./pages/NotFound";
import ForgotPassword from "./pages/ForgotPasswordPage";
import ChangePassword from "./pages/ChangePasswordPage";
import AdminPage from "./pages/AdminPage";

function App() {
  const { isAuth, loading } = useAuth(); //! LOADING
  //? console.log(isAuth);

  if (loading) return <h1>Cargando...</h1>; //! LOADING

  {/* Empiezan cambios*/}

  return (
    <>
      <Navbar />

      <ToastContainer position="top-right" autoClose={5000} /> {/* //! */}

      <Container className="py-5">
        <Routes>
          <Route
            element={
              <ProtectedRoute isAllowed={!isAuth} redirectTo="profile" />
            }
          >
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgotpassword" element={<ForgotPassword />} />
            <Route path="/profile/admin" element={<AdminPage />} /> 

          </Route>

          <Route
            element={<ProtectedRoute isAllowed={isAuth} redirectTo="/login" />}
          >
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/profile/changepassword" element={<ChangePassword />} />
            


          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Container>
    </>
  );
}

export default App;
