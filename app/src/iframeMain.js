// iframeMain.js
import '/node_modules/katex/dist/katex.min.css';
import bookCssRaw from '../test/book.css?raw';
import { Previewer } from 'pagedjs';

//import '../test/book.css';
// Create URL to raw string imported from file (bypasses HMR)
const bookCssUrl = URL.createObjectURL((new Blob([bookCssRaw], { type: 'text/css' })));

window.PagedConfig = {
    auto: false,
    after: (flow) => {
        console.log('after', flow);
    },
};

const content = document.getElementById('content');

function addStyle(raw) {
    let newstyle = document.createElement('style');
    newstyle.innerHTML = raw;
    document.getElementsByTagName('head')[0].appendChild(newstyle);
}

window.addEventListener('message', async (msg) => {
    const { action, payload } = msg.data;
    console.log(`Received action=${action}`);
    if (action == 'update') {
        content.innerHTML = payload;
    }
    if (action == 'paged') {
        console.log('Page...');
        content.innerHTML = '';
        //addStyle(bookCssRaw);
        const paged = new Previewer();
        paged.preview(payload, [bookCssUrl], content);
    }
});
