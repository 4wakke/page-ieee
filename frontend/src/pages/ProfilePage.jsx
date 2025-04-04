import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { Input, Button, CardReg, Label, Container, SelectReg } from "../components/ui";
import ExchangeDollar from "../hooks/ExchangeRate";
import CountriesSelect from "../hooks/CountrySelect";
// import ArticlesSpaces from "../hooks/ArticlesSpaces";

const backRoute = import.meta.env.VITE_APP_BACK_ROUTE;

function ProfilePage() {

  // useEffect(() => {
  //   document.body.classList.add("profile-page");
  //   return () => {
  //     document.body.classList.remove("profile-page");
  //   };
  // }, []);

  const [userDetails, setUserDetails] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [exchangeRate, setExchangeRate] = useState(null); // Almacena el tipo de cambio
    const [isIeeeMemberSelected, setIsIeeeMemberSelected] = useState(false);  //! Nuevo estado
    // eslint-disable-next-line no-unused-vars
    const [error, setError] = useState(""); // Estado para el mensaje de error




  
  const navigate = useNavigate();

  const { register, handleSubmit, setValue,watch, formState: { errors } } = useForm();

  const isIeeeMemberValue = watch("isIeeeMember"); // Observa cambios en el campo

  // Obtener el tipo de cambio al iniciar
  const exchange = ExchangeDollar(); 

  // Obtener correo almacenado en el login
  const userEmail = localStorage.getItem("userEmail");
  
  useEffect(() => {
    if (watch("isIeeeMember") === "no") {
      setValue("membershipNumber", "");
    }
  }, [setValue, watch]);

  const handleChangePassword = () => {
    navigate("/profile/changepassword");
  };

  useEffect(() => {
    if (exchange) {
      setExchangeRate(exchange);  // Almacena el tipo de cambio en el estado
    }
  }, [exchange]);

  useEffect(() => {
    if (!userEmail || !exchangeRate) return; //? Evita varias peticiones 
    
    const fetchUserDetails = async () => {

      console.log("Correo que se está usando:", userEmail);
      console.log("Valor del tipo de cambio (exchangeRate):", exchangeRate);

      try {
        const response = await fetch(`${backRoute}/api/userDetail?email=${encodeURIComponent(userEmail)}&exchangeRate=${exchangeRate}`);
        const data = await response.json();
        console.log("Datos recibidos del backend:", data.results)

        if (data.success) {
          let userData = {...data.results};
          localStorage.setItem("userId", userData.id);
          

          // Convertir valores 0 y 1 a 'No' y 'Sí'
        if (userData.isIeeeMember !== undefined) {
          userData.isIeeeMember = userData.isIeeeMember === 1 ? "yes" : "no";
        }
        if (userData.isTems !== undefined) {
          userData.isTems = userData.isTems === 1 ? "yes" : "no";
        }

        // Verificar si el pago por impuesto es mayor a 0
        if (userData.taxAmount > 0) {
          userData.isTaxRequired = "yes";  // Establecer "sí" si el pago por impuesto es mayor a 0
        } else {
            userData.isTaxRequired = "no";
        }
        setUserDetails(userData);

          for (const key in userData) {
            if (userData[key]) {
              setValue(key, userData[key]);
            }
          }
          if (userData.country) {
            setValue("country", userData.country);  // Establece el valor de 'country'
          }
          // Determina si `isIeeeMember` es "yes" o "no" y ajusta el estado
          if (userData.isIeeeMember === "yes") {
            setIsIeeeMemberSelected(true);
          } else {
            setIsIeeeMemberSelected(false);
          }
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    

    fetchUserDetails();
  }, [setValue, userEmail, exchangeRate]);

  const handleEdit = () => {
    setIsEditing(true);
  };


  const handleSave = async (data) => {
    setError(""); // Limpiamos errores antes de validar

    let updatedData = { ...data };


      // Convertimos "yes" a true y "no" a false
    if (updatedData.isIeeeMember !== undefined) {
      updatedData.isIeeeMember = updatedData.isIeeeMember === "yes";
    }
    if (updatedData.isTems !== undefined) {
      updatedData.isTems = updatedData.isTems === "yes";
    }

    console.log("Datos que se van a enviar:", updatedData);

    // if (!userDetails || !userDetails.id) { //!
    //   console.error("ID de usuario no disponible");
    //   return;
    // } //?

    // try {
    //   const response = await fetch(`${backRoute}/api/users/${userDetails.id}`, {
    //     method: "PUT",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify(updatedData),
    //   });
    //   const result = await response.json();
      
    //   console.log("Resultado de la respuesta:", result); // Verifica la respuesta  del servidor
    //   if (result.success) {
    //     setIsEditing(false);
    //     alert("Datos guardados exitosamente");
    //   } else {
    //     alert("Error al guardar los datos");
    //   }
    // } catch (error) {
    //   console.error("Error saving user details:", error);
    // } //!
  };

  if (!userDetails) {
    return <p>Cargando...</p>;
  }

  return (
    <div className="flex items-center justify-center ">
      <div className="bg-[#2e5ca6] bg-opacity-90 shadow-lg p-6 min-h-screen rounded-lg w-[1050px] mx-auto ">
        <h3 className="text-3xl font-bold text-center mb-4 tracking-wide">Perfil de usuario</h3>
        <form onSubmit={handleSubmit(handleSave)} autoComplete="off">

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 tracking-wide"> {/* GRID */}

            <div>
            <Label htmlFor="name">Nombre</Label>
              <Input type="text" placeholder="Ingresa tu nombre"
              {...register("name", { required: true })} disabled={!isEditing} />
              {/* {errors.name && <p className="text-red-500 font-medium">El nombre es requerido</p>} */}
            </div>

            <div>
              <Label htmlFor="birthDate">Fecha de nacimiento</Label>
              <Input type="date" placeholder="Editar fecha de nacimiento" {...register("birthDate", { required: true })} disabled={!isEditing} />
              {/* {errors.name && <p className="text-red-500 font-medium">El nombre es requerido</p>} */}
            </div>

            <div>
              <Label htmlFor="address">Dirección</Label>
                  <Input type="text" placeholder="Editar dirección"
                  {...register("address", { required: true })} disabled={!isEditing}/>
                  {/* {errors.address && (
                  <p className="text-red-500 font-medium">La dirección es requerida</p>
                  )} */}
            </div>

            <div>
              <Label htmlFor="lastName">Apellidos</Label>
              <Input type="text" placeholder="Editar apellido"
              {...register("lastName", { required: true })} disabled={!isEditing}/>
              {/* {errors.lastName && (
              <p className="text-red-500 font-medium">El apellido es requerido</p>
              )} */}
            </div>

            <div>
              <Label htmlFor="docType">Tipo de documento</Label>
              <SelectReg
              {...register("docType", { required: true })}disabled={!isEditing}>
                <option value="">Selecciona el tipo de documento</option>
                <option value="civilRegistry">Registro civil</option>
                <option value="identityCard">Tarjeta de identidad</option>
                <option value="citizenshipIdCard">Cédula de ciudadanía</option>
                <option value="foreignResidentCard">Tarjeta de extranjería</option>
                <option value="passport">Pasaporte</option>
                <option value="specialStayPermit">Permiso especial de permanencia</option>
                <option value="nationalIdentityDocument">Documento Nacional de identidad</option>
                <option value="safeConduct
                Pass">Salvoconducto</option>
              </SelectReg>
              {/* {errors.docType && (
              <p className="text-red-500 font-medium">El tipo de documento es requerido</p>
              )} */}
            </div>

            <div>
              <Label htmlFor="affiliation">Afiliación</Label>
                <Input type="text" placeholder="Ingresa tu afiliación"
                {...register("affiliation", { required: true })}disabled={!isEditing}/>
                {/* {errors.affiliation && (
                <p className="text-red-500 font-medium">La empresa afiliada es requerida</p>
                )} */}
            </div>

            <div>
              <Label htmlFor="gender">Género</Label>
                <SelectReg 
                  {...register("gender", { required: true })} disabled={!isEditing}>
                  <option value="">Selecciona tu género</option>
                  <option value="Male">Masculino</option>
                  <option value="Female">Femenino</option>
                  <option value="Other">Otro</option>
                </SelectReg>
                {/* {errors.gender && (
                <p className="text-red-500 font-medium">El género es requerido</p>
                )} */}
            </div>

            <div>
              <Label htmlFor="docNumber">
                Número de documento
              </Label>
              <Input type="text" placeholder="Editar número de documento"
              {...register("docNumber", { required: true })} disabled={!isEditing} />
              {/* {errors.docNumber && (
              <p className="text-red-500 font-medium">El número de documento es requerido</p>
              )} */}
            </div>

            <div>
              <Label htmlFor="attendanceType">Tipo de asistencia</Label>
              <SelectReg {...register("attendanceType", { required: true })}disabled={!isEditing} >
                <option value="">Selecciona el tipo de asistencia</option>
                <option value="inPerson">Presencial</option>
                <option value="online">En línea</option>
              </SelectReg>
              {/* {errors.attendanceType && (
              <p className="text-red-500 font-medium">El tipo de asistencia es requerido</p>
              )} */}
            </div>
                
            <div>
            <Label htmlFor="country">País</Label>
              {isEditing ? (
                // Si estamos en modo edición, mostramos el componente `CountriesSelect`
                <CountriesSelect register={register} errors={errors} disabled={!isEditing} />
              ) : (
                // Si no estamos en modo edición, mostramos un `Input` con el valor del país, pero deshabilitado
                <Input 
                  type="text" 
                  value={userDetails?.country || "No especificado"}  // Aquí asignamos el valor del país
                  disabled 
                />
              )}
            </div>

            <div>
              <Label htmlFor="email">Correo</Label>
              <Input type="email" placeholder="Editar correo electrónico"
              {...register("email", { required: true })}
              disabled={!isEditing} />
              {/* {errors.email && (
              <p className="text-red-500 font-medium">El correo es requerido</p>
              )} */}
            </div>

            <div>
            <Label htmlFor="occupation">Ocupación</Label>
              <SelectReg className="text-[#000000] w-full px-3 py-2 mt-2 border bg-white"
              {...register("occupation", { required: true })}disabled={!isEditing}>
                <option value="">Selecciona el tipo de ocupación</option>
                <option value="student">Estudiante</option>
                <option value="professional">Profesional</option>
              </SelectReg>
              {/* {errors.birthDate && (
              <p className="text-red-500 font-medium">La ocupación es requerida</p>
              )} */}
            </div>

            <div>
              <Label htmlFor="city">Ciudad</Label>
              <Input type="text" placeholder="Ingresa tu ciudad"
                {...register("city", { required: true })} disabled={!isEditing}/>
              {/* {errors.city && (
              <p className="text-red-500 font-medium">La ciudad es requerida</p>
              )} */}
            </div>

            <div>
              <Label htmlFor="phoneNumber">Número de teléfono</Label>
              <Input type="tel" placeholder="Ingresa tu número de teléfono"
              {...register("phoneNumber", { required: true })} disabled={!isEditing}/>
              {/* {errors.phoneNumber && (
              <p className="text-red-500 font-medium">La número de teléfono es requerido</p>
              )} */}
            </div>

            <div>
              <Label htmlFor="participationType">Tipo de participación</Label>
              <SelectReg {...register("participationType", { required: true })} disabled={!isEditing}>
                <option value="">Selecciona el tipo de participación</option>
                <option value="author">Autor</option>
                <option value="attendee">Asistente</option>
              </SelectReg>
              {/* {errors.participationType && (
              <p className="text-red-500 font-medium">El tipo de participación es requerido</p>
              )} */}
            </div>

            

            <div>
              <Label htmlFor="isIeeeMember">¿Eres miembro de IEEE?</Label>
              <SelectReg
                {...register("isIeeeMember", { required: true })}
                disabled={!isEditing}
                onChange={(e) => {
                  const value = e.target.value;
                  setIsIeeeMemberSelected(value === "yes");
                  setValue("isIeeeMember", value);
                  if (value === "no") {
                    setValue("isIeeeMember", value);
                    setValue("membershipNumber", "");
                    setValue("isTems", "no");
                  }
                }}
              >
                <option value="">Selecciona</option>
                <option value="yes">Sí</option>
                <option value="no">No</option>
              </SelectReg>
            </div>

            <div>
            <Label htmlFor="isTaxRequired">¿Requiere impuesto?</Label>
                <SelectReg {...register("isTaxRequired", { required: true })} disabled={!isEditing}>
                  <option value="">Selecciona</option>
                  <option value="yes">Sí</option>
                  <option value="no">No</option>
                </SelectReg>
                {/* {errors.isTaxRequired && (
                  <p className="text-red-500 font-medium">Este campo es requerido</p>
                )} */}
            </div>

            <div> 
            <Label htmlFor="pages">Articulos</Label>
              <Input type="number" placeholder="Editar número de páginas artículo 1"
              {...register("pages", { required: "Este campo es obligatorio", min: 1 })} onWheel={(e) => e.target.blur()} disabled={!isEditing} />
            </div> 


            <div>
              <Label htmlFor="membershipNumber">Número de membresía IEEE</Label>
              <Input
                type="text"
                placeholder="Editar número de membresía"
                {...register("membershipNumber", {
                  required: isIeeeMemberValue === "yes" ? "El número de membresía es obligatorio" : false
                })}
                disabled={isIeeeMemberValue !== "yes" || !isEditing}
              />
              {errors.membershipNumber && <p className="text-red-500 font-medium">{errors.membershipNumber.message}</p>}
            </div>

            <div>
            <Label htmlFor="taxAmount">Pago por impuesto</Label>
                <Input 
                  type="number" 
                  step="0.01" 
                  placeholder="Ingresa el pago por impuesto"
                  {...register("taxAmount", { required: true })}
                  onWheel={(e) => e.target.blur()}
                  disabled={!isEditing} />
                {/* {errors.taxAmount && (
                  <p className="text-red-500 font-medium">El pago por impuesto es requerido</p>
                )} */}
            </div>



            <div> 
            <Label htmlFor="pages">Número de páginas articulo 1</Label>
              <Input type="number" placeholder="Editar número de páginas artículo 1"
              {...register("pages", { required: "Este campo es obligatorio", min: 1 })} onWheel={(e) => e.target.blur()} disabled={!isEditing} />
            </div> 

            <div>
              <Label htmlFor="isTems">¿Eres miembro de TEMS?</Label>
              <SelectReg
                {...register("isTems", { required: isIeeeMemberSelected })}
                disabled={!isIeeeMemberSelected || !isEditing}
              >
                <option value="">Selecciona</option>
                <option value="yes">Sí</option>
                <option value="no">No</option>
              </SelectReg>
            </div>
            
            <div></div>
            
            <div> 
            <Label htmlFor="sequence">Editar número articulo 1</Label>
              <Input type="text" placeholder="Editar número artículo 1"
              {...register("sequence", { required: "Este campo es obligatorio", min: 1 })} onWheel={(e) => e.target.blur()} disabled={!isEditing}/>
            </div>
            
            <div> {/* espacio medio */}
              
            </div>
            
          </div> {/* FIN GRID */}

          <div className=" flex justify-center space-x-4 mt-4">
            <div>
              {isEditing ? (
                <button type="submit" className="bg-[#ffffff] hover:bg-[#0073ae] text-[#0073ae] px-4 py-2 rounded font-semibold hover:text-[#fff] tracking-wide duration-300 shadow-md hover:shadow-lg">Guardar</button>
              ) : (
                <button type="button" onClick={handleEdit} className="bg-[#ffffff] hover:bg-[#0073ae] text-[#0073ae] px-4 py-2 rounded font-semibold hover:text-[#fff] tracking-wide duration-300 shadow-md hover:shadow-lg">Editar</button>
              )}
              </div>
              <div>
                <button type="button" onClick={handleChangePassword} className="bg-[#ffffff] hover:bg-[#0073ae] text-[#0073ae] px-4 py-2 rounded font-semibold hover:text-[#fff] tracking-wide duration-300 shadow-md hover:shadow-lg">
                    Cambiar Contraseña
                </button>
              </div>
                
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProfilePage;