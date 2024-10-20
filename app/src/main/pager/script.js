
// Main thread has already added paged.min.js to headless browser context.
// Already detects when it is in a browser context and puts in globalThis.
const { Previewer } = globalThis.PagedModule;

function buildCssContentUrl(contents) {
    /// Create a data URL that refers to already loaded CSS contents
    const blob = new Blob([contents], { type: 'text/css' });
    return URL.createObjectURL(blob);
}

async function paginate(cssRaw) {
    // Paginate contents, return page size in pixels
    let paged = new Previewer();
    const cssUrl = buildCssContentUrl(cssRaw);
    console.log(`cssUrl=${cssUrl}`);
    // Call with default arguments, just paginates everything and replaces body
    await paged.preview(undefined, [cssUrl], undefined);
    // Get page size by looking at offsetWidth and height of first page
    const page = document.getElementsByClassName('pagedjs_page')[0];
    return [page.offsetWidth, page.offsetHeight];
}
