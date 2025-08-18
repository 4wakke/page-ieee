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
    // bg-gradient-to-r from-white/85 to-blue-900/85
    <nav className=" bg-gradient-to-r from-[#e5eff5] to-[#7de3ff]/40 shadow-md border-b-1 border-[#006699]"> 
    {/* FIXME: Cambio de color de nabvar: from-[#e5eff5] to-blue-700/50 a: */}

      <Container className="flex justify-between py-3">
        <div className="flex-1 min-w-0 ml-4 sm:ml-16">
              {/* FIXME: Cambio de margen hacia izq a 16 */}

          <div className="flex items-center">
            <Link to="./" className="flex items-center ">
              <img src="/assets/logo2.png" alt="ColCaribe Logo" className="h-10 sm:h-12 w-auto max-w-[120px] sm:max-w-none object-contain" />
            </Link>
            {/* FIXME: Cambio de logo*/}

            {/* <Link to="https://www.ieee.org/" className="hidden lg:block shrink-0 ">
              <img src="/assets/logo-ieee.svg" alt="IEEE Logo" className="h-8 w-auto object-contain" />
            </Link> */}
          </div>
        </div>
        <div className="flex items-center justify-end md:gap-x-1 sm:gap-x-3 gap-x-1 sm:mr-1 mr-2 px-2">
          <ul className="flex items-center justify-center gap-x-1 sm:gap-x-3 text-xs sm:text-sm">
            {isAuth ? (
              <>
                {privateRoutes.map(({ path, name, icon }) => (
                  <li key={path}>
                    <Link
                      to={path}
                      className={twMerge(
                        "text-slate-300 flex items-center py-1 transition-all rounded-md duration-150 hover:brightness-125",
                        location.pathname === path && ""
                      )}
                    >
                      {icon}
                      <span className="font-medium text-white hidden sm:block">{name}</span>
                    </Link>
                  </li>
                ))}

                <li
                  className="bg-[#e64261] text-white flex items-center px-3 py-1 gap-x-1 rounded-md hover:cursor-pointer mx-2 transition-all duration-150 hover:brightness-125 hover:text-[#ffff] hover:bg-[#e07488]"
                  onClick={() => {
                    signout();
                  }}
                >
                  <MdLogout className="w-5 h-5" />
                  <span className="hidden sm:block">Salir</span>
                </li>

                <li className="flex gap-x-1 items-center justify-center text-[#2a2200]">
                  <LuUserPen className="w-5 h-5 sm:inline" />
                  <span className="font-black">{user.name}</span>
                </li>
              </>
            ) : (
              publicRoutes.map(({ path, name }) => (
                <li
                className={twMerge(
                  "text-[#191b90] flex items-center px-3 py-2 font-semibold  rounded-md transition-colors duration-150  hover:bg-[#f6c80b] bg-[#ffff] shadow-sm hover:shadow-md hover:text-[#ffff]",
                  location.pathname === path && "bg-[#e64261] text-[#fff] "
                )}
                
                  key={path}
                >
                  {/* FIXME: Cambio color botones: text-[#4067a5] hover:bg-[#5c75a8] bg-[#c01f12] text-[#fff] */}
                  <Link to={path}>
            <span className="hidden sm:inline">
              {name} 
            </span>
            {name === "Sobre nosotros" && <span className="sm:hidden">C3</span>}
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