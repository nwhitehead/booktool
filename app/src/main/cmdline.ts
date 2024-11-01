import commandLineArguments from 'command-line-args';
import commandLineUsage from 'command-line-usage';
import process from 'node:process';
import { handleRender } from './render.ts';

// Command-line arguments
const commandLineOptions = [
    {
        name: 'help',
        alias: 'h',
        type: Boolean,
        description: 'Show this usage guide.',
    },
    {
        name: 'root',
        alias: 'r',
        type: String,
        typeLabel: '{underline path}',
        defaultValue: '.',
        description: 'Set root directory for document generation.',
    },
    {
        name: 'index',
        alias: 'i',
        type: String,
        typeLabel: '{underline filename}',
        lazyMultiple: true,
        defaultValue: ['index.md'],
        description: 'Set starting index filename. Can be set multiple times. The first file that exists will be used.',
    },
];
const logo = `
██████╗  ██████╗  ██████╗ ██╗  ██╗████████╗ ██████╗  ██████╗ ██╗     
██╔══██╗██╔═══██╗██╔═══██╗██║ ██╔╝╚══██╔══╝██╔═══██╗██╔═══██╗██║     
██████╔╝██║   ██║██║   ██║█████╔╝    ██║   ██║   ██║██║   ██║██║     
██╔══██╗██║   ██║██║   ██║██╔═██╗    ██║   ██║   ██║██║   ██║██║     
██████╔╝╚██████╔╝╚██████╔╝██║  ██╗   ██║   ╚██████╔╝╚██████╔╝███████╗
╚═════╝  ╚═════╝  ╚═════╝ ╚═╝  ╚═╝   ╚═╝    ╚═════╝  ╚═════╝ ╚══════╝
`;
const sections = [
    {
        content: logo,
        raw: true,
    },
    {
        header: 'BookTool',
        content: 'Convert Markdown into publications. Generate PDF, ePub, and HTM.',
    },
    {
        header: 'Main Options',
        optionList: commandLineOptions,
    }
];

const usage = commandLineUsage(sections);

function main(options) {
    if (options.help) {
        console.log(usage);
        return;
    }
    console.log(options);
    console.log(options.root);
}

// Main invocation
try {
    const argv = process.argv;
    const options = commandLineArguments(commandLineOptions, { argv });
    main(options);
} catch(ex) {
    console.log(ex);
}
