import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Input, Label, Container } from "../components/ui"; // Asumimos que estos componentes están definidos
import { useForm } from "react-hook-form";


const backRoute = import.meta.env.VITE_APP_BACK_ROUTE;

function ChangePassword() {
  useEffect(() => {
    document.body.classList.add("change-page");

    return () => {
      document.body.classList.remove("change-page");
    };
  }, []);

  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const userId = localStorage.getItem("userId");
  console.log(userId); // Recuperamos el ID del usuario desde localStorage


  const onSubmit = async (data) => {
    setLoading(true);
    console.log("Datos enviados:", data);
    console.log("id está:", userId);

    try {
      const response = await fetch(`${backRoute}/api/changePassword`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          oldPassword: data.oldPassword,
          newPassword: data.newPassword,
        }),
      });

      if (response.ok) {
        alert("La contraseña se ha cambiado con éxito");
        navigate("/profile");
      } else {
        const result = await response.json();
        alert(result.message || "Hubo un error al cambiar la contraseña");
      }
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      alert("Error al intentar cambiar la contraseña");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="min-h-[85vh] min-w-[70vw] flex items-center justify-center">
      <Card>
        <h1 className="text-3xl font-bold my-2 text-center mb-4 tracking-wide">
          Cambio<br /> contraseña
        </h1>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Label htmlFor="oldPassword">Contraseña actual</Label>
          <Input
            type="password"
            placeholder="Ingrese su contraseña actual"
            {...register("oldPassword", {
              required: "La contraseña actual es requerida",
            })}
          />
          {errors.oldPassword && <p className="text-red-500 font-medium">{errors.oldPassword.message}</p>}

          <Label htmlFor="newPassword">Nueva contraseña</Label>
          <Input
            type="password"
            placeholder="Ingrese su nueva contraseña"
            {...register("newPassword", {
              required: "La nueva contraseña es requerida",
            })}
          />
          {errors.newPassword && <p className="text-red-500 font-medium">{errors.newPassword.message}</p>}

          <div className="mt-4 flex items-center justify-center">
            <button
              type="submit"
              className="bg-[#ffffff] hover:bg-[#0073ae] text-[#0073ae] px-4 py-2 rounded font-semibold hover:text-[#fff] tracking-wide duration-300 shadow-md hover:shadow-lg"
              disabled={loading}
            >
              {loading ? "Enviando..." : "Enviar cambios"}
            </button>
          </div>
        </form>
      </Card>
    </Container>
  );
}

export default ChangePassword;