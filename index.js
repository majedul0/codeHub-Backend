import yargs from "yargs";
import { initrepo } from "./controllers/init.js";

import { hideBin } from "yargs/helpers";
import add from "./controllers/add.js";
import commit from "./controllers/commit.js";
import push from "./controllers/push.js";
import pull from "./controllers/pull.js";
import revert from "./controllers/revert.js";


yargs(hideBin(process.argv))
    .command('init','Initialize',  {},initrepo)
    .command('add <file>','Add a new file', (yargs) => {
        yargs.positional('file', {
            describe: 'The file to add',
            type: 'string'
        });
    },add)
    .command('commit <message>','Commit changes', (yargs) => {
        yargs.positional('message', {
            describe: 'The commit message',
            type: 'string'
        });
    },commit)
    .command('push','Push changes',  {},push)
    .command('pull','Pull changes',  {},pull)
    .command('revert <commitID>','Revert changes', (yargs) => {
        yargs.positional('commitID', {
            describe: 'The commit to revert',
            type: 'string'
        });
    },revert)
    .demandCommand(1, 'You need at least one command before moving on')
    .help()
    .argv;