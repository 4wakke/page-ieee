import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
// eslint-disable-next-line no-unused-vars
import { Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa"; 
// eslint-disable-next-line no-unused-vars
import { Input, Button, CardReg, Label, Container, SelectReg } from "../components/ui";

const backRoute = import.meta.env.VITE_APP_BACK_ROUTE;

function ProfilePage() {

  useEffect(() => {
    document.body.classList.add("profile-page");
    return () => {
      document.body.classList.remove("profile-page");
    };
  }, []);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const [userDetails, setUserDetails] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Obtener correo almacenado en el login
  const userEmail = localStorage.getItem("userEmail");

  useEffect(() => {
    if (!userEmail) return;
    
    const fetchUserDetails = async () => {
      try {
        const response = await fetch(`${backRoute}/api/userDetail?email=${encodeURIComponent(userEmail)}`);
        const data = await response.json();
        if (data.success) {
          setUserDetails(data.results);
          for (const key in data.results) {
            if (data.results[key]) {
              setValue(key, data.results[key]);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, [setValue, userEmail]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async (data) => {
    try {
      const response = await fetch(`${backRoute}/api/detail`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (result.success) {
        setIsEditing(false);
        alert("Datos guardados exitosamente");
      } else {
        alert("Error al guardar los datos");
      }
    } catch (error) {
      console.error("Error saving user details:", error);
    }
  };

  if (!userDetails) {
    return <p>Cargando...</p>;
  }

  return (
    <Container className="flex items-center justify-center min-h-screen">
      <CardReg>
        <h3 className="text-3xl font-bold text-center mb-2 tracking-wide">Perfil de Usuario</h3>
        <form onSubmit={handleSubmit(handleSave)} autoComplete="off">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 tracking-wide">
            <div>
              <Label htmlFor="name">Nombre</Label>
              <Input type="text" placeholder="Nombre" {...register("name", { required: true })} disabled={!isEditing} />
              {errors.name && <p className="text-red-500 font-medium">El nombre es requerido</p>}
            </div>
            <div>
              <Label htmlFor="password">Contraseña</Label>
              <div className="relative">
                <Input type={showPassword ? "text" : "password"} placeholder="Contraseña" {...register("password", { required: true })} disabled={!isEditing} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-3 flex items-center text-gray-600">
                  {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 font-medium">La contraseña es requerida</p>}
            </div>
          </div>
          <div className="mt-4 text-center">
            {isEditing ? (
              <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Guardar</button>
            ) : (
              <button type="button" onClick={handleEdit} className="bg-blue-500 text-white px-4 py-2 rounded">Editar</button>
            )}
          </div>
        </form>
      </CardReg>
    </Container>
  );
}

export default ProfilePage;