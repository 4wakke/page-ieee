import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Input, Label, Container } from "../components/ui"; // Asumimos que estos componentes están definidos
import { useForm } from "react-hook-form";
import { useEffect } from "react";

const backRoute = import.meta.env.VITE_APP_BACK_ROUTE;


function ForgotPassword() {

  useEffect(() => {
      document.body.classList.add("forgot-page");
  
      return () => {
        document.body.classList.remove("forgot-page");
      };
    }, []);

  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    console.log("Datos enviados:", data);
    try {
      const response = await fetch(`${backRoute}/api/forgotPassword`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: data.email }),
      });

      if (response.ok) {
        alert("Se ha enviado a su correo una contraseña de recuperación");
        navigate("/home");
      } else {
        const result = await response.json();
        alert(result.message || "Hubo un error al enviar el correo de recuperación");
      }
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      alert("Error al intentar recuperar la contraseña");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="min-h-[85vh] min-w-[70vw] flex items-center justify-center">
      <Card>
        <h1 className="text-3xl font-bold my-2 text-center mb-4 tracking-wide">
          Recuperar<br />contraseña
        </h1>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Label htmlFor="email">Correo para recuperación</Label>
          <Input
            type="email"
            placeholder="Ingrese correo para recuperación de contraseña"
            {...register("email", {
              required: "El correo es requerido",
            })}
          />
          {errors.email && <p className="text-red-500 font-medium">{errors.email.message}</p>}

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

export default ForgotPassword;
