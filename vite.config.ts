import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Publicado em https://<usuario>.github.io/decalque/
export default defineConfig({
  base: '/decalque/',
  plugins: [react()],
})
