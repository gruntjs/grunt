// Pretty colors.
var tags = {
  warn: ['<'.red + 'WARN'.yellow + '>'.red, '</'.red + 'WARN'.yellow + '>'.red],
  fatal: ['<'.red + 'FATAL'.yellow + '>'.red, '</'.red + 'FATAL'.yellow + '>'.red]
};

// DRY it up!
function writeln(e, mode) {
  var msg = String(e.message || e);
  if (mode === 'warn') {
    msg += ' ' + (option('force') ? 'Used --force, continuing.'.underline : 'Use --force to continue.');
  }
  log.writeln([tags[mode][0], msg.yellow, tags[mode][1]].join(' '));
}

// A fatal error occured. Abort immediately.
exports.fatal = function(e) {
  writeln(e, 'fatal');
  exit(1);
};

// The ABORT proptery attempts to work around the whole output-buffering
// process.exit() issue. which is a total mess.
exports.ABORT = null;

// Keep track of error and warning counts.
exports.errors = 0;
exports.warns = 0;

// A warning ocurred. Abort immediately unless -f or --force was used.
exports.warn = function(e) {
  exports.warns++;
  writeln(e, 'warn');
  // If -f or --force aren't used, stop script processing.
  if (!option('force')) {
    log.indent(0).fail('Aborted due to warnings.');
    exports.ABORT = true;
    exit(1);
  }
};

// This gets called at the very end.
exports.report = function() {
  log.indent(0);
  if (exports.warns > 0) {
    log.fail('Done, but with warnings.');
  } else {
    log.success('Done, without errors.');
  }
};
