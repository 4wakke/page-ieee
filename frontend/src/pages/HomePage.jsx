import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { CardHomeAbout} from "../components/ui";
import { useNavigate } from "react-router-dom"


function HomePage() {
  // eslint-disable-next-line no-unused-vars
  const data = useAuth();
  const navigate = useNavigate();


  useEffect(() => {
    document.body.classList.add("home-page");

    return () => {
      document.body.classList.remove("home-page");
    };
  }, []);

  return (
    <div className="relative flex items-center justify-center h-screen">
      <CardHomeAbout>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Bienvenido a TEMSCON LATAM 2025
        </h2>
        <p className="text-lg text-gray-800">
          Regístrese para nuestro próximo evento
        </p>
        <p className="text-xl font-semibold my-4">20/04/2025</p>

        <button
          onClick={() => navigate("/register")}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-xl shadow-lg transition-transform transform hover:scale-105"
        >
          Registrarse
        </button>

        <p className="text-gray-700 text-lg mt-4">¿Ya está registrado?</p>

        <button
          onClick={() => navigate("/login")}
          className="bg-white border border-blue-500 text-blue-500 hover:bg-blue-100 font-bold py-3 px-8 rounded-xl shadow-lg transition-transform transform hover:scale-105 mt-2"
        >
          Iniciar sesión
        </button>
      </CardHomeAbout>
    </div>
  );
}

export default HomePage;