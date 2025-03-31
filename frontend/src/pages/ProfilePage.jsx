import { useState, useEffect } from "react";
import { Input, Button, CardReg, Label, Container, SelectReg } from "../components/ui";

function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false); // Estado para controlar si estamos editando
  const [profileData, setProfileData] = useState({
    name: "",
    birthDate: "",
    address: "",
    lastName: "",
    docType: "",
    email: "",
    participationType: "",
    password: "",
    docNumber: "",
    attendanceType: "",
    country: "",
    city: "",
    occupation: "",
    gender: "",
    phoneNumber: "",
    affiliation: "",
    isIeeeMember: "",
    membershipNumber: "",
    isTems: "",
    isTaxRequired: "",
    taxAmount: "",
    qtyArticles: "",
  }); // Estado para almacenar los datos del perfil

  // Función para cargar los datos del perfil usando GET
  const fetchUserData = async () => {
    try {
      const response = await fetch("http://back_route/api/signup", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      if (data.success) {
        setProfileData(data.user); // Actualizamos el estado con los datos del usuario
      } else {
        console.error("Error al obtener los datos del perfil:", data.message);
      }
    } catch (error) {
      console.error("Error al hacer la petición:", error);
    }
  };

  // Cargar los datos cuando el componente se monte
  useEffect(() => {
    fetchUserData(); // Llamamos a la función para obtener los datos
  }, []);

  // Manejar cambios en los inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value }); // Actualizamos el estado con los nuevos valores
  };

  // Función para guardar los cambios en el perfil usando PUT
  const handleSave = async () => {
    try {
      const response = await fetch("http://back_route/api/signup", {
        method: "PUT", // Usamos PUT para actualizar los datos
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileData), // Enviamos los datos actualizados
      });

      const data = await response.json();
      if (data.success) {
        setIsEditing(false); // Salimos del modo de edición
      } else {
        console.error("Error al guardar los datos del perfil:", data.message);
      }
    } catch (error) {
      console.error("Error al enviar los datos al servidor:", error);
    }
  };

  return (
    <Container className="flex items-center justify-center min-h-screen">
      <CardReg>
        <h3 className="text-3xl font-bold text-center mb-2 tracking-wide">Perfil</h3>

        <form className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 tracking-wide" autoComplete="off">
          {/* Nombre */}
          <div>
            <Label htmlFor="name">Nombre</Label>
            {isEditing ? (
              <Input
                type="text"
                name="name"
                value={profileData.name}
                onChange={handleInputChange}
              />
            ) : (
              <p>{profileData.name}</p>
            )}
          </div>

          {/* Apellido */}
          <div>
            <Label htmlFor="lastName">Apellido</Label>
            {isEditing ? (
              <Input
                type="text"
                name="lastName"
                value={profileData.lastName}
                onChange={handleInputChange}
              />
            ) : (
              <p>{profileData.lastName}</p>
            )}
          </div>

          {/* Correo */}
          <div>
            <Label htmlFor="email">Correo</Label>
            {isEditing ? (
              <Input
                type="email"
                name="email"
                value={profileData.email}
                onChange={handleInputChange}
              />
            ) : (
              <p>{profileData.email}</p>
            )}
          </div>

          {/* País */}
          <div>
            <Label htmlFor="country">País</Label>
            {isEditing ? (
              <Input
                type="text"
                name="country"
                value={profileData.country}
                onChange={handleInputChange}
              />
            ) : (
              <p>{profileData.country}</p>
            )}
          </div>

          {/* Ciudad */}
          <div>
            <Label htmlFor="city">Ciudad</Label>
            {isEditing ? (
              <Input
                type="text"
                name="city"
                value={profileData.city}
                onChange={handleInputChange}
              />
            ) : (
              <p>{profileData.city}</p>
            )}
          </div>

          {/* Ocupación */}
          <div>
            <Label htmlFor="occupation">Ocupación</Label>
            {isEditing ? (
              <SelectReg
                name="occupation"
                value={profileData.occupation}
                onChange={handleInputChange}
              >
                <option value="student">Estudiante</option>
                <option value="professional">Profesional</option>
              </SelectReg>
            ) : (
              <p>{profileData.occupation}</p>
            )}
          </div>

          {/* Género */}
          <div>
            <Label htmlFor="gender">Género</Label>
            {isEditing ? (
              <SelectReg
                name="gender"
                value={profileData.gender}
                onChange={handleInputChange}
              >
                <option value="Male">Masculino</option>
                <option value="Female">Femenino</option>
                <option value="Other">Otro</option>
              </SelectReg>
            ) : (
              <p>{profileData.gender}</p>
            )}
          </div>

          {/* Botón de Editar y Guardar */}
          <div className="mt-4 text-center col-span-full">
            {isEditing ? (
              <Button
                className="bg-[#ffffff] hover:bg-[#0073ae] text-[#0073ae] px-4 py-2 rounded font-semibold hover:text-[#fff] tracking-wide duration-300 shadow-md hover:shadow-lg"
                onClick={handleSave}
              >
                Guardar
              </Button>
            ) : (
              <Button
                className="bg-[#ffffff] hover:bg-[#0073ae] text-[#0073ae] px-4 py-2 rounded font-semibold hover:text-[#fff] tracking-wide duration-300 shadow-md hover:shadow-lg"
                onClick={() => setIsEditing(true)}
              >
                Editar
              </Button>
            )}
          </div>
        </form>
      </CardReg>
    </Container>
  );
}

export default ProfilePage;
