import { useEffect, useState, useRef } from "react";

const backRoute = import.meta.env.VITE_APP_BACK_ROUTE;

//! EMPIEZAN CAMBIOS DE ESTILO

function AdminPage() {
  useEffect(() => {
    document.body.classList.add("admin-page");

    return () => {
      document.body.classList.remove("admin-page");
    };
  }, []);

  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [nameFilter, setNameFilter] = useState("");
  const [emailFilter, setEmailFilter] = useState("");
  const [startDateFilter, setStartDateFilter] = useState("");
  const [endDateFilter, setEndDateFilter] = useState("");
  const tableRef = useRef(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${backRoute}/api/users`);
        const data = await response.json();

        if (data.success) {
          setUsers(data.results);
          setFilteredUsers(data.results);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const filtered = users.filter((user) => {
      const nameMatch = user.name.toLowerCase().includes(nameFilter.toLowerCase());
      const emailMatch = user.email.toLowerCase().includes(emailFilter.toLowerCase());
  
      const isInDateRange = (user.created_at >= startDateFilter && user.created_at <= endDateFilter) || (!startDateFilter && !endDateFilter);
      
      return nameMatch && emailMatch && isInDateRange;
    });
  
    setFilteredUsers(filtered);
  }, [nameFilter, emailFilter, users, startDateFilter, endDateFilter]);

  // Función para formatear las fechas
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0]; // Devuelve la fecha en formato "YYYY-MM-DD"
  };

  // Función para mostrar el tipo de documento
  const formatDocType = (docType) => {
    const docTypes = {
      identityCard: "Tarjeta de identidad",
      citizenshipIdCard: "Cédula de ciudadanía",
      foreignResidentCard: "Tarjeta de extranjería",
      passport: "Pasaporte",
      specialStayPermit: "Permiso especial de permanencia",
      nationalIdentityDocument: "Documento Nacional de identidad",
      safeConductPass: "Salvoconducto",
    };
    return docTypes[docType] || docType; // Retorna el tipo si está definido, si no, muestra el tipo original
  };

  // Función para mostrar el género
  const formatGender = (gender) => {
    if (gender === "Male") return "Masculino";
    if (gender === "Female") return "Feminino";
    if (gender === "Other") return "Otro";
    return gender;
  };

  // Función para mostrar la ocupación
  const formatOccupation = (occupation) => {
    if (occupation === "professional") return "Profesional";
    if (occupation === "student") return "Estudiante";
    return occupation;
  };

  // Función para mostrar "Sí" o "No" en los campos de membresía
  const formatMembership = (isMember) => {
    return isMember === 1 ? "Sí" : "No";
  };

  // Función para mostrar tipo de participación
  const formatParticipation = (participationType) => {
    if (participationType === "attendee") return "Asistente";
    if (participationType === "author") return "Autor";
    return participationType;
  };

  // Función para mostrar tipo de asistencia
  const formatAttendance = (attendanceType) => {
    if (attendanceType === "online") return "Virtual";
    if (attendanceType === "inPerson") return "En persona";
    return attendanceType;
  };

  // Función para mostrar número de membresía
  const formatMembershipNumber = (membershipNumber) => {
    return membershipNumber ? membershipNumber : "No";
  };

  const topScrollRef = useRef(null);
  const bottomScrollRef = useRef(null);

  useEffect(() => {
    const top = topScrollRef.current;
    const bottom = bottomScrollRef.current;

    if (top && bottom) {
      const syncScroll = (e) => {
        bottom.scrollLeft = e.target.scrollLeft;
      };
      const syncScrollBottom = (e) => {
        top.scrollLeft = e.target.scrollLeft;
      };

      top.addEventListener("scroll", syncScroll);
      bottom.addEventListener("scroll", syncScrollBottom);

      return () => {
        top.removeEventListener("scroll", syncScroll);
        bottom.removeEventListener("scroll", syncScrollBottom);
      };
    }
  }, []);

  const [scrollWidth, setScrollWidth] = useState("2000px");

  useEffect(() => {
    const filtered = users.filter((user) => {
      const nameMatch = user.name
        .toLowerCase()
        .includes(nameFilter.toLowerCase());
      const emailMatch = user.email
        .toLowerCase()
        .includes(emailFilter.toLowerCase());
      return nameMatch && emailMatch;
    });

    setFilteredUsers(filtered);
  }, [nameFilter, emailFilter, users]);

  useEffect(() => {
    if (tableRef.current) {
      setScrollWidth(`${tableRef.current.scrollWidth}px`);
    }
  }, [filteredUsers]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-black text-center">
        Tabla de usuarios
      </h1>
      <div className="mb-4 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Filtro por nombre */}
        <div className="flex flex-col md:w-1/3">
          <label htmlFor="nameFilter" className="text-black font-semibold">
            Filtro por nombre
          </label>
          <input
            id="nameFilter"
            type="text"
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
            className="border border-gray-400 p-2 rounded-md text-black"
            placeholder="Buscar por nombre"
          />
        </div>

        {/* Filtro por correo */}
        <div className="flex flex-col md:w-1/3">
          <label htmlFor="emailFilter" className="text-black font-semibold">
            Filtro por correo
          </label>
          <input
            id="emailFilter"
            type="text"
            value={emailFilter}
            onChange={(e) => setEmailFilter(e.target.value)}
            className="border border-gray-400 p-2 rounded-md text-black"
            placeholder="Buscar por correo"
          />
        </div>

        {/* Filtros de fechas */}
        <div className="flex flex-col md:w-1/3 items-center mt-4 md:mt-0">
          <div className="flex flex-col mb-2 w-full">
            <label htmlFor="startDateFilter" className="text-black font-semibold">
              Fecha de registro inicial
            </label>
            <input
              id="startDateFilter"
              type="date"
              value={startDateFilter}
              onChange={(e) => setStartDateFilter(e.target.value)}
              className="border border-gray-400 p-2 rounded-md text-black"
            />
          </div>

          <div className="flex flex-col mb-2 w-full">
            <label htmlFor="endDateFilter" className="text-black font-semibold">
              Fecha de registro final
            </label>
            <input
              id="endDateFilter"
              type="date"
              value={endDateFilter}
              onChange={(e) => setEndDateFilter(e.target.value)}
              className="border border-gray-400 p-2 rounded-md text-black"
            />
          </div>
        </div>
      </div>

      <div ref={topScrollRef} className="overflow-x-auto mb-2 h-6">
        <div style={{ width: scrollWidth, height: "1px" }}></div>
      </div>

      <div
        ref={bottomScrollRef}
        className="overflow-x-auto white-space: nowrap"
      >
        <table
          ref={tableRef}
          className="min-w-full table-auto border-collapse border border-black text-black"
        >
          <thead>
            <tr>
              <th className="border border-black p-2">Nombre</th>
              <th className="border border-black p-2">Apellido</th>
              <th className="border border-black p-2">País</th>
              <th className="border border-black p-2">Ciudad</th>
              <th className="border border-black p-2">Dirección</th>
              <th className="border border-black p-2">Género</th>
              <th className="border border-black p-2">Fecha de nacimiento</th>
              <th className="border border-black p-2">Tipo de documento</th>
              <th className="border border-black p-2">Número de documento</th>
              <th className="border border-black p-2">Afiliación</th>
              <th className="border border-black p-2">Correo</th>
              <th className="border border-black p-2">Número telefónico</th>
              <th className="border border-black p-2">Ocupación</th>
              <th className="border border-black p-2">Miembro IEEE</th>
              <th className="border border-black p-2">Miembro TEMS</th>
              <th className="border border-black p-2">Número membresía</th>
              <th className="border border-black p-2">Tipo de participación</th>
              <th className="border border-black p-2">Tipo de asistencia</th>
              <th className="border border-black p-2">Cantidad de impuesto</th>
              <th className="border border-black p-2">Número de artículos</th>
              <th className="border border-black p-2">Fecha de registro</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td className="border border-black p-2">{user.name}</td>
                  <td className="border border-black p-2">{user.last_name}</td>
                  <td className="border border-black p-2">{user.country}</td>
                  <td className="border border-black p-2">{user.city}</td>
                  <td className="border border-black p-2">{user.address}</td>
                  <td className="border border-black p-2">
                    {formatGender(user.gender)}
                  </td>
                  <td className="border border-black p-2">
                    {formatDate(user.birth_date)}
                  </td>
                  <td className="border border-black p-2">
                    {formatDocType(user.doc_type)}
                  </td>
                  <td className="border border-black p-2">{user.doc_number}</td>
                  <td className="border border-black p-2">
                    {user.affiliation}
                  </td>
                  <td className="border border-black p-2">{user.email}</td>
                  <td className="border border-black p-2">
                    {user.phone_number}
                  </td>
                  <td className="border border-black p-2">
                    {formatOccupation(user.occupation)}
                  </td>
                  <td className="border border-black p-2">
                    {formatMembership(user.is_ieee_member)}
                  </td>
                  <td className="border border-black p-2">
                    {formatMembership(user.is_tems)}
                  </td>
                  <td className="border border-black p-2">
                    {formatMembershipNumber(user.membership_number)}
                  </td>
                  <td className="border border-black p-2">
                    {formatParticipation(user.participation_type)}
                  </td>
                  <td className="border border-black p-2">
                    {formatAttendance(user.attendance_type)}
                  </td>
                  <td className="border border-black p-2">{user.tax_amount}</td>
                  <td className="border border-black p-2">
                    {user.qty_articles}
                  </td>
                  <td className="border border-black p-2">
                    {formatDate(user.created_at)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="border border-black p-2 text-center">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminPage;
