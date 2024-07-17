import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: 'localhost', // Esto permite que el servidor sea accesible desde otras redes
    port: 5173, // Cambia esto al puerto que desees
  },
})
