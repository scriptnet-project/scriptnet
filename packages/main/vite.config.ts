import { builtinModules } from 'module';
import { defineConfig } from 'vite';
export default defineConfig({
  root: __dirname,
  build: {
    emptyOutDir: true, outDir: '../../dist/main',
    lib: { entry: 'index.ts', formats: ['cjs'], fileName: () => '[name].cjs' },
    minify: true,
    rollupOptions: { external: ['electron', ...builtinModules] },
  },
});
