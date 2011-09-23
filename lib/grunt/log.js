var colors = require('colors');

// If this flag is set, suppress indenting. It should be true until a newline
// has been written, at which point it is reset to false.
var suppressIndent;
// The current indent counter.
var indentCount = 0;

// Indent.
exports.indent = function(arg) {
  if (typeof arg === 'function') {
    indentCount++;
    arg();
    indentCount--;
  } else {
    indentCount += arg || 1;
  }
  // Chainable!
  return this;
};

// Unindent.
exports.unindent = function() {
  return this.indent(-1);
};

// The actual indent string, based on the indentCount.
function indentString() {
  return suppressIndent ? '' : Array(indentCount + 1).join(' ');
}

// Write output.
exports.write = function(msg) {
  // Abort if -s or --silent is used.
  if (__options.silent) { return; }
  // Actually write output.
  process.stdout.write(indentString() + msg);
  suppressIndent = true;
  // Chainable!
  return this;
};

// Write a line of output.
exports.writeln = function(msg) {
  this.write(msg + '\n');
  suppressIndent = false;
  return this;
};

exports.ok = function(msg) { return this.writeln(msg ? '>> '.green + msg : 'OK'.green); };
exports.error = function(msg) { return this.writeln(msg ? '>> '.red + msg : 'ERROR'.red); };
exports.success = function(msg) { return this.writeln(msg.green); };
exports.fail = function(msg) { return this.writeln(msg.red); };
exports.header = function(msg) { return this.writeln(msg.underline); };

// Create explicit "verbose" functions, one for each already-defined log
// function, that do the same thing but ONLY if -v or --verbose is used.
exports.verbose = {};
exports.notverbose = {};
Object.keys(exports).filter(function(key) {
  return typeof exports[key] === 'function';
}).forEach(function(key) {
  exports.verbose[key] = function() {
    __options.verbose && exports[key].apply(this, arguments);
    return this;
  }
  exports.notverbose[key] = function() {
    __options.verbose || exports[key].apply(this, arguments);
    return this;
  }
});
