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
  <div className="bg-[#002855] bg-opacity-90 w-full max-w-[850px] rounded-2xl shadow-lg p-6 sm:p-8 flex flex-col items-center justify-center text-center duration-500 ease-in opacity-0 animate-fadeIn lg:mr-96">

    <h2 className="text-2xl sm:text-4xl font-bold text-[#ffffff] mb-4 sm:mb-6 leading-tight">
      Bienvenido a la Conferencia del Caribe Colombiano C3 2025
    </h2>

    <h3 className="italic text-[#dff2fe] text-lg sm:text-xl mb-4">
      Conferencia Técnica y Científica Bianual de la Sección del Caribe Colombiano de IEEE
    </h3> 

    <p className="text-white text-base sm:text-lg mb-4">
      Santa Marta, Colombia | 17 al 20 de Septiembre de 2025
    </p>

    <h3 className="italic text-[#dff2fe] text-base sm:text-lg mb-6">
      Organizado por la IEEE ColCaribe - Colombian Caribbean Section 
    </h3>

    <p className="text-white text-base sm:text-lg mb-3">
      Para completar su inscripción al evento, seleccione alguna de las opciones: 
    </p>

    <Link to="/register">
      <button className="bg-white text-[#191b90] font-semibold py-3 px-7 rounded-md hover:bg-[#f6c80b] text-lg mb-2 hover:text-white transition-all duration-300 shadow-md hover:shadow-lg tracking-wide">
        Registrarse
      </button>
    </Link>


    <p className="text-white text-base sm:text-lg mb-2">
      ¿Ya tienes una cuenta?
    </p>

    <Link to="/login">
      <button className="bg-white text-[#e64261] font-semibold py-2 sm:py-3 px-6 sm:px-7 rounded-md text-base sm:text-lg mb-4 hover:bg-[#f6c80b] hover:text-white transition-all duration-300 shadow-md hover:shadow-lg tracking-wide w-full sm:w-auto">
        Iniciar sesión
      </button>
    </Link>
  </div>
</div>
  );
}

export default HomePage;
