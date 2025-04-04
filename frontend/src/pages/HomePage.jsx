// import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";


function HomePage() {
  // eslint-disable-next-line no-unused-vars
  const data = useAuth();

  // useEffect(() => {
  //   document.body.classList.add("home-page");

  //   return () => {
  //     document.body.classList.remove("home-page");
  //   };
  // }, []);

  // para card w-[60vw] h-[65vh] en vez de w-full max-w-[600px] h-auto
  return (
    <div className="home flex items-center justify-center min-h-[85vh] min-w-[70vw] mx-auto">
      <div className="bg-[#2e5ca6] bg-opacity-85 w-full max-w-[850px] h-[500px] rounded-2xl shadow-lg p-8 flex flex-col items-center justify-center text-center">
      <h2 className="text-4xl font-bold text-white-500 mb-6 tracking-wide">
          Bienvenido a TEMSCON LATAM 2025
        </h2>
        <h3 className="text-3xl text-white-500 mb-6 font-medium tracking-wide">
        Regístrese para nuestro próximo evento 
        </h3>
        <h3 className="text-2xl text-white-500 mb-6 font-medium tracking-wide">
        20/04/2025
        </h3>
        <Link to="/register">
        <button className="bg-white text-[#0073AE] font-semibold py-3 px-7 rounded-full hover:bg-[#005f95] text-lg mb-4 hover:text-white transition-all duration-300 shadow-md hover:shadow-lg tracking-wide">
        Registrarse
        </button>
        </Link>
        <h3 className="text-2xl text-white-500 mb-6 font-medium tracking-wide">
          ¿Ya está registrado?
        </h3>
        <Link to="/login">
        <button className="bg-white text-[#0073AE] font-semibold py-3 px-7 rounded-full hover:bg-[#005f95] text-lg mb-4 hover:text-white transition-all duration-300 shadow-md hover:shadow-lg tracking-wide">
          Iniciar sesión
        </button>
        </Link>

      </div>
    </div>

  );
}

export default HomePage;