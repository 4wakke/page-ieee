import { Link } from "react-router-dom";
import { useEffect } from "react";

function NotFound() {
  useEffect(() => {
    document.body.classList.add("not-page");

    return () => {
      document.body.classList.remove("not-page");
    };
  }, []);

  return (
    <div className="w-screen h-screen flex items-center justify-center">
  <div className="bg-[#2e5ca6] bg-opacity-85 w-full max-w-[450px] h-auto p-8 rounded-2xl shadow-2xl flex flex-col items-center justify-center text-center mb-16">
    <h1 className="text-5xl font-extrabold text-white mb-4">Página no encontrada</h1>
    <h3 className="text-xl text-white mb-4">Error 404</h3>
    <p className="text-white text-lg mb-6">Para volver al inicio, presiona el botón:</p>
    <Link
      to="/"
      className="bg-white text-[#0073AE] font-medium py-2 px-6 rounded-lg  hover:bg-[#0073ae] text-lg mb-4 hover:text-[#fff]"
    >
      Inicio
    </Link>
  </div>
</div>
  );
}

export default NotFound;
