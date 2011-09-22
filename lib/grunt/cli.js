var nopt = require('nopt');

// Default options.
var options = exports.optlist = {
  help: {
    short: 'h',
    info: 'Display this help text.',
    type: Boolean
  },
  json: {
    short: 'j',
    info: 'Specify an alternate grunt.json config file.',
    type: String
  },
  tasks: {
    short: 't',
    info: 'List all available tasks.',
    type: String
  },
  debug: {
    short: 'd',
    info: 'Allow console, alert, etc in lint (JSHint "devel"). Also writes debugging comments into built "dev" scripts.',
    type: Boolean
  },
  force: {
    short: 'f',
    info: 'A way to force your way past errors. Want a suggestion? Don\'t use this option, fix your errors.',
    type: Boolean
  },
  write: {
    info: 'Write files. For a dry run, use --no-write.',
    type: Boolean
  },
  verbose: {
    short: 'v',
    info: 'Verbose output. Lots more chatter. Good if you like chatter. Yep.',
    type: Boolean
  },
  silent: {
    short: 's',
    info: 'Silent. Only complains if there were errors.',
    type: Boolean
  }
};

// Parse `options` into a form that nopt can handle.
var aliases = {};
var known = {};

Object.keys(options).forEach(function(key) {
  var option = options[key];
  var short = option.short;
  if (short) {
    aliases[short] = '--' + key; 
  }
  known[key] = option.type;
});

var parsed = nopt(known, aliases, process.argv, 2);
exports.tasks = parsed.argv.remain;
exports.options = parsed;
delete parsed.argv;
