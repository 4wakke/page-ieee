import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { Input, Button, CardReg, Label, Container, SelectReg } from "../components/ui";
import ExchangeDollar from "../hooks/ExchangeRate";
import CountriesSelect from "../hooks/CountrySelect";
import ArticlesSpaces from "../hooks/ArticlesSpaces";
import { toast } from "react-toastify";


const backRoute = import.meta.env.VITE_APP_BACK_ROUTE;

function ProfilePage() {

  const [isEditing, setIsEditing] = useState(false);

  const { 
    register, 
    handleSubmit, 
    setValue, 
    watch, 
    formState: { errors } 
  } = useForm();
  if (isEditing && errors.country ) {
    delete errors.country;
  }

  const navigate = useNavigate();

  const isTaxRequired = watch("isTaxRequired");
  const qtyArticles = watch("qtyArticles", 0);
  const isIeeeMember = watch("isIeeeMember");
  const participationType = watch("participationType"); 
  const [userDetails, setUserDetails] = useState(null);
  const [price, setPrice] = useState("");
  const [dollarRate, setDollarRate] = useState(null); //? PRUEBA DOLLARRATE DINÁMICO

  const userEmail = localStorage.getItem("userEmail");

  //! Empiezan cambios

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
      setValue("qtyArticles", 0);
      setValue("articles", []);
    }
  }, [participationType, setValue]); 

  const exchangeRate = ExchangeDollar(); //? PRUEBA DOLLARRATE DINÁMICO

  useEffect(() => { //? PRUEBA DOLLARRATE DINÁMICO
    setDollarRate(exchangeRate); // Cuando el valor de dollarRate cambia, se actualiza en el estado.
  }, [exchangeRate]); //? PRUEBA DOLLARRATE DINÁMICO 
  
  const handleChangePassword = () => {
    navigate("/profile/changepassword");
  };

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
          handleBackendResponse(userData)

          if (userData.admin) { //!
            navigate("/profile/admin");
          }
          
          localStorage.setItem("userId", userData.id);

        userData.isIeeeMember = userData.isIeeeMember === 1 ? "yes" : "no";
        userData.isTems = userData.isTems === 1 ? "yes" : "no";

        userData.taxAmount = userData.isTaxRequired === "no" ? "0" : userData.taxAmount;

        if (userData.participationType === "attendee") {
          userData.qtyArticles = 0;  
          userData.articles = [];  
        } else {
          let formattedArticles = [];
          if (userData.qtyArticles > 0 && userData.participationType === "author") {
            formattedArticles = userData.articles?.slice(0, userData.qtyArticles).map(article => ({
              sequence: article?.sequence || "",
              pages: article?.pages ? parseInt(article.pages, 10) : ""
            })) || [];
          } else {
            formattedArticles = [{ sequence: "", pages: "" }];
          }
          userData.articles = formattedArticles;
        }

        setUserDetails(userData);

        
        if (userData.taxAmount > 0) {
          userData.isTaxRequired = "yes";  
        } else {
            userData.isTaxRequired = "no";
        }
        setUserDetails(userData);

          for (const key in userData) {
            if (userData[key]) {
              setValue(key, userData[key]);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, [setValue, userEmail, exchangeRate, navigate]);

  const handleEdit = () => {
    setIsEditing(true);
    if (userDetails?.country) {
      setValue("country", userDetails.country, { shouldValidate: false, shouldTouch: false });
    }
  };


  

  const handleSave = async (data) => {
    let updatedData = { ...data };

    if (updatedData.isIeeeMember !== undefined) {
      updatedData.isIeeeMember = updatedData.isIeeeMember === "yes";
    }
    if (updatedData.isTems !== undefined) {
      updatedData.isTems = updatedData.isTems === "yes";
    }

    if (updatedData.isTaxRequired === "no") {
      updatedData.taxAmount = "0";  
    }

    if (updatedData.qtyArticles && updatedData.qtyArticles > 0) {
      
      updatedData.articles = updatedData.articles
        .slice(0, updatedData.qtyArticles) 
        .filter(article => article.sequence && article.pages); 

    updatedData.articles = updatedData.articles.map(article => ({
      ...article,
      pages: typeof article.pages === 'string' ? parseInt(article.pages, 10) : article.pages,
    }));
    } else {
      updatedData.articles = []; 
    }

  if (updatedData.qtyArticles === 0) {
    updatedData.articles = [];
  }

    console.log("Datos que se van a enviar:", updatedData);

    if (!userDetails || !userDetails.id) { //! 
      console.error("ID de usuario no disponible");
      return;
    } 

    try {
      const response = await fetch(`${backRoute}/api/users/${userDetails.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });
      const result = await response.json();
      
      console.log("Resultado de la respuesta:", result); // Verifica la respuesta  del servidor
      if (result.success) {
        setIsEditing(false);
        alert("Datos guardados exitosamente");

        const formattedData = {
          occupation: data.occupation,
          isIeeeMember: data.isIeeeMember,  
          isTems: data.isTems,   
          participationType: data.participationType,
          attendanceType: data.attendanceType === "inPerson" ? "In-person" : "Online",
          qtyArticles: data.qtyArticles,
          articles: data.articles,
        };

        const response = await fetch(`${backRoute}/api/payment`, {
          method: "POST",
          body: JSON.stringify(formattedData), 
          headers: { "Content-Type": "application/json" },
        });
        
        const responseData = await response.json();
        console.log("Respuesta de payment:", responseData);

        if (responseData.success && responseData.results?.price !== undefined) {
          setPrice(responseData.results.price); 
        }
      } 
      
    } catch (error) {
      console.error("Error saving user details:", error);
    } //!
  };

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
          userId: userDetails.id,
        }),
      });

      const processPaymentData = await processPaymentResp.json();
      console.log("Respuesta de proceso de pago:", processPaymentData);

      if (processPaymentData.success && processPaymentData.results.checkoutURL) {
        navigate("/");
        window.location.href = processPaymentData.results.checkoutURL;
      } else {
        console.error("Error al obtener la URL de pago", processPaymentData);
      }
    } catch (error) {
      console.error("Error en el proceso de pago:", error);
    }
  };
  

  if (!userDetails) {
    return <p>Cargando...</p>;
  }

  return (
    <div className="flex items-center justify-center ">
      <div className="bg-[#2e5ca6] bg-opacity-85 shadow-lg p-6 rounded-lg w-full max-w-5xl mx-auto ">
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
              <Label htmlFor="lastName">Apellidos</Label>
              <Input type="text" placeholder="Editar apellido"
              {...register("lastName", { required: true })} disabled={!isEditing}/>
              {/* {errors.lastName && (
              <p className="text-red-500 font-medium">El apellido es requerido</p>
              )} */}
            </div>

            <div>
              <Label htmlFor="country">País</Label>
              {isEditing ? (
                <CountriesSelect
                  register={register}
                  errors={errors}
                  disabled={!isEditing}
                  selectedCountry={watch("country")}
                  onChange={(e) => setValue("country", e.target.value)} // <-- Añadido
                />
              ) : (
                <Input
                  type="text"
                  value={watch("country") || ""}
                  disabled
                />
              )}
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
              <Label htmlFor="birthDate">Fecha de nacimiento</Label>
              <Input type="date" placeholder="Editar fecha de nacimiento" {...register("birthDate", { required: true })} disabled={!isEditing} />
              {/* {errors.name && <p className="text-red-500 font-medium">El nombre es requerido</p>} */}
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
              <Label htmlFor="email">Correo</Label>
              <Input type="email" placeholder="Editar correo electrónico"
              {...register("email", { required: true })}
              disabled={!isEditing} />
              {/* {errors.email && (
              <p className="text-red-500 font-medium">El correo es requerido</p>
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
              <Label htmlFor="address">Dirección</Label>
                  <Input type="text" placeholder="Editar dirección"
                  {...register("address", { required: true })} disabled={!isEditing}/>
                  {/* {errors.address && (
                  <p className="text-red-500 font-medium">La dirección es requerida</p>
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
            <Label htmlFor="isIeeeMember">¿Eres miembro de IEEE?</Label>
                <SelectReg
                  {...register("isIeeeMember", { required: true })} disabled={!isEditing}
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
                      {...register("membershipNumber", { required: true })} disabled={!isEditing}
                    />
                    {errors.membershipNumber && (
                      <p className="text-red-500 font-medium">El número de membresía IEEE es requerido</p>
                    )}
  
                    <Label htmlFor="isTems">¿Eres miembro de TEMS?</Label>
                    <SelectReg {...register("isTems", { required: true })} disabled={!isEditing}>
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
            {participationType === "author" && ( 
            <div>
              <Label htmlFor="qtyArticles">Número de artículos</Label>
              <Input type="number" placeholder="Ingresa el número de artículos"
              {...register("qtyArticles", { required: "Este campo es obligatorio", min: 0 })} onWheel={(e) => e.target.blur()} disabled={!isEditing}/>
              {qtyArticles > 0 && (
                <ArticlesSpaces register={register} errors={errors} qtyArticles={qtyArticles} isEditing={isEditing} />)}
                {errors.qtyArticles && (
              <p className="text-red-500 font-medium">El número de artículos es requerido</p>
              )}
            </div>
            )} 
            </div>

            <div>
            <Label htmlFor="isTaxRequired">¿Requiere impuesto?</Label>
              <SelectReg {...register("isTaxRequired", { required: true })} disabled={!isEditing}>
                <option value="">Selecciona</option>
                <option value="yes">Sí</option>
                <option value="no">No</option>
              </SelectReg>
              {errors.isTaxRequired && <p className="text-red-500 font-medium">Este campo es requerido</p>}

              {isTaxRequired === "yes" && (
              <div>
                <Label htmlFor="taxAmount">Pago por impuesto</Label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="Ingresa el pago por impuesto"
                  {...register("taxAmount", { required: true })}
                  onWheel={(e) => e.target.blur()} disabled={!isEditing}
                />
                {errors.taxAmount && <p className="text-red-500 font-medium">El pago por impuesto es requerido</p>}
              </div>
            )}
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
          <div>
              {price && (
              <div className="mt-4 p-4 bg-[#0073ae] text-white rounded-md shadow-md w-[30%] mx-auto">
                <div className="text-center">
                  <h4 className="text-xl font-bold">Cambio exitoso</h4>
                  <p className="mt-2">
                    {price > 0
                      ? `${userDetails.name} ${userDetails.lastName}, usted debe esta ${price}$ por sus modificaciones`
                      : `${userDetails.name} ${userDetails.lastName}, usted no debe nada`}
                  </p>
                </div>
                    
                {price > 0 && (
                  <div className="mt-4 text-center">
                    <button onClick={handlePayment} disabled={!price} className="bg-[#ffffff] hover:bg-[#c01d0f] text-[#0073ae] px-4 py-2 rounded font-semibold hover:text-[#fff] tracking-wide duration-300 shadow-md hover:shadow-lg">
                      Pagar
                    </button>
                  </div>
                )}
              </div>
              )}
              </div>
        </form>
      </div>
    </div>
  );
}

export default ProfilePage;