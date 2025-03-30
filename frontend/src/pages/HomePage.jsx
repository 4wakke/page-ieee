import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";


function HomePage() {
  // eslint-disable-next-line no-unused-vars
  const data = useAuth();

  useEffect(() => {
    // Agrega la clase solo cuando se monta HomePage
    document.body.classList.add("home-page");

    return () => {
      // La elimina cuando sales de HomePage
      document.body.classList.remove("home-page");
    };
  }, []);

  return (
    <div className="home flex items-center justify-center min-h-[70vh] min-w-[70vw] mx-auto">
      <div className="bg-[#e5eff5] bg-opacity-70 w-[70vw] h-[70vh] rounded-2xl shadow-lg p-8 flex flex-col items-center justify-center text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          INGRESE A SU CUENTA
        </h2>

        <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-full text-lg mb-4">
          Ingresar
        </button>

        <p className="text-gray-700 text-lg mt-4">
          ¿NO TIENE CUENTA?{" "}
          <span className="font-bold text-blue-600">REGÍSTRESE</span>
        </p>

        <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-full text-lg mt-4">
          Registrarse
        </button>
      </div>
    </div>
  );
}

export default HomePage;