// main.js

import { createApp } from 'vue';
import App from './App.vue';

import VueCodemirror from 'vue-codemirror';

const app = createApp(App);
app.use(VueCodemirror, {
    // Set global Codemirror extension default list to empty
    // Otherwise we always get basic-setup extensions and cannot turn them off in components
    extensions: []
});
app.mount('#app');
