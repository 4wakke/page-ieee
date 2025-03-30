import { Card, Input,  Label, Container } from "../components/ui";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
// eslint-disable-next-line no-unused-vars
import { useEffect, useState } from "react";


function LoginPage() {
  useEffect(() => {
    document.body.classList.add("login-page");
    return () => {
      document.body.classList.remove("login-page");
    };
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { signin, errors: loginErrors } = useAuth();
  const navigate = useNavigate();

  const onSubmit = handleSubmit(async (data) => {
    const user = await signin(data);

    if (user) {
      navigate("/profile");
    }
  });

  return (
    <Container className="min-h-[85vh] min-w-[70vw] flex items-center justify-center ">
      <Card>
        {loginErrors &&
          loginErrors.map((err) => (
            // eslint-disable-next-line react/jsx-key
            <p className="text-red-500 font-bold"> {err}</p>
          ))}

        <h1 className="text-4xl font-bold my-2 text-center mb-4">Inicio sesión</h1>

        <form onSubmit={onSubmit}>
          <Label htmlFor="email">Correo electrónico</Label>
          <Input
            type="email"
            placeholder="Correo electrónico"
            {...register("email", {
              required: true,
            })}
          />

          {errors.email && <p className="text-red-700">El correo es requerido</p>}

          <Label htmlFor="password">Contraseña</Label>
          <Input
            type="password"
            placeholder="Contraseña"
            {...register("password", {
              required: true,
            })}
          />

          {errors.password && (
            <p className="text-red-700">La contraseña es requerida</p>
          )}
          
          <div className="mt-4">
          <button className="bg-[#ffffff] hover:bg-[#0073ae] text-[#0073ae] px-4 py-2 rounded font-bold hover:text-[#fff] ">Iniciar sesión</button>
          </div>

          <div className="flex justify-between my-4">
            <p className="mr-4">No tienes una cuenta?</p>
            <Link to="/register" className="font-bold ">
              Registro
            </Link>
          </div>
        </form>
      </Card>
    </Container>
  );
}

export default LoginPage;
