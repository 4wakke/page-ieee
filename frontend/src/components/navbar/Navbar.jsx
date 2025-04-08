import { Link, useLocation } from "react-router-dom";
import { publicRoutes, privateRoutes } from "./navigation";
import { Container } from "../ui";
import { useAuth } from "../../context/AuthContext";
import { twMerge } from "tailwind-merge";
import { MdLogout } from "react-icons/md";
import { LuUserPen } from "react-icons/lu";

function Navbar() {
  const location = useLocation();
  const { isAuth, signout, user } = useAuth();

  return ( 
    <nav className="bg-[#e5eff5] shadow-md border-b-2 border-[#006699] rounded-b-lg "> 
      <Container className="flex justify-between py-3">
        <div className="flex-1 min-w-0 ml-4 sm:ml-10">
          <div className="flex items-center">
            <Link to="./" className="flex items-center ">
              <img src="/assets/logo-temscon.png" alt="TEMSCon Logo" className="h-10 sm:h-12 w-auto max-w-[120px] sm:max-w-none object-contain" />
            </Link>
            <Link to="https://www.ieee.org/" className="hidden lg:block shrink-0 ">
              <img src="/assets/logo-ieee.svg" alt="IEEE Logo" className="h-8 w-auto object-contain" />
            </Link>
          </div>
        </div>
        <div className="flex items-center justify-center md:gap-x-1 mx-10">
          <ul className="flex items-center justify-center gap-x-1 sm:gap-x-3 text-xs sm:text-sm">
            {isAuth ? (
              <>
                {privateRoutes.map(({ path, name, icon }) => (
                  <li key={path}>
                    <Link
                      to={path}
                      className={twMerge(
                        "text-slate-300 flex items-center py-1 border rounded-md transition-all duration-150 hover:brightness-125",
                        location.pathname === path && ""
                      )}
                    >
                      {icon}
                      <span className="hidden sm:block">{name}</span>
                    </Link>
                  </li>
                ))}

                <li
                  className="bg-[#c01d0f] text-white flex items-center px-3 py-1 gap-x-1 rounded-md hover:cursor-pointer mx-2 transition-all duration-150 hover:brightness-125"
                  onClick={() => {
                    signout();
                  }}
                >
                  <MdLogout className="w-5 h-5" />
                  <span className="hidden sm:block">Salir</span>
                </li>

                <li className="flex gap-x-1 items-center justify-center text-[#0073ae]">
                  <LuUserPen className="w-5 h-5 sm:inline" />
                  <span className="font-bold">{user.name}</span>
                </li>
              </>
            ) : (
              publicRoutes.map(({ path, name }) => (
                <li
                className={twMerge(
                  "text-[#4067a5] flex items-center px-3 py-2 font-semibold  rounded-md transition-colors duration-150  hover:bg-[#cbe5f0] bg-[#ffff] shadow-sm hover:shadow-md",
                  location.pathname === path && "bg-[#4067a5] text-[#fff] border-2"
                )}

                //                 "text-white   px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base font-semibold rounded-md transition-all duration-150",
  // "bg-[#0073ae] hover:bg-[#0091ce] shadow-sm hover:shadow-md"
                  key={path}
                >
                  <Link to={path}>
            <span className="hidden sm:inline">
              {name} {/* Texto largo */}
            </span>
            {name === "Sobre nosotros" && <span className="sm:hidden">Tems</span>}
            {name === "Iniciar sesión" && <span className="sm:hidden">Ingresa</span>}
            {name === "Registrarse" && <span className="sm:hidden">Registro</span>}
          </Link>
                </li>
              ))
            )}
          </ul>
        </div>
      
      </Container>
    </nav>
  );
}

export default Navbar;