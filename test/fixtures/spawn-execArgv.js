
const FIXTURE = 'constant';

// when --harmony was specified, a `const` cannot be changed
FIXTURE = 'variable';

process.stdout.write(FIXTURE + '\n' + process.execArgv.indexOf('--harmony'));

// Use instead of process.exit to ensure stdout/stderr are flushed
// before exiting in Windows (Tested in Node.js v0.8.7)
require('exit')(0);
