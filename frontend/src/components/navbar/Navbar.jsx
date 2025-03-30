/* eslint-disable no-unused-vars */
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
    <nav className="bg-white shadow-md border-b border-gray-200"> 
      <Container className="flex justify-between items-center py-4">
        <div className="flex items-center space-x-3">
          <Link to="./" className="flex items-center">
            <img src="/assets/logo-temscon.png" alt="TEMSCon Logo" className="h-12" />
          </Link>
          <Link to="https://www.ieee.org/" className="flex items-left">
            <img src="/assets/logo-ieee.svg" alt="IEEE Logo" className="h-8" />
          </Link>
        </div>
        <ul className="hidden md:flex items-center space-x-6">
          {(isAuth ? privateRoutes : publicRoutes).map(({ path, name }) => (
            <li key={path}>
              <Link
                to={path}
                className={twMerge(
                  "text-gray-700 font-medium hover:text-blue-600 transition",
                  location.pathname === path && "border-b-2 border-blue-600"
                )}
              >
                {name}
              </Link>
            </li>
          ))}
        </ul>

      </Container>
    </nav>
  );
}

export default Navbar;