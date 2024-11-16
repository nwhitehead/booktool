
import { hyphenate } from 'hyphen/en';
import { texLinebreakDOM } from 'tex-linebreak2';
import { Previewer, Handler } from 'pagedjs';

let paged = new Previewer();

document.getElementById('buttonRegister').onclick = function() {

    class MyHandler extends Handler {
        constructor(chunker, polisher, caller) {
            super(chunker, polisher, caller);
        }

        // beforePageLayout(page) {
        // }
        layoutNode(node) {
            const width = 160;
            if (node.nodeName === 'P') {
                console.log('layoutNode', node);
                texLinebreakDOM(node, { justify: true, stripSoftHyphensFromOutputText: false, updateOnWindowResize: false, lineWidth: width });
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
