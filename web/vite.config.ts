import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/lineas': 'http://localhost:8080',
      '/semillas': 'http://localhost:8080',
      '/compras-semilla': 'http://localhost:8080',
      '/cosechas': 'http://localhost:8080',
      '/ventas': 'http://localhost:8080',
      '/medidas': 'http://localhost:8080',
      '/api/status': 'http://localhost:8080',
      '/reportes': 'http://localhost:8080',
      '/comparativo-nota': 'http://localhost:8080',
      '/export': 'http://localhost:8080'
    }
  }
})
