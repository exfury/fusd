import { viteCommonjs } from '@originjs/vite-plugin-commonjs';
import * as path from 'path';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths';
import { nodePolyfills } from 'vite-plugin-node-polyfills'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      'styled-components':
        'styled-components/dist/styled-components.browser.esm.js',
      'process': path.resolve(__dirname, 'src/polyfills/process-es6.js'),
    },
  },
  plugins: [viteCommonjs(), tsconfigPaths(), svgr(), nodePolyfills({
    include:["stream"]
  })],
  build: {
    sourcemap: true,
    outDir: 'build',
  },
});
