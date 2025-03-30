import { Input, Button, CardReg, Label, Container } from "../components/ui";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import CountriesSelect from "../hooks/CountrySelect";
import ArticlesSpaces from "../hooks/ArticlesSpaces";

function RegisterPage() {
  useEffect(() => {
    document.body.classList.add("login-page");
    return () => document.body.classList.remove("login-page");
  }, []);

  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const qtyArticles = watch("qtyArticles", 0);

  const onSubmit = handleSubmit(async (data) => {
    console.log(data);
  });

  return (
    <Container className="flex items-center justify-center min-h-screen">
      <CardReg className="bg-blue-900 bg-opacity-80 p-6 rounded-lg max-w-5xl mx-auto">
        <h3 className="text-white text-3xl font-bold text-center mb-4">Registro</h3>
        <form onSubmit={onSubmit} autoComplete="off">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"> {/* Grid */}
            
            {/* Nombre */}
            <div>
              <Label htmlFor="name" className="text-white">Nombre</Label>
              <Input type="text" placeholder="Ingresa tu nombre" {...register("name", { required: true })} />
              {errors.name && <p className="text-red-500 text-sm">El nombre es requerido</p>}
            </div>

            {/* Apellidos */}
            <div>
              <Label htmlFor="lastName" className="text-white">Apellidos</Label>
              <Input type="text" placeholder="Ingresa tus apellidos" {...register("lastName", { required: true })} />
              {errors.lastName && <p className="text-red-500 text-sm">El apellido es requerido</p>}
            </div>

            {/* Contraseña */}
            <div>
              <Label htmlFor="password" className="text-white">Contraseña</Label>
              <Input type="password" placeholder="Ingresa tu contraseña" {...register("password", { required: true })} />
              {errors.password && <p className="text-red-500 text-sm">La contraseña es requerida</p>}
            </div>

            {/* País */}
            <div>
              <Label htmlFor="country" className="text-white">País</Label>
              <CountriesSelect register={register} errors={errors} />
            </div>

            {/* Ciudad */}
            <div>
              <Label htmlFor="city" className="text-white">Ciudad</Label>
              <Input type="text" placeholder="Ingresa tu ciudad" {...register("city", { required: true })} />
              {errors.city && <p className="text-red-500 text-sm">La ciudad es requerida</p>}
            </div>

            {/* Dirección */}
            <div>
              <Label htmlFor="address" className="text-white">Dirección</Label>
              <Input type="text" placeholder="Ingresa tu dirección" {...register("address", { required: true })} />
              {errors.address && <p className="text-red-500 text-sm">La dirección es requerida</p>}
            </div>

            {/* Género */}
            <div>
              <Label htmlFor="gender" className="text-white">Género</Label>
              <select className="w-full p-2 rounded bg-white text-black" {...register("gender", { required: true })}>
                <option value="">Selecciona tu género</option>
                <option value="Male">Masculino</option>
                <option value="Female">Femenino</option>
                <option value="Other">Otro</option>
              </select>
              {errors.gender && <p className="text-red-500 text-sm">El género es requerido</p>}
            </div>

            {/* Fecha de nacimiento */}
            <div>
              <Label htmlFor="birthDate" className="text-white">Fecha de nacimiento</Label>
              <Input type="date" {...register("birthDate", { required: true })} />
              {errors.birthDate && <p className="text-red-500 text-sm">La fecha de nacimiento es requerida</p>}
            </div>

            {/* Tipo de documento */}
            <div>
              <Label htmlFor="docType" className="text-white">Tipo de documento</Label>
              <select className="w-full p-2 rounded bg-white text-black" {...register("docType", { required: true })}>
                <option value="">Selecciona el tipo de documento</option>
                <option value="passport">Pasaporte</option>
                <option value="identityCard">Tarjeta de identidad</option>
                <option value="citizenshipIdCard">Cédula de ciudadanía</option>
              </select>
              {errors.docType && <p className="text-red-500 text-sm">El tipo de documento es requerido</p>}
            </div>

            {/* Número de documento */}
            <div>
              <Label htmlFor="docNumber" className="text-white">Número de documento</Label>
              <Input type="text" placeholder="Ingresa el número de documento" {...register("docNumber", { required: true })} />
              {errors.docNumber && <p className="text-red-500 text-sm">El número de documento es requerido</p>}
            </div>

            {/* Número de artículos */}
            <div>
              <Label htmlFor="qtyArticles" className="text-white">Número de artículos</Label>
              <Input type="number" placeholder="Ingresa el número de artículos" {...register("qtyArticles", { required: true, min: 1 })} />
              {errors.qtyArticles && <p className="text-red-500 text-sm">Debe ingresar al menos 1 artículo</p>}
              {qtyArticles > 0 && <ArticlesSpaces register={register} errors={errors} qtyArticles={qtyArticles} />}
            </div>
          </div>

          {/* Botón de registro */}
          <div className="mt-4 text-center">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">Registrarse</Button>
          </div>

          {/* Link a Login */}
          <div className="flex justify-between my-4 text-white">
            <p>¿Ya tienes una cuenta?</p>
            <Link to="/login" className="font-bold">Iniciar sesión</Link>
          </div>

          {/* Mensaje de éxito */}
          <div className="mt-4 p-2 border border-gray-300 rounded-lg bg-green-200 text-center">
            <h4 className="text-xl font-bold">¡Registro exitoso!</h4>
            <p className="mt-2">El registro fue completado exitosamente.</p>
            <Button onClick={() => alert("Redirigiendo a la página de pago...")} className="mt-4">Haz clic aquí para pagar</Button>
          </div>

        </form>
      </CardReg>
    </Container>
  );
}

export default RegisterPage;
