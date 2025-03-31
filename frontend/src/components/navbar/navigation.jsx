import { LuCircleUserRound } from "react-icons/lu";


export const publicRoutes = [
  {
    name: "Sobre nosotros",
    path: "/about",
  },
  {
    name: "Iniciar sesión",
    path: "/login",
  },
  {
    name: "Registrarse",
    path: "/register",
  },
];

export const privateRoutes = [
  {
    name: "Perfil",
    path: "/profile",
    icon: <LuCircleUserRound className="w-5 h-5 text-[white]" />,
  },
];
