import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    host: true, // bind ke semua network interface
    port: 5173, // port default Vite
    cors: true, // izinkan akses dari host lain
  },

});
