

import { hyphenate } from 'hyphen/en';
import { texLinebreakDOM } from 'tex-linebreak2';
import { Previewer } from './pagedjs/src/index.js';

let paged = new Previewer();

document.getElementById('buttonAddHyphens').onclick = async function() {
    const elems = document.querySelectorAll('p');
    for (const elem of elems) {
        elem.innerHTML = await hyphenate(elem.innerHTML);
    }
}

document.getElementById('buttonPaginate').onclick = async function() {
    await paged.preview();
    for (const para of document.querySelectorAll('p')) {
        const style = getComputedStyle(para);
        console.log(style);
        texLinebreakDOM(para, {
            justify: style['text-align'] === 'justify',
            updateOnWindowResize: false,
            addInfiniteGlueToFinalLine: !(style['text-align-last'] === 'justify'),
        });
    }
}
