/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig(({ command }) => {
  if (command === 'serve') {
    return {};
  } else {
    // command === 'build'
    return {
      build: {
        lib: {
          entry: path.resolve(__dirname, 'src/main.ts'),
          name: 'JustValidate',
          fileName: (format) =>
            `just-validate.${format === 'umd' ? 'production.min' : format}.js`,
        },
        minify: 'terser',
        rollupOptions: {},
      },
    };
  }
});
