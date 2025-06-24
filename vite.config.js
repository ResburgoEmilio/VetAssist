import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Esto permite conexiones desde cualquier IP de tu red local
    port: 5173, // Opcional: fuerza el puerto si querés
  },
})
