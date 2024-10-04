import vue from '@vitejs/plugin-vue';
import { defineConfig, externalizeDepsPlugin } from 'electron-vite';

// electron.vite.config.js
export default defineConfig({
    main: {
        plugins: [externalizeDepsPlugin()],
    },
    preload: {
        plugins: [externalizeDepsPlugin()],
    },
    renderer: {
        plugins: [vue()],
    }
});
