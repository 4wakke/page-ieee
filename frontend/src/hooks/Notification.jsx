import React, { useEffect } from "react";

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

export default Notification;