
import { hyphenate } from 'hyphen/en';
import { texLinebreakDOM } from 'tex-linebreak2';
import { Previewer, Handler } from './pagedjs/src/index.js';

let paged = new Previewer();

document.getElementById('buttonRegister').onclick = function() {

    class MyHandler extends Handler {
        constructor(chunker, polisher, caller) {
            super(chunker, polisher, caller);
        }

        // beforePageLayout(page) {
        // }
        layoutNode(node, layout) {
            const width = layout.bounds.width;
            if (node.nodeName === 'P') {
                console.log('layoutNode', node, layout.bounds.width);
                texLinebreakDOM(node, {
                    justify: true,
                    stripSoftHyphensFromOutputText: false,
                    updateOnWindowResize: false,
                    lineWidth: width / 2,
                    measureFn: (word) => 1,
                });
            }
        }
    }
    paged.registerHandlers(MyHandler);
}

document.getElementById('buttonAddHyphens').onclick = async function() {
    const elems = document.querySelectorAll('p');
    for (const elem of elems) {
        elem.innerHTML = await hyphenate(elem.innerHTML);
    }
}

document.getElementById('buttonPaginate').onclick = function() {
    paged.preview();
}
