import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// React Native Web preview. Aliases react-native -> react-native-web and resolves
// .web.* platform files first so Icon.web.tsx (DOM phosphor) shadows the native
// Icon.tsx — keeping react-native-svg / phosphor-react-native out of the web bundle.
export default defineConfig({
  plugins: [react()],
  define: {
    __DEV__: 'true',
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    global: 'globalThis',
  },
  resolve: {
    alias: { 'react-native': 'react-native-web' },
    extensions: ['.web.tsx', '.web.ts', '.web.jsx', '.web.js', '.tsx', '.ts', '.jsx', '.js', '.json'],
  },
  optimizeDeps: {
    esbuildOptions: {
      resolveExtensions: ['.web.js', '.js', '.ts', '.tsx', '.jsx'],
      loader: { '.js': 'jsx' },
    },
  },
});
