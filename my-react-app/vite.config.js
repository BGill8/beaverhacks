import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/gemini-process': 'http://localhost:3000', // Proxy requests to backend
      '/text': 'http://localhost:3000'           // Add this for the '/text' endpoint as well
    }
  }
});

