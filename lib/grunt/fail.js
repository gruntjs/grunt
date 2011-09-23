var log = grequire('log');

// Pretty colors.
var tags = {
  warn: '<'.red + 'WARN'.yellow + '>'.red,
  fatal: '<'.red + 'FATAL'.yellow + '>'.red
};

// DRY it up!
function writeln(e, mode) {
  var msg = String(e.message || e);
  if (mode === 'warn') {
    msg += __options.force ? ' Used --force, continuing.' : ' Use --force to continue.';
  }
  log.writeln([tags[mode], msg.yellow, tags[mode]].join(' '));
}

// A fatal error occured. Abort immediately.
exports.fatal = function(e) {
  writeln(e, 'fatal');
  process.exit(1);
};

var warnCount = 0;
// A warning ocurred. Abort immediately unless -f or --force was used.
exports.warn = function(e) {
  warnCount++;
  writeln(e, 'warn');
  // If -f or --force aren't used, stop script processing.
  if (!__options.force) {
    log.fail('Aborted due to warnings.');
    process.exit(1);
  }
};

// This gets called at the very end.
exports.report = function() {
  if (warnCount > 0) {
    log.fail('Done, with warnings.');
  } else {
    log.success('Done, without error.');
  }
};
