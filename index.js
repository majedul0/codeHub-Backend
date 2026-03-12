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
    .command('add','Add a new file',  {},add)
    .command('commit','Commit changes',  {},commit)
    .command('push','Push changes',  {},push)
    .command('pull','Pull changes',  {},pull)
    .command('revert','Revert changes',  {},revert)
    .demandCommand(1, 'You need at least one command before moving on')
    .help()
    .argv;