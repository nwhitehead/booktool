// iframeMain.js
import { Previewer } from 'pagedjs';

// Make sure math works
import '/node_modules/katex/dist/katex.min.css';

const content = document.getElementById('content');

window.addEventListener('message', async (msg) => {
    const { action, payload } = msg.data;
    console.log(`Received action=${action}`);
    if (action == 'update') {
        // Remove any inserted styles
        document.querySelectorAll('[data-pagedjs-inserted-styles=true]').forEach(elem => elem.remove());
        content.innerHTML = payload.html;
    }
    if (action == 'paged') {
        content.innerHTML = '';
        const paged = new Previewer();
        // Create URL to raw string passed here
        // (Other import mechanisms hit HMR which causes problems for Previewer)
        const cssUrl = URL.createObjectURL((new Blob([payload.css || ''], { type: 'text/css' })));
        paged.preview(payload.html || '', [cssUrl], content);
    }
});

function findSource(elem) {
    /// Find sourcemap range of elem
    /// Trickles up the DOM looking for data-source-line-start/end
    while (elem) {
        const start = elem.getAttribute('data-source-line-start');
        const end = elem.getAttribute('data-source-line-end');
        if (start && end) {
            return [start, end];
        }
        elem = elem.parentElement;
    }
    // Could not find sourcemap range anywhere in ancestors
    return null;
}

window.addEventListener('dblclick', async (evt) => {
    const range = findSource(evt.target);
    // Communicate back to parent containing iframe
    window.top.postMessage({
       action: 'dblclick',
       payload: range,
    });
});
