import { createApp } from 'vue';
import Test2 from './test2.vue';

import './test2style.css';

const app = createApp(Test2);

console.log('Going to mount #app');
app.mount('#app');

