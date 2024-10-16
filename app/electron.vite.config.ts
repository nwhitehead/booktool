import vue from '@vitejs/plugin-vue';
import { defineConfig, externalizeDepsPlugin } from 'electron-vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

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
    }
});
