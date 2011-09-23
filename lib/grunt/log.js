var colors = require('colors');

// Temporarily suppress output and indenting changes.
var suppressOutput;
// If this flag is set, suppress indenting. It should be true until a newline
// has been written, at which point it is reset to false.
var suppressIndent;
// The current indent counter.
var indentCount = 0;

// Indent.
exports.indent = function(arg) {
  if (suppressOutput) {
    // If output is suppressed, don't change indenting. A passed function
    // still needs to be invoked, though.
    if (typeof arg === 'function') {
      arg.call(this);
    }
  } else if (typeof arg === 'function') {
    // A function was passed, so increase indenting ONLY inside that function.
    indentCount++;
    arg.call(this);
    indentCount--;
  } else if (arg === 0) {
    // Reset indent to 0. Shouldn't be needed if all .indent / .unindent calls
    // are matched, but is useful in case of a FATAL error.
    indentCount = 0;
  } else {
    // Increment counter by the passed number, otherwise 1.
    indentCount += arg || 1;
  }
  indentCount = Math.max(indentCount, 0);
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
  // Actually write output.
  if (!suppressOutput) {
    process.stdout.write(indentString() + msg);
  }
  // Indentaton is suppressed.
  suppressIndent = true;
  // Chainable!
  return this;
};

// Write a line of output.
exports.writeln = function(msg) {
  // Actually write output.
  this.write(msg + '\n');
  // A newline was written, indentaton is no longersuppressed.
  suppressIndent = false;
  // Chainable!
  return this;
};

// Stuff.
exports.ok = function(msg) { return this.writeln(msg ? '>> '.green + msg : 'OK'.green); };
exports.error = function(msg) { return this.writeln(msg ? '>> '.red + msg : 'ERROR'.red); };
exports.success = function(msg) { return this.writeln(msg.green); };
exports.fail = function(msg) { return this.writeln(msg.red); };
exports.header = function(msg) { return this.writeln(msg.underline); };

// Create explicit "verbose" and "notverbose" functions, one for each already-
// defined log function, that do the same thing but ONLY if -v or --verbose is
// specified (or not specified).
exports.verbose = {};
exports.notverbose = {};

// Iterate over all exported functions.
Object.keys(exports).filter(function(key) {
  return typeof exports[key] === 'function';
}).forEach(function(key) {
  // Like any other log function, but suppresses output (and indenting) if
  // the "verbose" option IS NOT set.
  exports.verbose[key] = function() {
    suppressOutput = !__options.verbose;
    exports[key].apply(this, arguments);
    suppressOutput = false;
    return this;
  }
  // Like any other log function, but suppresses output (and indenting) if
  // the "verbose" option IS set.
  exports.notverbose[key] = function() {
    suppressOutput = __options.verbose;
    exports[key].apply(this, arguments);
    suppressOutput = false;
    return this;
  }
});

// A way to switch between verbose and notverbose modes. For example, this will
// write 'foo' if verbose logging is enabled, otherwise write 'bar':
// verbose.write('foo').or.write('bar');
exports.verbose.or = exports.notverbose;
exports.notverbose.or = exports.verbose;
