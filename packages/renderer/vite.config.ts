import { join } from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import pkg from '../../package.json';
export default defineConfig({
  root: __dirname,
  plugins: [react()],
  base: './',
  build: { emptyOutDir: true, outDir: '../../dist/renderer', sourcemap: false },
  resolve: { alias: {
    '@': join(__dirname, 'src'),
    'Components': join(__dirname, 'src', 'components'),
    'Hooks': join(__dirname, 'src', 'hooks'),
    'Store': join(__dirname, 'src', 'store'),
  } },
  server: { port: pkg.env.PORT },
});
