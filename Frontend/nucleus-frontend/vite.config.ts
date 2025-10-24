import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // allows network access
    port: 3000,
    strictPort: false,
    allowedHosts: ['.loca.lt'], // allow any subdomain of loca.lt
  },
});
