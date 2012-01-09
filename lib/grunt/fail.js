/*
 * grunt
 * https://github.com/cowboy/grunt
 *
 * Copyright (c) 2012 "Cowboy" Ben Alman
 * Licensed under the MIT license.
 * http://benalman.com/about/license/
 */

// Error codes
// 1. Generic error.
// 2. Config file not found.
// 3. Generic task failed.
// 10. Uglify-JS error.
// 11. Banner generation error.
// 20. Init error.
// 61-69. Nodeunit errors.

// DRY it up!
function writeln(e, mode) {
  log.muted = false;
  // Pretty colors.
  var tags = {
    warn: ['<'.red + 'WARN'.yellow + '>'.red, '</'.red + 'WARN'.yellow + '>'.red],
    fatal: ['<'.red + 'FATAL'.yellow + '>'.red, '</'.red + 'FATAL'.yellow + '>'.red]
  };
  var msg = String(e.message || e) + '\x07'; // Beep!
  if (mode === 'warn' && !option('silentforce')) {
    msg += ' ' + (option('force') ? 'Used --force, continuing.'.underline : 'Use --force to continue.');
  }
  log.writeln([tags[mode][0], msg.yellow, tags[mode][1]].join(' '));
}

// A fatal error occured. Abort immediately.
exports.fatal = function(e, errcode) {
  writeln(e, 'fatal');
  process.reallyExit(typeof errcode === 'number' ? errcode : 1);
};

// Keep track of error and warning counts.
exports.errorcount = 0;
exports.warncount = 0;

// A warning ocurred. Abort immediately unless -f or --force was used.
exports.warn = function(e, errcode) {
  exports.warncount++;
  writeln(e, 'warn');
  // If -f or --force aren't used, stop script processing.
  if (!option('force') && !option('silentforce')) {
    log.writeln().fail('Aborted due to warnings.');
    process.reallyExit(typeof errcode === 'number' ? errcode : 2);
  }
};

// This gets called at the very end.
exports.report = function() {
  if (exports.warncount > 0) {
    log.writeln().fail('Done, but with warnings.');
  } else {
    log.writeln().success('Done, without errors.');
  }
};
