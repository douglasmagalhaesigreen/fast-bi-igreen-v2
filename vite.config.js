import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 4200,  // PORTA PERSONALIZADA
    host: '0.0.0.0', // Permite acesso de outros dispositivos na rede
    strictPort: true, // Se a porta estiver em uso, falha em vez de tentar outra
    proxy: {
      '/api': {
        target: 'http://localhost:5555',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  preview: {
    port: 4200, // Mesma porta para preview de produção
    host: '0.0.0.0'
  }
})
