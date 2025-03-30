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
    // falta borde
    <nav className="bg-[#e5eff5] shadow-md border-b-2 border-[#006699] rounded-b-lg "> 
      <Container className="flex justify-between py-3">
        <div className="flex items-center space-x-3">
          <Link to="./" className="flex">
            <img src="/assets/logo-temscon.png" alt="TEMSCon Logo" className="h-12" />
          </Link>
          <Link to="https://www.ieee.org/" className="flex items-left  ">
            <img src="/assets/logo-ieee.svg" alt="IEEE Logo" className="h-8" />
          </Link>
        </div>
        <ul className="flex items-center justify-center md:gap-x-1">
          {isAuth ? (
            <>
              {privateRoutes.map(({ path, name, icon }) => (
                <li key={path}>
                  <Link
                    to={path}
                    className={twMerge(
                      "text-slate-300 flex items-center px-3 py-1 gap-x-1",
                      location.pathname === path && "bg-sky-500"
                    )}
                  >
                    {icon}
                    <span className="hidden sm:block">{name}</span>
                  </Link>
                </li>
              ))}

              <li
                className="text-slate-300 flex items-center px-3 py-1 
                hover:cursor-pointer"
                onClick={() => {
                  signout();
                }}
              >
                <MdLogout className="w-5 h-5" />
                <span className="hidden sm:block">Logout</span>
              </li>

              <li className="flex gap-x-1 items-center justify-center">
                <LuUserPen className="w-5 h-5" />
                <span className="font-medium">{user.name}</span>
              </li>
            </>
          ) : (
            publicRoutes.map(({ path, name }) => (
              <li
                className={twMerge(
                  "text-white-500 flex items-center px-3 py-1 font-medium text text-[#006699]",
                  location.pathname === path && "bg-[#f9f8f8] border-2"
                )}
                key={path}
              >
                <Link to={path}>{name}</Link>
              </li>
            ))
          )}
        </ul>
      </Container>
    </nav>
  );
}

export default Navbar;