import { useEffect } from "react";

export const useRealVh = () => {
  useEffect(() => {
    const updateRealVh = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--real-vh', `${vh}px`);
    };

    updateRealVh(); // Inicializar el valor al cargar
    window.addEventListener('resize', updateRealVh); // Actualizar en cambios de tamaño

    return () => {
      window.removeEventListener('resize', updateRealVh); // Limpiar el evento
    };
  }, []);
};
