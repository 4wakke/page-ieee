import { LuCircleUserRound } from "react-icons/lu";


export const publicRoutes = [
  {
    name: "Sobre nosotros",
    path: "https://attend.ieee.org/c3/",
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
    name: (
      <div className="flex items-center space-x-2 bg-[#191b90] text-white px-3 py-1 gap-x-1 hover:text-[#ffff] hover:bg-[#585abd] rounded-md transition-all duration-150 hover:brightness-100 hover:cursor-pointer"> 
        <LuCircleUserRound className="w-5 h-5 text-[white]" />
        <span className="font-medium text-[white]">Perfil</span>
      </div>
    ),
    path: "/profile",
  },
];
