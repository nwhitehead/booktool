import vue from '@vitejs/plugin-vue';

// electron.vite.config.js
export default {
    main: {
    },
    preload: {
    },
    renderer: {
        plugins: [vue()],
    }
}
