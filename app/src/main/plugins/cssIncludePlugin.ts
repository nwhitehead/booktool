/**
 * This is a markdown-it plugin for collecting CSS styles from Markdown.
 *
 * Syntax is: !!!style FILENAME.css!!!
 *
 * The idea is that you can refer to multiple fragments of CSS. These fragments
 * are read and collected into the markdown-it environment for later processing
 * or rendering. Inline CSS styles are not collected or processed.
 * 
 * Output is in env environment, fields:
 *     cssFiles: array of filenames that were included
 *     css: array of CSS file contents
 *
 * Note that CSS files are not processed for recursive includes. The include
 * syntax is for Markdown content only. Included CSS is put into an array of CSS
 * styles. If a file is included more than once it will be pushed more than once
 * in the array. Where the CSS is included only matters for ordering of the
 * results, it is otherwise location independent.
 */
import path from 'node:path';
import fs from 'node:fs';
import sass from 'sass';

const INCLUDE_RE = /!{3}\s*style(.+?)!{3}/i;
const BRACES_RE = /\((.+?)\)/i;

export default (md, options) => {
    const defaultOptions = {
        root: '.',
        atRoot: '.',
        getRootDir: (pluginOptions/*, state, startLine, endLine*/) => pluginOptions.root,
        includeRe: INCLUDE_RE,
        throwError: true,
        bracesAreOptional: true,
        notFoundMessage: 'File \'{{FILE}}\' not found.',
        wrongExtensionMessage: 'File \'{{FILE}}\' does not end with \'.css\' or \'.scss\''
    };

    if (typeof options === 'string') {
        options = {
            ...defaultOptions,
            root: options
        };
    } else {
        options = {
            ...defaultOptions,
            ...options
        };
    }

    const _processStyle = (src, env, root, atRoot) => {
        let cap, filePath, cssSrc, errorMessage;

        while ((cap = options.includeRe.exec(src))) {
            let includePath = cap[1].trim();
            const sansBracesMatch = BRACES_RE.exec(includePath);

            if (!sansBracesMatch && !options.bracesAreOptional) {
                errorMessage = `INCLUDE statement '${src.trim()}' MUST have '()' braces around the include path ('${includePath}')`;
            } else if (sansBracesMatch) {
                includePath = sansBracesMatch[1].trim();
            } else if (!/^\s/.test(cap[1])) {
                // path SHOULD have been preceeded by at least ONE whitespace character!
                /* eslint max-len: "off" */
                errorMessage = `INCLUDE statement '${src.trim()}': when not using braces around the path ('${includePath}'), it MUST be preceeded by at least one whitespace character to separate the include keyword and the include path.`;
            }

            if (!errorMessage) {
                if (includePath.startsWith('@/')) {
                    filePath = path.resolve(atRoot, `./${includePath.slice(2)}`);
                } else {
                    filePath = path.resolve(root, includePath);
                }
                // check if child file has css extension and exists
                if (!filePath.endsWith('.css') && !filePath.endsWith('.scss')) {
                    // filePath does not have css extension
                    errorMessage = options.wrongExtensionMessage.replace('{{FILE}}', filePath);
                } else if (!fs.existsSync(filePath)) {
                    // child file does not exist
                    errorMessage = options.notFoundMessage.replace('{{FILE}}', filePath);
                }
            }

            // check if there were any errors
            if (errorMessage) {
                throw new Error(errorMessage);
            }
            // Record which files are read
            env.cssFiles = env.cssFiles ? env.cssFiles : [];
            env.cssFiles.push(filePath);
            // get content of file
            //cssSrc = fs.readFileSync(filePath, 'utf8');
            cssSrc = sass.compile(filePath).css;
            env.css = env.css ? env.css : [];
            env.css.push(cssSrc);

            // remove include part from source
            src = src.slice(0, cap.index) + src.slice(cap.index + cap[0].length, src.length);
        }
        return src;
    };

    const _includeFileParts = (state, startLine, endLine/*, silent*/) => {
        state.src = _processStyle(state.src, state.env, options.root, options.atRoot);
    };

    md.core.ruler.before('normalize', 'include', _includeFileParts);
};
