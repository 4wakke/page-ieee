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
    <div className="home flex items-center justify-center px-4 min-h-[85vh] w-full mx-auto lg:mt-1 md:mt-4 sm:mt-2 mt-4">
  <div className="bg-[#2a4992] bg-opacity-90 w-full max-w-[850px] rounded-2xl shadow-lg p-6 sm:p-8 flex flex-col items-center justify-center text-center duration-500 ease-in opacity-0 animate-fadeIn">
    
    <h2 className="text-2xl sm:text-4xl font-bold text-white mb-4 sm:mb-6 leading-tight">
      Bienvenido a IEEE TEMSCON LATAM 2025
    </h2>

    <h3 className="italic text-[#dff2fe] text-lg sm:text-xl mb-4">
      Explorando la Innovación en Gestión Tecnológica y Empresarial
    </h3>

    <p className="text-white text-base sm:text-lg mb-4">
      Cartagena, Colombia | 18 al 20 de junio de 2025
    </p>

    <h3 className="italic text-[#dff2fe] text-base sm:text-lg mb-6">
      Organizado por la IEEE Technology and Engineering Management Society (TEMS)
    </h3>

    <p className="text-white text-base sm:text-lg mb-3">
      Para completar tu inscripción al evento, haz clic en el siguiente botón:
    </p>

    <Link to="/register">
      <button className="bg-white text-[#4067a5] font-semibold py-3 px-7 rounded-md hover:bg-[#5c75a8] text-lg mb-2 hover:text-white transition-all duration-300 shadow-md hover:shadow-lg tracking-wide">
        Registrarse
      </button>
    </Link>

    <p className="text-white text-base sm:text-lg mb-2">
      ¿Ya tienes una cuenta?
    </p>

    <Link to="/login">
      <button className="bg-white text-[#4067a5] font-semibold py-2 sm:py-3 px-6 sm:px-7 rounded-md text-base sm:text-lg mb-4 hover:bg-[#5c75a8] hover:text-white transition-all duration-300 shadow-md hover:shadow-lg tracking-wide w-full sm:w-auto">
        Iniciar sesión
      </button>
    </Link>
  </div>
</div>
  );
}

export default HomePage;
