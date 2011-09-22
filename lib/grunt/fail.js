var log = grequire('log');

exports.fatal = function(e) {
  log.writeln('FATAL '.red + e);
  process.exit(1);
};

var warnCount = 0;
exports.warn = function(e) {
  warnCount++;
  log.writeln('WARN '.red + e);
  // If -f or --force aren't used, stop script processing.
  if (!__options.force) {
    //process.exit(1);
  }
};

exports.report = function() {
  if (warnCount > 0) {
    log.writeln('Done, with warnings.'.red);
  } else {
    log.writeln('Done.'.green);
  }
};
