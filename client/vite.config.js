import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      // Thêm các alias cần thiết
    }
  },
  define: {
    global: 'window', // Fix for sockjs-client
  },
})
