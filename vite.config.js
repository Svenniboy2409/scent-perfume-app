import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  // Relative base so the built assets resolve correctly when the app is served
  // from a sub-path (e.g. GitHub Pages: https://<user>.github.io/<repo>/).
  base: './',
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
  },
})
