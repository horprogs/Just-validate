/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { defineConfig } from 'vite';
import { resolve } from 'path';

const config = {
  es: {
    entry: resolve(__dirname, 'src/main.ts'),
    fileName: () => 'just-validate.es.js',
  },
  umd: {
    entry: resolve(__dirname, 'src/main.umd.ts'),
    fileName: () => 'just-validate.production.min.js',
  },
};

const currentConfig = config[process.env.OUTPUT_FORMAT];

if (currentConfig === undefined) {
  throw new Error('OUTPUT_FORMAT is not defined or is not valid');
}

export default defineConfig(({ command }) => {
  if (command === 'serve') {
    return {};
  } else {
    // command === 'build'
    return {
      build: {
        outDir: 'dist',
        emptyOutDir: false,
        lib: {
          ...currentConfig,
          formats: [process.env.OUTPUT_FORMAT],
          name: 'JustValidate',
        },
        minify: 'terser',
        rollupOptions: {
          output: {
            exports: process.env.OUTPUT_FORMAT === 'es' ? 'named' : 'default',
          },
        },
      },
    };
  }
});
