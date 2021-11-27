import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig(({ command, mode }) => {
  if (command === 'serve') {
    if (mode === 'development') {
      return {};
    } else {
      return {
        root: 'site',
      };
    }
  } else {
    // command === 'build'
    return {
      root: 'site',
      build: {
        rollupOptions: {
          input: {
            main: path.resolve(__dirname, 'site/index.html'),
            examples: path.resolve(__dirname, 'site/examples.html'),
          },
        },
      },
    };
  }
});
