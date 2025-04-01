// eslint-disable-next-line no-unused-vars
import React, { useEffect } from "react";
import PropTypes from "prop-types"; // Importa PropTypes

const Notification = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(); // Cierra la notificación después de 5 segundos
    }, 5000);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  return (
    message && (
      <div
        className={`fixed top-0 left-0 right-0 p-4 text-center ${
          type === "success" ? "bg-green-500" : "bg-red-500"
        } text-white`}
      >
        <p>{message}</p>
      </div>
    )
  );
};

// Agregar validación de propiedades
Notification.propTypes = {
  message: PropTypes.string.isRequired, // La propiedad 'message' debe ser una cadena de texto y es requerida
  type: PropTypes.oneOf(["success", "error"]).isRequired, // 'type' debe ser 'success' o 'error', y es requerida
  onClose: PropTypes.func.isRequired, // 'onClose' debe ser una función y es requerida
};

export default Notification;
