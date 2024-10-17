import vue from '@vitejs/plugin-vue';
import { defineConfig, externalizeDepsPlugin } from 'electron-vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import { resolve } from 'path';

// electron.vite.config.js
export default defineConfig({
    main: {
        plugins: [
            externalizeDepsPlugin(),
        ],
    },
    preload: {
        plugins: [
            externalizeDepsPlugin(),
        ],
    },
    renderer: {
        plugins: [
            vue(),
            nodePolyfills({
                globals: {
                    Buffer: true,
                },
            }),
        ],
        build: {
            rollupOptions: {
                input: {
                    'main': resolve(__dirname, 'src/renderer/index.html'),
                    'pdf': resolve(__dirname, 'src/renderer/pdf.html'),
                },
            },
        },
    }
});
