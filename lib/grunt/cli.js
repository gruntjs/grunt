var path = require('path');
var nopt = require('nopt');

// Default options.
var options = exports.optlist = {
  help: {
    short: 'h',
    info: 'Display this help text.',
    type: Boolean
  },
  build: {
    short: 'b',
    info: 'Specify an alternate grunt.json build file.',
    type: path
  },
  force: {
    short: 'f',
    info: 'A way to force your way past warnings. Want a suggestion? Don\'t use this option, fix your code.',
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
