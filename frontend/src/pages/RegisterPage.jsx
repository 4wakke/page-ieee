
// eslint-disable-next-line no-unused-vars
import { Input, Button, CardReg, Label, Container, SelectReg } from "../components/ui";
import { useForm } from "react-hook-form";
// eslint-disable-next-line no-unused-vars
import { Link, useNavigate } from "react-router-dom"; //?
import { useAuth} from "../context/AuthContext";
import { useEffect, useState, useRef  } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa"; 
import CountriesSelect from "../hooks/CountrySelect";
import ArticlesSpaces from "../hooks/ArticlesSpaces";
import ExchangeDollar from "../hooks/ExchangeRate";
import { toast } from "react-toastify";


const backRoute = import.meta.env.VITE_APP_BACK_ROUTE;

function RegisterPage() {

  // useEffect(() => {
  //   document.body.classList.add("register-page");
  //   return () => {
  //     document.body.classList.remove("register-page");
  //   };
  // }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm();

  // eslint-disable-next-line no-unused-vars
  const { signup, errors: signupErrors } = useAuth(); //*
  const isTaxRequired = watch("isTaxRequired");
  const qtyArticles = watch("qtyArticles", 0);
  const isIeeeMember = watch("isIeeeMember");
  const participationType = watch("participationType"); 
  const [price, setPrice] = useState(""); 
  const [showPassword, setShowPassword] = useState(false);
  const [userId, setUserId] = useState(null); //?
  const priceRef = useRef(null);
  const [dollarRate, setDollarRate] = useState(null); //? PRUEBA DOLLARRATE DINÁMICO

  useEffect(() => {
    if (isTaxRequired === "no") {
      setValue("taxAmount", "");
    }
  }, [isTaxRequired, setValue]);

  useEffect(() => { 
      if (isIeeeMember === "no") {
        setValue("isTems", "no"); 
        setValue("membershipNumber", ""); 
      }
    }, [isIeeeMember, setValue]);

  useEffect(() => { 
    if (participationType === "attendee") {
      setValue("qtyArticles", "");
      setValue("articles", [{ sequence: "", pages: "" }]);
    }
  }, [participationType, setValue]); 

  const handleBackendResponse = (response) => {
    if (response.success) {
      toast.success(response.message, {
        className: "bg-green-600 text-white font-medium",
        progressClassName: "bg-green-300",
        autoClose: 5000,
      });
    } else {
      toast.error(response.message, {
        className: "bg-red-600 text-white font-medium",
        progressClassName: "bg-red-300",
        autoClose: 5000,
      });
    }
  };

  const exchangeRate = ExchangeDollar(); //? PRUEBA DOLLARRATE DINÁMICO

  useEffect(() => { //? PRUEBA DOLLARRATE DINÁMICO
    setDollarRate(exchangeRate); // Cuando el valor de dollarRate cambia, se actualiza en el estado.
  }, [exchangeRate]); //? PRUEBA DOLLARRATE DINÁMICO  

  useEffect(() => {
    if (price && priceRef.current) {
      priceRef.current.scrollIntoView({
        behavior: "smooth", 
        block: "center", 
      });
    }
  }, [price]); 

  useEffect(() => {
    // Verificar si hay errores en el formulario
    if (Object.keys(errors).length > 0) {
      // Mostrar un toast indicando que todos los campos son requeridos
      toast.error("Debes completar todos los campos requeridos para registrar tu cuenta.", {
        className: "bg-red-600 text-white font-medium",
        progressClassName: "bg-red-300",
        autoClose: 5000,
      });
    }
  }, [errors]); 


  const handlePayment = async () => {
    try {

      if (!dollarRate) { //? PRUEBA DOLLARRATE DINÁMICO
        console.error("No se pudo obtener la tasa de cambio del dólar.");
        return;
      } //? PRUEBA DOLLARRATE DINÁMICO

      console.log(dollarRate); //? PRUEBA DOLLARRATE DINÁMICO
      

      const processPaymentResp = await fetch(`${backRoute}/api/processPayment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: price,
          dollarRate: dollarRate, //? PRUEBA DOLLARRATE DINÁMICO
          description: `Pago conferencia ${watch("name")} ${watch("lastName")}`,
          userId,
        }),
      });

      const processPaymentData = await processPaymentResp.json();
      console.log("Respuesta de proceso de pago:", processPaymentData);


      if (processPaymentData.success && processPaymentData.results.checkoutURL) {
        handleBackendResponse(processPaymentData);
        toast.success("Redirigiendo a la página de pago, espere unos segundos...", {
          className: "bg-green-600 text-white font-medium",
          progressClassName: "bg-green-300",
          autoClose: 5000,
        });
        setTimeout(() => {
          window.location.href = processPaymentData.results.checkoutURL;  // Dirige al checkout
        }, 5000);

        
      } else {
        console.error("Error al obtener la URL de pago", processPaymentData);
        handleBackendResponse(processPaymentData);
      }
    } catch (error) {
    console.error("Error en el proceso de pago:", error);
    toast.error("Hubo un error en el proceso de pago.", {
      className: "bg-red-600 text-white font-medium",
      progressClassName: "bg-red-300",
      autoClose: 5000,
    });
  }
  };

    const onSubmit = handleSubmit(async (data) => {
      try {

      data.isIeeeMember = data.isIeeeMember === "yes";
      data.isTems = data.isTems === "yes";
      data.taxAmount = data.isTaxRequired === "no" ? "0" : data.taxAmount;

      if (data.participationType === "attendee") {
        data.qtyArticles = 0;  
        data.articles = [];  
      } else {
        let formattedArticles = [];
        if (data.qtyArticles > 0 && data.participationType === "author") {
          formattedArticles = data.articles?.slice(0, data.qtyArticles).map(article => ({
            sequence: article?.sequence || "",
            pages: article?.pages ? parseInt(article.pages, 10) : ""
          })) || [];
        } else {
          formattedArticles = [{ sequence: "", pages: "" }];
        }
        data.articles = formattedArticles;
      }
      
      console.log("Datos enviados a signup:", data);
      
      const formattedData = {
        occupation: data.occupation,
        isIeeeMember: data.isIeeeMember,  
        isTems: data.isTems,   
        participationType: data.participationType,
        attendanceType: data.attendanceType === "inPerson" ? "In-person" : "Online",
        qtyArticles: data.qtyArticles,
        articles: data.articles,
      };
  
      console.log("Datos enviados a payment:", formattedData);
  
      const resp = await fetch(`${backRoute}/api/signup`, {
        method: "POST",
        body: JSON.stringify({ 
          ...data,
          articles: data.articles
        }),
        headers: { "Content-Type": "application/json" },
      });
  
      const dataSignup = await resp.json();
      console.log("Respuesta de signup:", dataSignup);

  
      if (dataSignup.success) {
      handleBackendResponse(dataSignup);
      const userId = dataSignup.results[0]?.userId;
      setUserId(userId);
      await signup(dataSignup);
        const response = await fetch(`${backRoute}/api/payment`, {
          method: "POST",
          body: JSON.stringify(formattedData), 
          headers: { "Content-Type": "application/json" },
        });
  
        const responseData = await response.json();
        console.log("Respuesta de payment:", responseData);

        if (responseData.success && responseData.results?.price !== undefined) {
          setPrice(responseData.results.price);
          handleBackendResponse(responseData);
        }
        
      } else {
        handleBackendResponse(dataSignup); 
    }
    } catch (error) {
      console.error("Error en el proceso de registro o pago:", error);
      toast.error("Hubo un error en el proceso de registro o pago.", {
        className: "bg-red-600 text-white font-medium",
        progressClassName: "bg-red-300",
        autoClose: 5000,
      });
    }
      
    });

  return (
    <Container className=" flex items-center justify-center min-h-screen">
      <CardReg>  
            
        <h3 className="text-3xl font-bold text-center mb-2 tracking-wide">Registro</h3>
        <form onSubmit={onSubmit} autoComplete="off">


          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 tracking-wide">

            <div> 
              <Label htmlFor="name">Nombre</Label>
              <Input type="text" placeholder="Ingresa tu nombre"
              {...register("name", { required: true })}/>
              {errors.name && (
              <p className="text-red-500 font-medium tracking-wide">El nombre es requerido</p>
              )}
            </div>

            <div>
              <Label htmlFor="lastName">Apellidos</Label>
              <Input type="text" placeholder="Ingresa tus apellidos"
              {...register("lastName", { required: true })}/>
              {errors.lastName && (
              <p className="text-red-500 font-medium">El apellido es requerido</p>
              )}
            </div>

            <div>
              <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Ingresa tu contraseña"
                    {...register("password", { required: true })}
                    />
                    {errors.password && (
                    <p className="text-red-500 font-medium">La contraseña es requerida</p>
                      )}      
                    <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-3 flex items-center text-gray-600"
                    >
                    {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                    </button>
                </div>
            </div>

            <div>
              <Label htmlFor="country">País</Label>
              <CountriesSelect register={register} errors={errors} disabled={false} />
            </div>

            <div>
              <Label htmlFor="city">Ciudad</Label>
              <Input type="text" placeholder="Ingresa tu ciudad"
                {...register("city", { required: true })}/>
              {errors.city && (
              <p className="text-red-500 font-medium">La ciudad es requerida</p>
              )}
            </div>

            <div>
              <Label htmlFor="birthDate">Fecha de nacimiento</Label>
              <Input type="date"
              {...register("birthDate", { required: true })}/>
              {errors.birthDate && (
              <p className="text-red-500 font-medium">La fecha es requerida</p>
              )}
            </div>

            <div>
            <Label htmlFor="gender">Género</Label>
              <SelectReg 
                {...register("gender", { required: true })}>
                <option value="">Selecciona tu género</option>
                <option value="Male">Masculino</option>
                <option value="Female">Femenino</option>
                <option value="Other">Otro</option>
              </SelectReg>
              {errors.gender && (
              <p className="text-red-500 font-medium">El género es requerido</p>
              )}
            </div>

            <div>
              <Label htmlFor="docType">Tipo de documento</Label>
              <SelectReg
              {...register("docType", { required: true })}>
                <option value="">Selecciona el tipo de documento</option>
                <option value="civilRegistry">Registro civil</option>
                <option value="identityCard">Tarjeta de identidad</option>
                <option value="citizenshipIdCard">Cédula de ciudadanía</option>
                <option value="foreignResidentCard">Tarjeta de extranjería</option>
                <option value="passport">Pasaporte</option>
                <option value="specialStayPermit">Permiso especial de permanencia</option>
                <option value="nationalIdentityDocument">Documento Nacional de identidad</option>
                <option value="safeConductPass">Salvoconducto</option>
              </SelectReg>
              {errors.docType && (
              <p className="text-red-500 font-medium">El tipo de documento es requerido</p>
              )}
            </div>

            <div>
              <Label htmlFor="docNumber">
                Número de documento
              </Label>
              <Input type="text" placeholder="Ingresa el número de documento"
              {...register("docNumber", { required: true })}/>
              {errors.docNumber && (
              <p className="text-red-500 font-medium">El número de documento es requerido</p>
              )}
            </div>

            <div>
              <Label htmlFor="email">Correo</Label>
              <Input type="email" placeholder="Ingresa tu correo electrónico"
              {...register("email", { required: true })}
              />
              {errors.email && (
              <p className="text-red-500 font-medium">El correo es requerido</p>
              )}
            </div>

            <div>
              <Label htmlFor="phoneNumber">Número de teléfono</Label>
              <Input type="tel" placeholder="Ingresa tu número de teléfono"
              {...register("phoneNumber", { required: true })}/>
              {errors.phoneNumber && (
              <p className="text-red-500 font-medium">La número de teléfono es requerido</p>
              )}
            </div>

            <div>
              <Label htmlFor="address">Dirección</Label>
                  <Input type="text" placeholder="Ingresa tu dirección"
                  {...register("address", { required: true })}/>
                  {errors.address && (
                  <p className="text-red-500 font-medium">La dirección es requerida</p>
                  )}
            </div>

            <div>
            <Label htmlFor="affiliation">Afiliación</Label>
              <Input type="text" placeholder="Ingresa tu afiliación"
              {...register("affiliation", { required: true })}/>
              {errors.affiliation && (
              <p className="text-red-500 font-medium">La empresa afiliada es requerida</p>
              )}
            </div>

            <div>
              <Label htmlFor="attendanceType">Tipo de asistencia</Label>
              <SelectReg {...register("attendanceType", { required: true })}>
                <option value="">Selecciona el tipo de asistencia</option>
                <option value="inPerson">Presencial</option>
                <option value="online">En línea</option>
              </SelectReg>
              {errors.attendanceType && (
              <p className="text-red-500 font-medium">El tipo de asistencia es requerido</p>
              )}
            </div>

            <div>
            <Label htmlFor="occupation">Ocupación</Label>
              <SelectReg className="text-[#000000] w-full px-3 py-2 mt-2 border bg-white"
              {...register("occupation", { required: true })}>
                <option value="">Selecciona el tipo de ocupación</option>
                <option value="student">Estudiante</option>
                <option value="professional">Profesional</option>
              </SelectReg>
              {errors.occupation && (
              <p className="text-red-500 font-medium">La ocupación es requerida</p>
              )}
            </div>

          </div> {/* FIN GRID */}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 tracking-wide mt-6">  {/* Inicio GRID 2 */}

          <div>
                <Label htmlFor="isIeeeMember">¿Eres miembro de IEEE?</Label>
                <SelectReg
                  {...register("isIeeeMember", { required: true })}
                >
                  <option value="">Selecciona</option>
                  <option value="yes">Sí</option>
                  <option value="no">No</option>
                </SelectReg>
                {errors.isIeeeMember && (
                  <p className="text-red-500 font-medium">Este campo es requerido</p>
                )}
  
                {isIeeeMember === "yes" && (
                  <>
                    <Label htmlFor="membershipNumber">Número de membresía IEEE</Label>
                    <Input 
                      type="text" 
                      placeholder="Ingresa tu número de membresía"
                      {...register("membershipNumber", { required: true })}
                    />
                    {errors.membershipNumber && (
                      <p className="text-red-500 font-medium">El número de membresía IEEE es requerido</p>
                    )}
  
                    <Label htmlFor="isTems">¿Eres miembro de TEMS?</Label>
                    <SelectReg {...register("isTems", { required: true })}>
                      <option value="">Selecciona</option>
                      <option value="yes">Sí</option>
                      <option value="no">No</option>
                    </SelectReg>
                    {errors.isTems && (
                      <p className="text-red-500 font-medium">Este campo es requerido</p>
                    )}
                  </>
                )}
              </div>

              <div>
              <Label htmlFor="participationType">Tipo de participación</Label>
              <SelectReg {...register("participationType", { required: true })}>
                <option value="">Selecciona el tipo de participación</option>
                <option value="author">Autor</option>
                <option value="attendee">Asistente</option>
              </SelectReg>
              {errors.participationType && (
              <p className="text-red-500 font-medium">El tipo de participación es requerido</p>
              )}

            {participationType === "author" && ( 
            <div>
              <Label htmlFor="qtyArticles">Número de artículos</Label>
              <Input type="number" placeholder="Ingresa el número de artículos"
              {...register("qtyArticles", { required: "Este campo es obligatorio", min: 1 })} onWheel={(e) => e.target.blur()}/>
              {qtyArticles > 0 && (
                <ArticlesSpaces register={register} errors={errors} qtyArticles={qtyArticles} isRegister={true}/>)}
                {errors.qtyArticles && (
              <p className="text-red-500 font-medium">El número de artículos es requerido</p>
              )}
            </div>
            )}
            </div>

            <div>
                <Label htmlFor="isTaxRequired">¿Requiere impuesto?</Label>
                <SelectReg {...register("isTaxRequired", { required: true })}>
                  <option value="">Selecciona</option>
                  <option value="yes">Sí</option>
                  <option value="no">No</option>
                </SelectReg>
                {errors.isTaxRequired && (
                  <p className="text-red-500 font-medium">Este campo es requerido</p>
                )}

              {isTaxRequired === "yes" && (
              <div>
                <Label htmlFor="taxAmount">Pago por impuesto</Label>
                <Input 
                  type="number" 
                  step="0.01" 
                  placeholder="Ingresa el pago por impuesto"
                  {...register("taxAmount", { required: true })}
                  onWheel={(e) => e.target.blur()}
                />
                {errors.taxAmount && (
                  <p className="text-red-500 font-medium">El pago por impuesto es requerido</p>
                )}
              </div>
                )}
            </div>

            

          </div> {/* FIN GRID 2 */}

          <div className="mt-4 text-center mb-6">
            <button className="bg-[#ffffff] hover:bg-[#0073ae] text-[#0073ae] px-4 py-2 rounded font-semibold hover:text-[#fff] tracking-wide duration-300 shadow-md hover:shadow-lg">Registrarse</button>
          </div>

{/*
          <div>
            {serverErrors.length > 0 && (
              <div className="text-red-500 font-medium bg-red-100 rounded-md shadow-md mb-4 mx-60 p-3">
                {serverErrors.map((err, index) => (
                  <p key={index} className="font-bold text-center">{err}</p>
                ))}
              </div>
            )}
            {serverMessage && (
              <div className="text-green-500 font-medium p-3 bg-green-100 rounded-md shadow-md mb-4 mx-60">
                <p className="font-bold text-center">{serverMessage}</p>
              </div>
            )}
          </div>

          */}

          <div className="mt-4 text-center">
            <div className="flex justify-center tracking-wide"> 
            <p className="mr-4">Ya tienes una cuenta?</p>
            <Link to="/login" className="font-bold">
              Iniciar sesión
            </Link>
            </div>
            
          </div>
        </form>

          <div ref={priceRef}>
            {price && (
              <div className="mt-2 p-4 bg-[#0073ae] text-white rounded-md shadow-md w-[30%] mx-auto">
                <div className="text-center">
                  <h4 className="text-xl font-bold">Registro exitoso</h4>
                  <p className="mt-2">
                    El precio a pagar es: <span className="font-bold">${price}</span>
                  </p>
                </div>
            
                <div className="mt-4 text-center">
                  <button onClick={handlePayment} disabled={!price} className="bg-[#ffffff] hover:bg-[#c01d0f] text-[#0073ae] px-4 py-2 rounded font-semibold hover:text-[#fff] tracking-wide duration-300 shadow-md hover:shadow-lg">
                    Pagar
                  </button>
                </div>
              </div>
            )}
          </div>
        
      </CardReg>
    </Container>
  );
}

export default RegisterPage;
