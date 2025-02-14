import { LuCircleUserRound } from "react-icons/lu";


export const publicRoutes = [
  {
    name: "About",
    path: "/about",
  },
  {
    name: "Login",
    path: "/login",
  },
  {
    name: "Register",
    path: "/register",
  },
];

export const privateRoutes = [
  {
    name: "Profile",
    path: "/profile",
    icon: <LuCircleUserRound className="w-5 h-5" />,
  },
];
