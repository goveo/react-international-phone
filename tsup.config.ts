import { sassPlugin } from 'esbuild-sass-plugin';
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  esbuildPlugins: [sassPlugin()],
  clean: true,
  minify: 'terser',
  format: ['esm', 'cjs'],
  dts: true,
  outDir: 'build',
});
