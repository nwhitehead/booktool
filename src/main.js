// main.js

import { createApp } from 'vue';
import App from './App.vue';

import VueCodemirror from 'vue-codemirror';

// import Prism from 'prismjs';
// import 'prismjs/components/prism-python.js';
// import 'prismjs/plugins/custom-class/prism-custom-class';
// import './style.css';

// // Set Prism to use custom classes, to avoid conflicts with Bulma (specifically ".number" and ".tag" class names)
// Prism.plugins.customClass.map({ number: "prism-number", tag: "prism-tag" });

const app = createApp(App);
app.use(VueCodemirror, {
    // Set global Codemirror extension default list to empty
    // Otherwise we always get basic-setup extensions and cannot turn them off in components
    extensions: []
});
app.mount('#app');
