import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig(({ command }) => {
  if (command === 'serve') {
    return {};
  } else {
    // command === 'build'
    return {
      build: {
        // root: '/site/',
        rollupOptions: {
          input: {
            main: path.resolve(__dirname, 'index.html'),
            examples: path.resolve(__dirname, 'examples/index.html'),
            documentation: path.resolve(__dirname, 'documentation/index.html'),
          },
        },
      },
    };
  }
});
