import commandLineArguments from 'command-line-args';
import process from 'node:process';
import { handleRender } from './render.ts';

const introMessage = `
BookTool
========

Convert Markdown into publications.

`;

// Command-line arguments
const commandLineOptions = [
    { name: 'help', alias: 'h', type: Boolean },
    { name: 'root', alias: 'r', type: String, defaultOption: '.' },
];

function main(options) {
    if (options.help) {

    }
    console.log(introMessage);
    console.log(options);
}

// Main invocation
try {
    const argv = process.argv;
    const options = commandLineArguments(commandLineOptions, { argv });
    main(options);
} catch(ex) {
    console.log(ex);
}
