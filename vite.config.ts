import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    https: {
      key: fs.readFileSync('./cert/key.pem'),
      cert: fs.readFileSync('./cert/cert.pem'),
    },
    host: true, // bind ke semua network interface
    port: 5173, // port default Vite
    cors: true, // izinkan akses dari host lain
    allowedHosts: true,
  },

});
