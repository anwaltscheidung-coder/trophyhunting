import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    // Auch ältere iPhones und iPads (ab iOS 14) unterstützen.
    target: ['es2020', 'safari14', 'chrome90', 'firefox90', 'edge90'],
  },
});
